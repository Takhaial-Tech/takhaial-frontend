import { useEffect, useRef, useState } from "react";
import "./content-sections.css";

const clamp = (value) => Math.min(1, Math.max(0, value));
const BENCHMARK_CARDS = [
  { title: "10 years powering the world's biggest AI breakthroughs.", body: "Since 2016, we've been at the forefront; from autonomous vehicles to frontier models solving the world's hardest problems.", href: "/about", color: "#79648c", icon: "growth" },
  { title: "The standard every frontier model is measured against.", body: "Our leaderboards run private benchmarks for the most ambitious AI companies to improve model capabilities.", href: "/labs/leaderboard", color: "#a8927c", icon: "chart" },
  { title: "Behind the model. Behind the mission. Behind it all.", body: "Only Scale has the frontier research, world’s best data, and deployment experience to build AI that works in the real world.", href: "/generative-ai-data-engine", color: "#839cb2", icon: "layers" },
];

const LATEST_CARDS = [
  { title: "Introducing Scale Labs", href: "/blog/scale-labs", variant: "title", area: "1 / 1 / 5 / 3" },
  { title: "Mayo Clinic + Scale: Reliable AI for Better Healthcare", href: "/blog/mayo-clinic-scale", image: "/images/blog-mayo-clinic-scale.png", variant: "overlay", area: "1 / 3 / 6 / 5" },
  { title: "How Morgan Stanley deploys AI that actually works (hint: it's evals) | Human in the Loop: Episode 13", href: "/blog/hitl-ep13-ai-evals-in-practice", image: "/images/blog-morgan-stanley.png", variant: "caption", area: "5 / 1 / 7 / 3", category: "Company", swatch: "#a8927c", darkCategory: true },
  { title: "The Next Phase of U.S. AI Policy: Governance, Implementation, and Global Leadership", href: "/blog/next-phase-us-ai-policy", image: "/images/blog-us-ai-policy.jpg", variant: "caption", area: "6 / 3 / 7 / 4", category: "Public Sector", swatch: "#a07862" },
  { title: "Scale AI and BAE Systems Combine Forces to Modernize the Tactical Edge", href: "/blog/scale-bae-modernize-tactical-edge", image: "/images/blog-bae-tactical-edge.jpg", variant: "caption", area: "6 / 4 / 7 / 5", category: "Public Sector", swatch: "#a3bed8" },
  { title: "SWE-Bench Pro: Raising the Bar for Agentic Coding", href: "/blog/swe-bench-pro", image: "/images/blog-swe-bench-pro.png", variant: "caption", area: "7 / 1 / 9 / 2", category: "Research", swatch: "#273252", gradient: true },
  { title: "MCIT & Scale AI: Paving the Way for Qatar’s Digital Future", href: "/blog/mcit-scale", image: "/images/blog-mcit-qatar.jpg", variant: "overlay", area: "7 / 2 / 9 / 4", category: "Company", swatch: "#a8927c", gradient: true },
  { title: "Expanding Our Data Engine for Physical AI", href: "/blog/physical-ai", image: "/images/blog-physical-ai.png", variant: "caption", area: "7 / 4 / 9 / 5", category: "Product", swatch: "#575757", gradient: true },
];

function PlainLink({ children, ...props }) { return <a {...props}>{children}</a>; }

function Words({ children }) {
  return children.split(" ").map((word, index) => (
    <span className="content-word-mask" key={`${word}-${index}`}><span className="content-word" style={{ "--word-index": index }}>{word}</span>{" "}</span>
  ));
}

function BenchmarkIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {type === "growth" ? <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /> : null}
      {type === "chart" ? <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z" /> : null}
      {type === "layers" ? <><ellipse cx="12" cy="12" rx="3" ry="5.74" /><path d="M7.5 12c0-.97.23-4.16 3.03-6.5C9.75 5.19 8.9 5 8 5c-3.86 0-7 3.14-7 7s3.14 7 7 7c.9 0 1.75-.19 2.53-.5-2.8-2.34-3.03-5.53-3.03-6.5zM16 5c-.9 0-1.75.19-2.53.5.61.51 1.1 1.07 1.49 1.63.33-.08.68-.13 1.04-.13 2.76 0 5 2.24 5 5s-2.24 5-5 5c-.36 0-.71-.05-1.04-.13-.39.56-.88 1.12-1.49 1.63.78.31 1.63.5 2.53.5 3.86 0 7-3.14 7-7s-3.14-7-7-7z" /></> : null}
    </svg>
  );
}

export function BenchmarkSection({ SmartLink = PlainLink }) {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    let frame = 0;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const entrance = clamp((1 - rect.top / vh - 0.5) / 0.4);
      const minimumScale = Math.max(0.01, 1 - 2 * (window.innerWidth < 768 ? 12 : 24) / rect.width);
      root.style.setProperty("--benchmark-panel-scale", `${minimumScale + (1 - minimumScale) * entrance}`);
      root.style.setProperty("--benchmark-panel-radius", `${16 * (1 - entrance)}px`);
      cardsRef.current.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const progress = clamp((1 - cardRect.top / vh) * 2);
        const staggered = clamp((progress - index * 0.1) / 0.8);
        const eased = 1 - (1 - staggered) ** 3;
        card.style.setProperty("--benchmark-card-scale", reducedQuery.matches ? "1" : `${0.96 + 0.04 * eased}`);
        card.style.setProperty("--benchmark-card-opacity", reducedQuery.matches ? "1" : `${eased}`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("content-is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    observer.observe(headingRef.current);
    cardsRef.current.forEach((card) => observer.observe(card));
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reducedQuery.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedQuery.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={rootRef} className="benchmark-section" aria-labelledby="benchmark-title">
      <div className="benchmark-section__panel" aria-hidden="true" />
      <div className="content-page-grid">
        <div className="content-page-grid__inner benchmark-section__inner">
          <h2 ref={headingRef} id="benchmark-title" className="benchmark-section__heading"><Words>We set the benchmark for what’s possible with AI</Words></h2>
          <div className="benchmark-section__cards">
            {BENCHMARK_CARDS.map((card, index) => (
              <div ref={(node) => { cardsRef.current[index] = node; }} key={card.href} className="benchmark-section__card-motion" style={{ "--card-index": index }}>
                <SmartLink href={card.href} className="benchmark-section__card" style={{ "--benchmark-hover": card.color }}>
                  <span className="benchmark-section__card-fill" aria-hidden="true" />
                  <div className="benchmark-section__card-content">
                    <span className="benchmark-section__icon" style={{ color: card.color }}><BenchmarkIcon type={card.icon} /></span>
                    <h3><Words>{card.title}</Words></h3>
                    <div className="benchmark-section__card-bottom">
                      <p><Words>{card.body}</Words></p>
                      <div className="benchmark-section__cta-row"><span className="benchmark-section__cta"><span>Learn More</span></span></div>
                    </div>
                  </div>
                </SmartLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryBadge({ card }) {
  if (!card.category) return null;
  return (
    <span className={`latest-section__category${card.darkCategory ? " latest-section__category--dark" : ""}`}>
      <span className="latest-section__category-mark" style={{ background: card.swatch }} aria-hidden="true"><svg viewBox="0 0 8 8" fill="none"><path d="M6.79229 0H0.500785C0.0554314 0-.167603.538452.14731.853365L6.43881 7.14487C6.75373 7.45978 7.29218 7.23675 7.29218 6.79139V.499889C7.29218.223808 7.06837 0 6.79229 0Z" fill="white" /></svg></span>
      <span>{card.category}</span>
    </span>
  );
}

export function LatestSection({ SmartLink = PlainLink }) {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches);
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const tilesRef = useRef([]);
  const visibleCards = mobile ? LATEST_CARDS.slice(0, 4) : LATEST_CARDS;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const change = () => setMobile(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    let frame = 0;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("content-is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    observer.observe(headingRef.current);
    tilesRef.current.filter(Boolean).forEach((tile) => observer.observe(tile));
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      tilesRef.current.filter(Boolean).forEach((tile) => {
        const rect = tile.getBoundingClientRect();
        const progress = clamp((vh - rect.top) / (0.5 * (vh + rect.height)));
        tile.style.setProperty("--tile-scroll-zoom", reducedQuery.matches ? "1" : `${1.08 - 0.08 * progress}`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reducedQuery.addEventListener("change", schedule);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedQuery.removeEventListener("change", schedule);
    };
  }, [mobile]);

  return (
    <section ref={rootRef} className="latest-section" aria-labelledby="latest-section-title">
      <div className="content-page-grid">
        <div className="content-page-grid__inner">
          <h2 ref={headingRef} id="latest-section-title" className="latest-section__heading"><span><Words>From the Lab to the real world.</Words></span><span><Words>The latest from Scale.</Words></span></h2>
          <div className="latest-section__grid">
            {visibleCards.map((card, index) => {
              const variant = mobile && card.variant === "overlay" ? "caption" : card.variant;
              return (
                <div ref={(node) => { tilesRef.current[index] = node; }} key={card.href} className="latest-section__slot" style={{ gridArea: mobile ? undefined : card.area, "--tile-delay": `${Math.min(index, 3) * 0.05}s` }}>
                  <SmartLink href={card.href} className={`latest-section__tile latest-section__tile--${variant}${card.gradient ? " latest-section__tile--gradient" : ""}`}>
                    {card.variant === "title" ? <div className="latest-section__title-only"><h3><Words>{card.title}</Words></h3></div> : <>
                      <div className="latest-section__media">
                        <div className="latest-section__image-scroll"><img src={card.image} alt="" loading="lazy" /></div>
                        {card.gradient ? <span className="latest-section__image-shade" aria-hidden="true" /> : null}
                        <CategoryBadge card={card} />
                      </div>
                      <div className="latest-section__caption"><h3><Words>{card.title}</Words></h3></div>
                    </>}
                  </SmartLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
