import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const targetUrl = "https://scale.com/";
const projectRoot = process.cwd();
const evidenceRoot = path.join(projectRoot, ".tasks", "clone-scale.com");
const screenshotRoot = path.join(evidenceRoot, "screenshots");

const viewports = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "mobile-375", width: 375, height: 812 },
];

await fs.mkdir(screenshotRoot, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {
  capturedAt: new Date().toISOString(),
  targetUrl,
  viewports: [],
};

async function dismissCookieLayer(page) {
  const acceptButton = page
    .locator("#onetrust-accept-btn-handler")
    .or(page.getByRole("button", { name: /accept cookies/i }));
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.first().click({ force: true });
    await page.waitForTimeout(500);
    if (
      await page
        .locator("#onetrust-consent-sdk")
        .isVisible()
        .catch(() => false)
    ) {
      await page.evaluate(() => {
        document.querySelector("#onetrust-consent-sdk")?.remove();
      });
      return "accepted-and-removed-stale-overlay";
    }
    return "accepted";
  }

  const closeButton = page.locator(
    'button[aria-label*="close" i], button[title*="close" i]',
  );
  if (await closeButton.first().isVisible().catch(() => false)) {
    await closeButton.first().click();
    await page.waitForTimeout(500);
    return "closed";
  }

  await page.evaluate(() => {
    const consent = document.querySelector("#onetrust-consent-sdk");
    if (consent && getComputedStyle(consent).pointerEvents !== "none") {
      consent.remove();
    }
  });

  return "not-present";
}

async function warmScrollAnimations(page) {
  await page.evaluate(async () => {
    const distance = Math.max(280, Math.floor(window.innerHeight * 0.65));
    for (let y = 0; y < document.documentElement.scrollHeight; y += distance) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 110));
    }
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const styleRecord = (element) => {
      if (!element) return null;
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        className:
          typeof element.className === "string" ? element.className : "",
        color: style.color,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        padding: style.padding,
        margin: style.margin,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        transition: style.transition,
      };
    };

    const absolute = (href) => {
      try {
        return new URL(href, location.href).href;
      } catch {
        return null;
      }
    };

    const internalLinks = [
      ...new Set(
        [...document.querySelectorAll("a[href]")]
          .map((link) => absolute(link.getAttribute("href")))
          .filter(Boolean)
          .filter((href) => new URL(href).hostname === location.hostname),
      ),
    ];

    const externalLinks = [
      ...new Set(
        [...document.querySelectorAll("a[href]")]
          .map((link) => absolute(link.getAttribute("href")))
          .filter(Boolean)
          .filter((href) => new URL(href).hostname !== location.hostname),
      ),
    ];

    const assets = [
      ...new Set(
        [...document.querySelectorAll("img, video, source")]
          .flatMap((element) => [
            element.currentSrc,
            element.src,
            element.getAttribute("poster"),
          ])
          .filter(Boolean)
          .map(absolute)
          .filter(Boolean),
      ),
    ];

    const buttons = [...document.querySelectorAll("button")].map((button) => ({
      text: button.textContent?.trim().replace(/\s+/g, " ").slice(0, 140) || "",
      ariaLabel: button.getAttribute("aria-label"),
      title: button.getAttribute("title"),
      className:
        typeof button.className === "string" ? button.className : "",
      visible: Boolean(
        button.offsetWidth ||
          button.offsetHeight ||
          button.getClientRects().length,
      ),
    }));

    const sections = [
      ...document.querySelectorAll("main section, main > div, footer"),
    ]
      .filter((element) => element.getBoundingClientRect().height > 80)
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          index,
          tag: element.tagName.toLowerCase(),
          className:
            typeof element.className === "string" ? element.className : "",
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
          backgroundColor: style.backgroundColor,
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 180),
        };
      });

    const animations = document
      .getAnimations({ subtree: true })
      .slice(0, 250)
      .map((animation) => {
        const target = animation.effect?.target;
        const timing = animation.effect?.getTiming?.() || {};
        return {
          target: target
            ? `${target.tagName?.toLowerCase() || ""}.${
                typeof target.className === "string"
                  ? target.className.split(/\s+/).slice(0, 3).join(".")
                  : ""
              }`
            : "",
          playState: animation.playState,
          currentTime: animation.currentTime,
          duration: timing.duration,
          delay: timing.delay,
          easing: timing.easing,
          iterations: timing.iterations,
        };
      });

    const fontFamilies = [
      ...new Set(
        [...document.querySelectorAll("body *")]
          .slice(0, 3000)
          .map((element) => getComputedStyle(element).fontFamily),
      ),
    ];

    return {
      title: document.title,
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
      internalLinks,
      externalLinks,
      assets,
      buttons,
      sections,
      animations,
      fontFamilies,
      styles: {
        body: styleRecord(document.body),
        header: styleRecord(document.querySelector("header")),
        navigation: styleRecord(document.querySelector("nav")),
        headline: styleRecord(document.querySelector("h1")),
        primaryButton: styleRecord(
          document.querySelector("header a[href*='contact'], header button"),
        ),
      },
    };
  });
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: "light",
    locale: "en-US",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  const response = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(3_000);

  const cookieAction = await dismissCookieLayer(page);
  await warmScrollAnimations(page);

  await page.screenshot({
    path: path.join(screenshotRoot, `original-${viewport.name}-top.png`),
  });
  await page.screenshot({
    path: path.join(screenshotRoot, `original-${viewport.name}-full.png`),
    fullPage: true,
  });

  const inspection = await inspectPage(page);
  let navigationState = "not-captured";

  if (viewport.width >= 900) {
    const products = page.getByText("Products", { exact: true }).first();
    if (await products.isVisible().catch(() => false)) {
      const hovered = await products
        .hover({ timeout: 5_000 })
        .then(() => true)
        .catch(() => false);
      if (hovered) {
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(
            screenshotRoot,
            `original-${viewport.name}-products-hover.png`,
          ),
        });
        navigationState = "products-hover";
      } else {
        navigationState = "products-hover-blocked";
      }
    }
  } else {
    const menuCandidates = page.locator(
      'header button, nav button, button[aria-label*="menu" i]',
    );
    const count = await menuCandidates.count();
    for (let index = count - 1; index >= 0; index -= 1) {
      const candidate = menuCandidates.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click().catch(() => {});
        await page.waitForTimeout(500);
        navigationState = `clicked-candidate-${index}`;
        break;
      }
    }
    await page.screenshot({
      path: path.join(
        screenshotRoot,
        `original-${viewport.name}-menu-state.png`,
      ),
    });
  }

  report.viewports.push({
    ...viewport,
    status: response?.status() ?? null,
    finalUrl: page.url(),
    cookieAction,
    navigationState,
    consoleErrors,
    pageErrors,
    ...inspection,
  });

  await context.close();
}

await browser.close();
await fs.writeFile(
  path.join(evidenceRoot, "live-inspection.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      capturedAt: report.capturedAt,
      viewports: report.viewports.map((viewport) => ({
        name: viewport.name,
        status: viewport.status,
        size: `${viewport.width}x${viewport.height}`,
        height: viewport.documentHeight,
        links: viewport.internalLinks.length,
        assets: viewport.assets.length,
        consoleErrors: viewport.consoleErrors.length,
        pageErrors: viewport.pageErrors.length,
        navigationState: viewport.navigationState,
      })),
    },
    null,
    2,
  ),
);
