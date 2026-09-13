import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "public", "fonts");
const fonts = [
  [
    "AeonikPro-Regular.woff2",
    "https://scale.com/_next/static/immutable/media/AeonikPro_Regular-s.p.00jgyx3zdprqc.woff2",
  ],
  [
    "AeonikMono-Regular.woff2",
    "https://scale.com/_next/static/immutable/media/AeonikMono_Regular-s.2ntkz9eht4hjg.woff2",
  ],
];

await fs.mkdir(outputDir, { recursive: true });

for (const [name, url] of fonts) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    throw new Error(`${name}: HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1_000) {
    throw new Error(`${name}: suspiciously small response (${bytes.length})`);
  }
  await fs.writeFile(path.join(outputDir, name), bytes);
  console.log(`${name}\t${bytes.length}`);
}
