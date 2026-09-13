import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sitemapPath = path.join(
  root,
  ".tasks",
  "clone-scale.com",
  "sitemaps",
  "scale.com_sitemap-0.xml.xml",
);
const outputPath = path.join(
  root,
  ".tasks",
  "clone-scale.com",
  "core-page-metadata.json",
);

const sitemap = await fs.readFile(sitemapPath, "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);

function decode(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function match(html, pattern) {
  const value = html.match(pattern)?.[1] || "";
  return decode(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

async function inspect(url) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      },
      signal: AbortSignal.timeout(30_000),
    });
    const html = await response.text();
    const pathname = new URL(response.url).pathname;

    return {
      sourceUrl: url,
      finalUrl: response.url,
      pathname,
      status: response.status,
      title: match(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description:
        match(
          html,
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
        ) ||
        match(
          html,
          /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
        ),
      heading:
        match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
        match(html, /data-testid=["']hero-heading["'][^>]*>([\s\S]*?)<\//i),
      ogImage:
        match(
          html,
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["'][^>]*>/i,
        ) ||
        match(
          html,
          /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["'][^>]*>/i,
        ),
      bytes: Buffer.byteLength(html),
      elapsedMs: Date.now() - startedAt,
      error: null,
    };
  } catch (error) {
    return {
      sourceUrl: url,
      finalUrl: null,
      pathname: new URL(url).pathname,
      status: null,
      title: "",
      description: "",
      heading: "",
      ogImage: "",
      bytes: 0,
      elapsedMs: Date.now() - startedAt,
      error: String(error),
    };
  }
}

const results = [];
const queue = [...urls];
const workerCount = 5;

await Promise.all(
  Array.from({ length: workerCount }, async () => {
    while (queue.length) {
      const url = queue.shift();
      results.push(await inspect(url));
    }
  }),
);

results.sort((a, b) => a.pathname.localeCompare(b.pathname));

await fs.writeFile(
  outputPath,
  `${JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      sourceSitemap: "https://scale.com/sitemap-0.xml",
      count: results.length,
      pages: results,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      pages: results.length,
      ok: results.filter((page) => page.status === 200).length,
      redirects: results.filter(
        (page) => page.status && page.sourceUrl !== page.finalUrl,
      ).length,
      missingHeadings: results.filter((page) => !page.heading).length,
      errors: results.filter((page) => page.error).length,
    },
    null,
    2,
  ),
);
