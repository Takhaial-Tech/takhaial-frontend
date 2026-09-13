import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const origin = "http://127.0.0.1:4173";
const evidence = path.resolve(".tasks/clone-scale.com");
const images = path.join(evidence, "screenshots");
await fs.mkdir(images, { recursive: true });
const report = { date: new Date().toISOString(), origin, viewports: [], errors: [], routes: [] };
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [[320,568],[375,812],[390,844],[768,1024],[1024,768],[1440,900],[1450,900],[1920,1080],[2560,1440],[3440,1440]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push({ width, message: error.message }));
    page.on("console", message => { if (message.type() === "error") report.errors.push({ width, message: message.text() }); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    const reject = page.getByRole("button", { name: "Reject Cookies", exact: true });
    if (await reject.count()) await reject.click();
    await page.waitForFunction(() => document.querySelector(".source-hero__video")?.readyState >= 3);
    await page.locator(".source-hero__video").evaluate(video => video.play());
    const before = await page.locator(".source-hero__video").evaluate(video => video.currentTime);
    await page.waitForTimeout(1200);
    const media = await page.locator(".source-hero__video").evaluate(video => ({ time: video.currentTime, width: video.videoWidth, height: video.videoHeight, paused: video.paused }));
    const phases = [];
    for (const [progress, expected] of [[.18,"reliability"],[.45,"applications"],[.72,"data"],[1,"exit"],[.95,"data"],[.5,"applications"],[.2,"reliability"]]) {
      const y = Math.round(progress * height * (width <= 768 ? 2.15 : 4.7));
      await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(1200);
      const state = await page.evaluate(() => {
        const canvas = document.querySelector("canvas");
        return { phase: document.querySelector(".source-hero").dataset.phase, renderer: canvas.dataset.renderer, objects: canvas.dataset.renderables,
          overflow: document.documentElement.scrollWidth > innerWidth, backing: [canvas.width,canvas.height], css: [canvas.clientWidth,canvas.clientHeight] };
      });
      phases.push({ progress, expected, ...state, passed: state.phase === expected && !state.overflow && state.renderer === "webgl" && state.objects === "15" });
      if ([.18,.45,.72].includes(progress) && [390,1920].includes(width)) {
        await page.screenshot({ path: path.join(images, `runtime-${width}-${expected}.png`) });
      }
    }
    const brokenImages = await page.locator("img").evaluateAll(imgs => imgs.filter(img => img.complete && !img.naturalWidth).map(img => img.src));
    report.viewports.push({ width, height, media, playbackAdvanced: media.time > before, phases, brokenImages });
    await context.close();
  }
  const metadata = JSON.parse(await fs.readFile(path.join(evidence, "core-page-metadata.json"), "utf8"));
  for (const item of metadata.pages) {
    const response = await fetch(origin + item.pathname);
    report.routes.push({ pathname: item.pathname, status: response.status });
  }
} finally { await browser.close(); }
report.passed = report.errors.length === 0 && report.viewports.every(view => view.playbackAdvanced && !view.brokenImages.length && view.phases.every(phase => phase.passed)) && report.routes.every(route => route.status === 200);
await fs.writeFile(path.join(evidence, "qa-runtime.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed, viewports: report.viewports.length, errors: report.errors, routes: report.routes.length }, null, 2));
if (!report.passed) process.exitCode = 1;
