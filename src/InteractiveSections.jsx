import { useEffect, useMemo, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./interactive-sections.css";

const APPLICATIONS = [
  ["Research", "/images/application-research.png", "/labs", "#a8927c"],
  ["Life Science", "/images/application-medicine.png", "/physical-ai", "#a8927c"],
  ["Medicine", "/images/application-decisions.png", "/enterprise/healthcare", "#193a29", "right"],
  ["Energy", "/images/application-energy.jpg", "/enterprise", "#a8927c"],
  ["Infrastructure", "/images/application-impact.jpg", "/enterprise", "#193a29", "right"],
  ["Sovereignty", "/images/application-sovereignty.jpg", "/global-public-sector", "#193a29", "right"],
  ["Robotics", "/images/application-robotics.jpg", "/physical-ai", "#79648c"],
  ["Defense", "/images/application-capabilities.jpg", "/public-sector", "#a8927c"],
  ["Operations", "/images/application-supply-chains.jpg", "/public-sector-data-engine", "#79648c"],
  ["Healthcare", "/images/application-consequences.jpg", "/enterprise/healthcare", "#a8927c"],
  ["Autonomy", "/images/application-driving.png", "/automotive", "#a8927c"],
  ["Logistics", "/images/application-logistics.jpg", "/public-sector", "#193a29", "right"],
];

const CUSTOMERS = [
  ["CDAO", "Turning raw, classified data into actionable intelligence.", "/images/customer-cdao.png"],
  ["Meta", "Partnering to accelerate Meta's LLM and Generative AI.", "/images/customer-meta.png"],
  ["Mayo Clinic", "Reducing physician cognitive load by turning complex patient records into clinical intelligence.", "/images/customer-mayo.png"],
  ["Time", "Powering an interactive AI experience that brings a century of journalism to life.", "/images/customer-time.png", "/customers/time"],
  ["Howard Hughes", "Accelerating real estate development revenue and operations.", "/images/customer-howard-hughes.png"],
  ["Physical Intelligence", "Fuelling the next generation of robotic foundation models with real-world training data.", "/icons/customer-physical-intelligence.svg"],
  ["Universal Robots", "Enabling scalable, real-world Physical AI for industrial robotics.", "/images/customer-universal-robots.png"],
  ["Center for AI Safety", "Benchmarking the frontier of AI capability with expert-level evaluations.", "/images/customer-center-ai-safety.png"],
  ["British Petroleum", "Accelerating enterprise AI adoption across global energy operations.", "/images/customer-bp.png"],
  ["Cengage", "Enabling smarter, more personalized learning experiences for students and educators at scale.", "/images/customer-cengage.png"],
  ["Shore Capital", "Building agentic AI that drives EBITDA gains across PE portfolio companies.", "/images/customer-shore-capital.png"],
];

// Geometry and timings were measured from the site's public Applications module.
const DESKTOP_ORBIT = "M438.952 40.8213C578.331 0.420355 712.457 -8.66301 816.626 9.29004C920.833 27.2496 994.888 72.2245 1014.46 139.774C1034.04 207.324 995.505 284.934 917.051 355.841C838.624 426.722 720.427 490.778 581.048 531.179C441.669 571.58 307.543 580.663 203.374 562.71C99.1674 544.75 25.1119 499.775 5.53711 432.226C-14.0376 364.676 24.4945 287.066 102.949 216.159C181.376 145.278 299.573 81.2224 438.952 40.8213Z";
const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const wrap = (value) => ((value % 1) + 1) % 1;
const expoOut = (value) => (value === 1 ? 1 : 1 - 2 ** (-10 * value));

function PlainLink({ children, ...props }) {
  return <a {...props}>{children}</a>;
}

function Arrow({ left = false }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" style={left ? { transform: "rotate(180deg)" } : undefined}>
      <path d="m7.4 5.6 4.4 4.4-4.4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The children slot keeps the rail inside the source's pinned Applications group. */
export function RealWorldStage({ SmartLink = PlainLink, orbitImages, children }) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const screenRef = useRef(null);
  const orbitRef = useRef(null);
  const desktopPathRef = useRef(null);
  const mobilePathRef = useRef(null);
  const itemRefs = useRef([]);
  const labelRefs = useRef([]);
  const labelViewportRef = useRef(null);
  const copyRef = useRef(null);
  const interactionRef = useRef({ highlight: () => {}, hover: () => {}, tap: () => {} });
  const [label, setLabel] = useState(APPLICATIONS[0][0]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const screen = screenRef.current;
    const orbit = orbitRef.current;
    const labelViewport = labelViewportRef.current;
    if (!root || !pin || !screen || !orbit || !labelViewport) return undefined;

    let frame = 0;
    let previousTime = performance.now();
    let orbitTime = 0;
    let orbitRunning = false;
    let hadEntered = false;
    let hovered = false;
    let slowdownStart = 0;
    let desktopPath = true;
    let mobile = false;
    let reduced = false;
    let mobileTouched = false;
    let copyVisible = false;
    let lastAutoLabel = performance.now();
    let activeLabel = 0;
    let labelAnimation = null;
    let measuredWidth = 0;
    let measuredHeight = 0;
    let pathLength = 1;
    let activePath = desktopPathRef.current;
    let rootTop = 0;
    let pinHeight = 0;
    let viewportHeight = window.innerHeight;
    let rootWidth = root.clientWidth;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function highlight(index, instant = false) {
      const selected = labelRefs.current[index];
      if (!selected || (index === activeLabel && !instant)) return;
      const previousIndex = activeLabel;
      const previousWidth = labelViewport.getBoundingClientRect().width;
      activeLabel = index;
      setLabel(APPLICATIONS[index][0]);
      root.dataset.activeApplication = APPLICATIONS[index][0];
      labelRefs.current.forEach((node, nodeIndex) => {
        if (nodeIndex !== index && nodeIndex !== previousIndex) node.style.transform = "translate(-10%, 100%)";
      });
      if (instant || reduced) {
        labelAnimation = null;
        labelRefs.current.forEach((node, nodeIndex) => {
          node.style.transform = nodeIndex === index ? "translate(0%, 0%)" : "translate(-10%, 100%)";
        });
        labelViewport.style.width = `${selected.offsetWidth}px`;
        return;
      }
      labelAnimation = { index, previousIndex, started: performance.now(), previousWidth, width: selected.offsetWidth };
    }

    function measure() {
      mobile = window.innerWidth <= 769;
      desktopPath = window.innerWidth >= 1024;
      reduced = motionQuery.matches;
      viewportHeight = window.innerHeight;
      rootWidth = root.clientWidth;
      rootTop = root.getBoundingClientRect().top + window.scrollY;
      pinHeight = pin.offsetHeight;
      measuredWidth = orbit.clientWidth;
      measuredHeight = orbit.clientHeight;
      activePath = desktopPath ? desktopPathRef.current : mobilePathRef.current;
      const landscape = window.innerHeight <= 600 && window.innerWidth > window.innerHeight && window.innerWidth < 1024;
      const centerY = landscape ? 240 : 286;
      const radiusY = landscape ? 180 : 268;
      const angle = (5 * Math.PI) / 180;
      const x = 710 * Math.cos(angle);
      const y = 710 * Math.sin(angle);
      mobilePathRef.current.setAttribute("d", `M ${510 + x} ${centerY + y} A 710 ${radiusY} 5 1 1 ${510 - x} ${centerY - y} A 710 ${radiusY} 5 1 1 ${510 + x} ${centerY + y}`);
      pathLength = activePath.getTotalLength();
      if (mobile) hovered = false;
      highlight(activeLabel, true);
      updateScroll();
    }

    function updateScroll() {
      // Upstream pinned sections may reflow after their media/fonts initialize.
      rootTop = root.getBoundingClientRect().top + window.scrollY;
      const top = rootTop - window.scrollY;
      const pinStart = pinHeight - viewportHeight * (mobile ? 0.5 : 1);
      const distance = clamp(window.scrollY - rootTop - pinStart, 0, viewportHeight * 1.5);
      const visualTop = top + (reduced ? 0 : distance);
      orbitRunning = visualTop < viewportHeight && visualTop + pinHeight > 0;
      if (orbitRunning && !hadEntered) {
        hadEntered = true;
        if (!mobile) highlight(0, true);
      } else if (!orbitRunning) {
        hadEntered = false;
        mobileTouched = false;
      }
      const entrance = clamp((1 - top / viewportHeight - 0.5) / 0.4);
      const minimumScale = 1 - (window.innerWidth < 768 ? 24 : 48) / Math.max(1, rootWidth);
      root.style.setProperty("--applications-scale", `${minimumScale + (1 - minimumScale) * entrance}`);
      root.style.setProperty("--applications-radius", `${16 * (1 - entrance)}px`);
      const progress = distance / Math.max(1, viewportHeight * 1.5);
      root.style.setProperty("--applications-pin-y", reduced ? "0px" : `${distance}px`);
      root.style.setProperty("--applications-rail-y", reduced ? "0px" : `${-0.2 * viewportHeight * (1 - (1 - clamp(progress * 3)) ** 2)}px`);
      root.style.setProperty("--applications-shade", reduced ? "0" : `${0.35 * (1 - (1 - clamp((progress - 1 / 3) * 1.5)) ** 2)}`);
      root.dataset.pinProgress = progress.toFixed(4);
      const copyRect = copyRef.current.getBoundingClientRect();
      const visibleHeight = Math.min(copyRect.bottom, viewportHeight) - Math.max(copyRect.top, 0);
      const newlyVisible = visibleHeight >= copyRect.height * 0.25;
      if (newlyVisible && !copyVisible) lastAutoLabel = performance.now();
      if (!newlyVisible) mobileTouched = false;
      copyVisible = newlyVisible;
    }

    interactionRef.current = {
      highlight: (index) => highlight(index),
      hover: (index, isHovered) => {
        if (mobile) return;
        hovered = isHovered;
        root.dataset.orbitPaused = String(isHovered);
        if (isHovered) {
          slowdownStart = performance.now();
          highlight(index);
        }
      },
      tap: (index, event) => {
        if (!mobile) return;
        event.preventDefault();
        mobileTouched = true;
        highlight(index);
      },
    };

    function render(time) {
      const delta = Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      if (orbitRunning && !reduced && !document.hidden) {
        const speed = hovered ? (1 - clamp((time - slowdownStart) / 1000)) ** 3 : 1;
        orbitTime = wrap(orbitTime + (delta * speed) / 28);
      }
      if (orbitRunning || time < 1000) {
        itemRefs.current.forEach((node, index) => {
          if (!node) return;
          const progress = wrap(index / APPLICATIONS.length + 0.25 + orbitTime);
          const point = activePath.getPointAtLength(progress * pathLength);
          const sine = Math.sin(wrap(progress + (desktopPath ? 0.75 : 0.25)) * Math.PI);
          const scale = desktopPath ? 0.35 * (1 + sine) ** 2 : (0.74 + 0.26 * sine) * (1.06 + 0.94 * sine) * 0.7;
          node.style.transform = `translate3d(${point.x * measuredWidth / 1020 - 50}px, ${point.y * measuredHeight / 572 - 50}px, 0) scale(${scale})`;
        });
      }
      if (labelAnimation) {
        const progress = clamp((time - labelAnimation.started) / 500);
        const eased = expoOut(progress);
        const incoming = labelRefs.current[labelAnimation.index];
        const outgoing = labelRefs.current[labelAnimation.previousIndex];
        incoming.style.transform = `translate(${-10 * (1 - eased)}%, ${100 * (1 - eased)}%)`;
        if (outgoing !== incoming) {
          const exitX = APPLICATIONS[labelAnimation.previousIndex][4] === "left" ? -10 : 10;
          outgoing.style.transform = `translate(${exitX * eased}%, ${-102 * eased}%)`;
        }
        labelViewport.style.width = `${labelAnimation.previousWidth + (labelAnimation.width - labelAnimation.previousWidth) * eased}px`;
        if (progress === 1) labelAnimation = null;
      }
      if (mobile && copyVisible && !mobileTouched && !reduced && time - lastAutoLabel >= 3000) {
        lastAutoLabel = time;
        highlight((activeLabel + 1) % APPLICATIONS.length);
      }
      frame = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    resizeObserver.observe(orbit);
    resizeObserver.observe(pin);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    motionQuery.addEventListener("change", measure);
    measure();
    document.fonts.ready.then(() => { if (root.isConnected) measure(); });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", measure);
      motionQuery.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={rootRef} className="applications-experience" data-active-application="Research" data-orbit-paused="false">
      <div className="applications-experience__backdrop" aria-hidden="true" />
      <div ref={pinRef} className="applications-experience__pin">
        <section ref={screenRef} className="real-world-stage" aria-label="Artificial Intelligence. Real-world applications.">
          <div ref={copyRef} className="real-world-stage__copy">
            <div className="real-world-stage__title">
              <h2>Artificial Intelligence</h2>
              <div className="real-world-stage__dynamic-row" aria-label={`Real ${label}`}>
                <span aria-hidden="true">Real</span>
                <div ref={labelViewportRef} className="real-world-stage__label-window" aria-hidden="true">
                  {APPLICATIONS.map(([title, , , color], index) => (
                    <span key={title} ref={(node) => { labelRefs.current[index] = node; }} className="real-world-stage__label" style={{ color }}>
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <SmartLink href="/demo" className="real-world-stage__cta"><span>Get Started</span></SmartLink>
          </div>
          <div ref={orbitRef} className="real-world-stage__orbit">
            <svg viewBox="0 0 1020 572" preserveAspectRatio="none" aria-hidden="true">
              <path ref={desktopPathRef} d={DESKTOP_ORBIT} fill="none" />
              <path ref={mobilePathRef} d="M1220 286A710 268 5 1 1-200 286A710 268 5 1 11220 286" fill="none" />
            </svg>
            {APPLICATIONS.map(([title, image, href], index) => (
              <div key={title} ref={(node) => { itemRefs.current[index] = node; }} className="real-world-stage__item">
                <div className="real-world-stage__item-hover" onMouseEnter={() => interactionRef.current.hover(index, true)} onMouseLeave={() => interactionRef.current.hover(index, false)}>
                  <SmartLink href={href} aria-label={title} className="real-world-stage__image-link" onClick={(event) => interactionRef.current.tap(index, event)} onFocus={() => interactionRef.current.hover(index, true)} onBlur={() => interactionRef.current.hover(index, false)}>
                    <img src={orbitImages?.[index] || image} alt="" loading="lazy" draggable="false" />
                  </SmartLink>
                </div>
              </div>
            ))}
          </div>
        </section>
        {children ? <div className="applications-experience__rail">{children}</div> : null}
        <div className="applications-experience__shade" aria-hidden="true" />
      </div>
    </div>
  );
}

export function CustomerRail({ SmartLink = PlainLink, customerCards, customerLogos }) {
  const sectionRef = useRef(null);
  const visibleRef = useRef(false);
  const movedRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const sourceCards = useMemo(() => customerCards ? customerCards.map(([brand, quote]) => [brand, quote, customerLogos?.[brand], brand === "Time" ? "/customers/time" : undefined]) : CUSTOMERS, [customerCards, customerLogos]);
  const cards = useMemo(() => Array.from({ length: Math.max(4, Math.ceil(16 / sourceCards.length)) * sourceCards.length }, (_, index) => sourceCards[index % sourceCards.length]), [sourceCards]);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: { perView: "auto", spacing: 8, origin: "center" },
    dragStarted(instance) { movedRef.current = true; instance.container.style.cursor = "grabbing"; },
    dragEnded(instance) { instance.container.style.cursor = "grab"; window.setTimeout(() => { movedRef.current = false; }, 0); },
    slideChanged(instance) { if (sectionRef.current) sectionRef.current.dataset.activeSlide = String(instance.track.details.rel % sourceCards.length); },
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) setEntered(true);
    });
    observer.observe(section);
    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => slider.current?.update());
    });
    if (slider.current?.container) resizeObserver.observe(slider.current.container);
    const onKey = (event) => {
      if (!visibleRef.current || event.defaultPrevented || event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); slider.current?.prev(); }
      if (event.key === "ArrowRight") { event.preventDefault(); slider.current?.next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("keydown", onKey);
    };
  }, [slider]);

  if (!sourceCards.length) return null;
  return (
    <section ref={sectionRef} className={`customer-carousel${entered ? " customer-carousel--entered" : ""}`} data-active-slide="0" aria-label="Card carousel" aria-roledescription="carousel">
      <div className="customer-carousel__viewport">
        <div ref={sliderRef} className="keen-slider customer-carousel__slider">
          {cards.map(([brand, quote, logo, href], index) => {
            const animateOrder = index < 5 ? index + 5 : index >= cards.length - 5 ? index - (cards.length - 5) : 0;
            const card = (
              <article className="customer-carousel__card" style={{ "--card-delay": `${animateOrder * 0.09}s` }}>
                <div className="customer-carousel__logo"><img src={logo} alt="" loading="lazy" draggable="false" /></div>
                <div className="customer-carousel__quote"><h3>{quote}</h3></div>
                <div className="customer-carousel__caption"><p>{brand}</p>{href ? <span className="customer-carousel__card-arrow" aria-hidden="true"><span>→</span><span>→</span></span> : null}</div>
              </article>
            );
            return (
              <div key={`${brand}-${index}`} className="keen-slider__slide customer-carousel__slide" aria-label={`${index % sourceCards.length + 1} of ${sourceCards.length}: ${brand}`}>
                {href ? <SmartLink href={href} className="customer-carousel__link" onClick={(event) => { if (movedRef.current) event.preventDefault(); }}>{card}</SmartLink> : card}
              </div>
            );
          })}
        </div>
      </div>
      <div className="customer-carousel__footer">
        <h2>Proven across every industry.</h2>
        <div className="customer-carousel__controls">
          <button type="button" aria-label="Previous slide" onClick={() => slider.current?.prev()}><Arrow left /></button>
          <button type="button" aria-label="Next slide" onClick={() => slider.current?.next()}><Arrow /></button>
        </div>
      </div>
    </section>
  );
}
