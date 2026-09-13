import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const viewport of [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "mobile", width: 375, height: 812 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  await page.goto("https://scale.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(3_000);

  const media = await page.evaluate(() => ({
    canvases: [...document.querySelectorAll("canvas")].map((canvas) => {
      const rect = canvas.getBoundingClientRect();
      return {
        width: canvas.width,
        height: canvas.height,
        className:
          typeof canvas.className === "string" ? canvas.className : "",
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    }),
    backgrounds: [...document.querySelectorAll("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          className:
            typeof element.className === "string" ? element.className : "",
          backgroundImage: style.backgroundImage,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y + scrollY),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        };
      })
      .filter(
        (element) =>
          element.rect.y < innerHeight * 1.2 &&
          element.rect.width > innerWidth * 0.5 &&
          element.rect.height > 200 &&
          element.backgroundImage !== "none",
      ),
    videos: [...document.querySelectorAll("video")].map((video) => {
      const rect = video.getBoundingClientRect();
      return {
        currentSrc: video.currentSrc,
        src: video.src,
        poster: video.poster,
        autoplay: video.autoplay,
        muted: video.muted,
        loop: video.loop,
        paused: video.paused,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y + scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    }),
    images: [...document.querySelectorAll("img")]
      .map((image) => {
        const rect = image.getBoundingClientRect();
        return {
          alt: image.alt,
          currentSrc: image.currentSrc,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y + scrollY),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        };
      })
      .filter(
        (image) =>
          image.rect.width >= 140 ||
          image.rect.height >= 140 ||
          image.rect.y < innerHeight * 1.3,
      ),
  }));

  console.log(JSON.stringify({ viewport, ...media }, null, 2));
  await context.close();
}

await browser.close();
