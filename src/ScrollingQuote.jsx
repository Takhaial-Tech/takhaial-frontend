import { Fragment, useLayoutEffect, useRef, useState } from "react";
import "./scrolling-quote.css";

const QUOTE =
  "Start with one workflow. Connect the right tools. Give your team time to do the work that matters.";
const clamp = (value) => Math.max(0, Math.min(1, value));
const cubicOut = (value) => 1 - (1 - clamp(value)) ** 3;
const quarticOut = (value) => 1 - (1 - clamp(value)) ** 4;
const cubicInOut = (value) => {
  const p = clamp(value);
  return p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
};

// The source has a scroll-seeked opacity sequence and a separate, once-per-entry
// transform sequence. Keeping those clocks separate also preserves reverse scroll.
function wordOpacity(index, count, progress) {
  const brightStart = 0.02 * Math.floor(0.66 * count) + 0.0875;
  const duration = brightStart + (count - 1) * 0.09 + 0.45;
  const time = clamp(progress * 1.4) * duration;
  const dimStart = index * 0.02;
  const lightStart = brightStart + index * 0.09;
  const dimOpacity = 0.42 * cubicOut((time - dimStart) / 0.35);
  if (time < lightStart) return dimOpacity;
  const startOpacity = 0.42 * cubicOut((lightStart - dimStart) / 0.35);
  return startOpacity + (1 - startOpacity) * cubicOut((time - lightStart) / 0.45);
}

export default function ScrollingQuote({ className = "" }) {
  const words = QUOTE.split(" ");
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const wrapperRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const measureRef = useRef(null);
  const wordRefs = useRef([]);
  const refreshRef = useRef(null);
  const [lines, setLines] = useState(() => [words.map((_, index) => index)]);

  // Split only at the browser's actual line boundaries. The hidden measurement
  // copy retains balanced wrapping during font loading and breakpoint changes.
  useLayoutEffect(() => {
    const container = textRef.current;
    let disposed = false;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (disposed || !measureRef.current) return;
      const next = [];
      let previousTop = -Infinity;
      Array.from(measureRef.current.children).forEach((element, index) => {
        const top = element.offsetTop;
        if (Math.abs(top - previousTop) > 1) next.push([]);
        next[next.length - 1].push(index);
        previousTop = top;
      });
      if (next.length) {
        setLines((current) =>
          JSON.stringify(current) === JSON.stringify(next) ? current : next,
        );
      }
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    document.fonts?.ready.then(schedule);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const wrapper = wrapperRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let enteredAt = null;
    let videoVisible = false;

    const syncVideo = () => {
      if (disposed) return;
      video.controls = reduced.matches;
      if (videoVisible && !document.hidden && !reduced.matches) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const update = (now) => {
      frame = 0;
      if (disposed) return;
      const viewportHeight = window.innerHeight;
      const top = root.getBoundingClientRect().top;
      const pinTop = desktop.matches ? viewportHeight * 0.2 : 0;
      const rawProgress = (pinTop - top) / (2 * viewportHeight);
      const progress = clamp(rawProgress);
      const reducedMotion = reduced.matches;
      const time = progress * 2.25;
      const leaving = cubicInOut((time - 1.5) / 0.75);
      const arrivalY = 25 * (1 - quarticOut(time / 0.75));
      const wrapperY = arrivalY - 20 * leaving;

      if (rawProgress >= 0 && enteredAt === null) enteredAt = now;
      // A normal sticky element would release too early: the original pin has
      // no spacing and continues beyond this 200dvh root. Translate the anchor
      // by the clamped scroll distance to retain that exact pin duration.
      pin.style.transform = reducedMotion
        ? "none"
        : `translate3d(0, ${progress * viewportHeight * 2}px, 0)`;
      wrapper.style.transform = reducedMotion
        ? "none"
        : `translate3d(0, ${wrapperY}%, 0) scale(${1 - 0.1 * leaving})`;
      wrapper.style.opacity = reducedMotion ? "1" : String(1 - leaving);
      wrapper.style.pointerEvents = leaving > 0.999 && !reducedMotion ? "none" : "auto";
      media.style.transform = reducedMotion || !desktop.matches
        ? "none"
        : `translate3d(0, ${67 * (1 - cubicInOut(progress))}%, 0)`;

      let transformsAnimating = false;
      wordRefs.current.forEach((word, index) => {
        if (!word) return;
        const elapsed = enteredAt === null ? 0 : (now - enteredAt) / 1000;
        const entry = reducedMotion ? 1 : cubicOut((elapsed - index * 0.02) / 0.35);
        word.style.opacity = reducedMotion ? "1" : String(wordOpacity(index, words.length, progress));
        word.style.transform = `translate3d(${50 * (1 - entry)}px, 0, 0) scale(${1 + 0.75 * (1 - entry)})`;
        if (enteredAt !== null && entry < 1) transformsAnimating = true;
      });
      root.dataset.quoteProgress = progress.toFixed(4);
      root.dataset.quoteState = reducedMotion ? "reduced" : rawProgress < 0 ? "before" : rawProgress > 1 ? "after" : "pinned";
      if (transformsAnimating && !reducedMotion) schedule();
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(update);
    };
    const breakpointChanged = () => {
      enteredAt = null;
      schedule();
    };
    const preferenceChanged = () => {
      schedule();
      syncVideo();
    };
    const loaded = () => {
      root.dataset.quoteVideo = "ready";
      syncVideo();
    };
    const failed = () => { root.dataset.quoteVideo = "error"; };
    const observer = new IntersectionObserver(([entry]) => {
      videoVisible = entry.isIntersecting;
      syncVideo();
    });
    observer.observe(video);
    video.defaultMuted = true;
    video.muted = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", syncVideo);
    document.addEventListener("pointerdown", syncVideo, { passive: true });
    video.addEventListener("canplay", loaded);
    video.addEventListener("error", failed);
    desktop.addEventListener("change", breakpointChanged);
    reduced.addEventListener("change", preferenceChanged);
    refreshRef.current = schedule;
    update(performance.now());
    return () => {
      disposed = true;
      refreshRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      video.pause();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      document.removeEventListener("visibilitychange", syncVideo);
      document.removeEventListener("pointerdown", syncVideo);
      video.removeEventListener("canplay", loaded);
      video.removeEventListener("error", failed);
      desktop.removeEventListener("change", breakpointChanged);
      reduced.removeEventListener("change", preferenceChanged);
    };
  }, []);

  useLayoutEffect(() => { refreshRef.current?.(); }, [lines]);

  return (
    <div
      ref={rootRef}
      className={`scrolling-quote ${className}`.trim()}
      data-theme="dark"
      data-quote-state="before"
    >
      <section ref={pinRef} className="scrolling-quote__pin" aria-label="A practical start to automation">
        <div ref={wrapperRef} className="scrolling-quote__wrapper">
          <div className="scrolling-quote__stack">
            <div ref={mediaRef} className="scrolling-quote__media">
              <video
                ref={videoRef}
                src="/takhaial/media/oil-sector-ar.mp4"
                poster="/takhaial/media/oil-sector-ar.webp"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Takhaial industrial augmented reality project"
              />
            </div>
            <div className="scrolling-quote__panel">
              <div ref={textRef} className="scrolling-quote__text">
                <p className="scrolling-quote__accessible">{QUOTE}</p>
                <p ref={measureRef} className="scrolling-quote__measure" aria-hidden="true">
                  {words.map((word, index) => (
                    <Fragment key={index}><span>{word}</span>{index < words.length - 1 ? " " : null}</Fragment>
                  ))}
                </p>
                <p className="scrolling-quote__rendered" aria-hidden="true">
                  {lines.map((line) => (
                    <span className="scrolling-quote__line" key={line[0]}>
                      {line.map((index, inLine) => (
                        <Fragment key={index}>
                          <span className="scrolling-quote__word" ref={(element) => { wordRefs.current[index] = element; }}>{words[index]}</span>
                          {inLine < line.length - 1 ? " " : null}
                        </Fragment>
                      ))}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
