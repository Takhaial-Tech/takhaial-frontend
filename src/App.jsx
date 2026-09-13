import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import coreMetadata from "../.tasks/clone-scale.com/core-page-metadata.json";
import HeroSequence from "./HeroSequence";
import { RealWorldStage, CustomerRail } from "./InteractiveSections";
import ScrollingQuote from "./ScrollingQuote";
import { LatestSection, BenchmarkSection } from "./ContentSections";
import SiteRoutes, { localLink } from "./SiteRoutes";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const orbitImages = [
  "/images/application-research.png",
  "/images/application-medicine.png",
  "/images/application-decisions.png",
  "/images/application-energy.jpg",
  "/images/application-impact.jpg",
  "/images/application-sovereignty.jpg",
  "/images/application-robotics.jpg",
  "/images/application-capabilities.jpg",
  "/images/application-supply-chains.jpg",
  "/images/application-consequences.jpg",
  "/images/application-driving.png",
  "/images/application-logistics.jpg",
];

const routeHeroImages = [
  "/images/blog-physical-ai.png",
  "/images/blog-us-ai-policy.jpg",
  "/images/blog-bae-tactical-edge.jpg",
  "/images/blog-mcit-qatar.jpg",
  "/images/blog-swe-bench-pro.png",
  "/images/blog-morgan-stanley.png",
];

const latestCards = [
  {
    title: "Introducing Scale Labs",
    tone: "paper",
    image: "/images/blog-mayo-clinic-scale.png",
    href: "/blog/scale-labs",
  },
  {
    title: "Mayo Clinic + Scale: Reliable AI for Better Healthcare",
    tone: "green",
    image: "/images/blog-mayo-clinic-scale.png",
    href: "/blog/mayo-clinic-scale",
  },
  {
    title:
      "How Morgan Stanley deploys AI that actually works (hint: it’s evals)",
    tone: "blue",
    image: "/images/blog-morgan-stanley.png",
    href: "/blog/hitl-ep13-ai-evals-in-practice",
  },
  {
    title:
      "The Next Phase of U.S. AI Policy: Governance, Implementation, and Global Leadership",
    tone: "paper",
    image: "/images/blog-us-ai-policy.jpg",
    href: "/blog/next-phase-us-ai-policy",
  },
  {
    title: "Expanding Our Data Engine for Physical AI",
    tone: "paper",
    image: "/images/blog-physical-ai.png",
    href: "/blog/physical-ai",
  },
  {
    title: "Scale AI and BAE Systems Combine Forces to Modernize the Tactical Edge",
    tone: "paper",
    image: "/images/blog-bae-tactical-edge.jpg",
    href: "/blog/scale-bae-modernize-tactical-edge",
  },
  {
    title: "SWE-Bench Pro: Raising the Bar for Agentic Coding",
    tone: "paper",
    image: "/images/blog-swe-bench-pro.png",
    href: "/blog/swe-bench-pro",
  },
  {
    title: "MCIT & Scale AI: Paving the Way for Qatar’s Digital Future",
    tone: "blue",
    image: "/images/blog-mcit-qatar.jpg",
    href: "/blog/mcit-scale",
  },
];

const menuMedia = {
  Products: "/images/application-research.png",
  Solutions: "/images/application-driving.png",
  Research: "/images/blog-swe-bench-pro.png",
  Resources: "/images/blog-us-ai-policy.jpg",
};

const navGroups = {
  Products: {
    columns: [
      {
        label: "Build AI",
        items: [
          ["Scale Data Engine", "/data-engine"],
          ["For Generative AI", "/generative-ai-data-engine"],
          ["For Physical AI", "/physical-ai"],
          ["For Government", "/public-sector-data-engine"],
          ["For Automotive", "/automotive"],
          ["RL Environments", "/rlenvironments"],
          ["Experts", "/experts"],
        ],
      },
      {
        label: "Apply AI",
        items: [
          ["Scale GenAI Portfolio", "/genai-platform"],
          ["Scale Donovan", "/donovan"],
          ["For Model Developers", "/evaluation/model-developers"],
          ["For Public Sector", "/evaluation/public-sector"],
          ["For Enterprise", "/evaluation/enterprise"],
        ],
      },
    ],
  },
  Solutions: {
    columns: [
      {
        label: "Enterprise",
        items: [
          ["AI for Enterprise", "/enterprise"],
          ["Agentic Solutions", "/enterprise/agentic-solutions"],
          ["Healthcare", "/enterprise/healthcare"],
          ["Insurance", "/enterprise/insurance"],
        ],
      },
      {
        label: "Public Sector",
        items: [
          ["US Public Sector", "/public-sector"],
          ["National Security", "/public-sector/national-security"],
          ["Global Public Sector", "/global-public-sector"],
        ],
      },
    ],
  },
  Research: {
    columns: [
      {
        label: "Evaluate",
        items: [
          ["Scale Labs", "https://labs.scale.com/"],
          ["Leaderboards", "https://labs.scale.com/leaderboard"],
          ["Research Blog", "/blog"],
        ],
      },
      {
        label: "Explore",
        items: [
          ["About", "/about"],
          ["Security", "/security"],
          ["Datasets", "/datasets"],
        ],
      },
    ],
  },
  Resources: {
    columns: [
      {
        label: "Discover",
        items: [
          ["Blog", "/blog"],
          ["Events", "/events"],
          ["Guides", "/guides"],
          ["Documentation", "/docs"],
        ],
      },
      {
        label: "Work with Scale",
        items: [
          ["Data Partnerships", "/data-partnership"],
          ["Careers", "/careers"],
          ["Contact", "/demo"],
        ],
      },
    ],
  },
};

const customerCards = [
  ["CDAO", "Turning raw, classified data into actionable intelligence."],
  ["Meta", "Partnering to accelerate Meta’s LLM and Generative AI."],
  [
    "Mayo Clinic",
    "Turning complex patient records into clinical intelligence.",
  ],
  ["Time", "Powering an interactive AI experience for a century of journalism."],
  [
    "Howard Hughes",
    "Accelerating real estate development revenue and operations.",
  ],
  [
    "Physical Intelligence",
    "Fuelling the next generation of robotic foundation models.",
  ],
  [
    "Universal Robots",
    "Enabling scalable, real-world Physical AI for industrial robotics.",
  ],
  [
    "Center for AI Safety",
    "Benchmarking the frontier with expert-level evaluations.",
  ],
];

const customerLogos = {
  CDAO: "/images/customer-cdao.png",
  Meta: "/images/customer-meta.png",
  "Mayo Clinic": "/images/customer-mayo.png",
  Time: "/images/customer-time.png",
  "Howard Hughes": "/images/customer-howard-hughes.png",
  "Physical Intelligence": "/icons/customer-physical-intelligence.svg",
  "Universal Robots": "/images/customer-universal-robots.png",
  "Center for AI Safety": "/images/customer-center-ai-safety.png",
};

const footerGroups = [
  {
    label: "Products",
    items: [
      ["Scale Data Engine", "/data-engine"],
      ["Scale GenAI Portfolio", "/genai-platform"],
      ["Scale Donovan", "/donovan"],
    ],
  },
  {
    label: "Solutions",
    items: [
      ["Enterprise", "/enterprise"],
      ["Insurance", "/enterprise/insurance"],
      ["Healthcare", "/enterprise/healthcare"],
      ["National Security", "/public-sector/national-security"],
      ["US Public Sector", "/public-sector"],
      ["Global Public Sector", "/global-public-sector"],
    ],
  },
  {
    label: "Company",
    items: [
      ["About", "/about"],
      ["Careers", "/careers"],
      ["Security", "/security"],
      ["Terms", "/legal/terms"],
      ["Privacy", "/legal/privacy"],
      ["Modern Slavery Statement", "/legal/modern-slavery-statement"],
    ],
  },
  {
    label: "Resources",
    items: [
      ["Blog", "/blog"],
      ["Contact Us", "/demo"],
      ["Events", "/events"],
      ["Documentation", "/docs"],
      ["Data Partnerships", "/data-partnership"],
      ["Brand Guidelines", "https://brand.scale.com/"],
    ],
  },
  {
    label: "Guides",
    items: [
      ["Data Labeling", "/guides/data-labeling-annotation-guide"],
      ["ML Model Training", "/guides/model-training-building"],
      ["Diffusion Models", "/guides/diffusion-models-guide"],
      ["Guide To AI For ECommerce", "/guides/ai-for-ecommerce"],
      ["Computer Vision Applications", "/guides/computer-vision"],
      ["Large Language Models", "/guides/large-language-models"],
    ],
  },
];

function decodeHtml(value = "") {
  if (typeof document === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanTitle(title = "") {
  return decodeHtml(title)
    .replace(/\s*\|\s*Scale AI\s*$/i, "")
    .replace(/\s*\|\s*Scale\s*$/i, "");
}

function titleFromPath(pathname) {
  const segment = pathname.split("/").filter(Boolean).at(-1) || "Scale AI";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function SmartLink({ href, children, className = "", onClick, ...props }) {
  href = localLink(href);
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

function ArrowIcon({ direction = "right" }) {
  const rotation =
    direction === "down" ? 90 : direction === "left" ? 180 : 0;
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path d="M4 10h10M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

function ScaleMark({ inverted = false, compact = false }) {
  return (
    <SmartLink
      href="/"
      className={`scale-mark ${inverted ? "scale-mark--inverted" : ""}`}
      aria-label="Scale home"
    >
      {compact ? <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M26.6222 3.99373H5.3804C4.15244 3.99373 3.53846 5.47605 4.40659 6.34352L25.6484 27.5692C26.5166 28.4366 28 27.8218 28 26.5961V5.37046C28 4.60991 27.3833 3.99373 26.6222 3.99373Z"/>
        <path d="M13.9063 17.4729H4.63369C4.0973 17.4729 3.82977 18.1198 4.20832 18.4981L13.4822 27.7649C13.8608 28.1432 14.5082 27.8759 14.5082 27.3399V18.073C14.5082 17.7416 14.2393 17.4716 13.9063 17.4716V17.4729Z"/>
      </svg> : <img className="scale-mark__wordmark" src="/icons/scale-wordmark.svg" alt=""/>}
    </SmartLink>
  );
}

function Announcement({ hidden, onDismiss }) {
  return (
    <AnimatePresence initial={false}>
      {!hidden && (
        <motion.div
          className="announcement"
          role="region"
          aria-label="Announcement"
          initial={{ opacity: 1, maxHeight: 160 }}
          exit={{ opacity: 0, maxHeight: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        >
          <div className="announcement__content">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 4H27V27ZM4 17H14V28Z" fill="currentColor"/></svg>
            <span>Scale appoints Francis deSouza as the new CEO</span>
            <SmartLink href="/blog/scale-appoints-new-ceo">Learn more ↗</SmartLink>
          </div>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={onDismiss}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MegaMenu({ active, onClose }) {
  const group = active ? navGroups[active] : null;
  return (
    <AnimatePresence>
      {group && (
        <motion.div
          className={`mega-menu mega-menu--${active.toLowerCase()}`}
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onMouseLeave={onClose}
        >
          <div className="mega-menu__inner">
            {group.columns.map((column) => (
              <div key={column.label} className="mega-menu__column">
                <p>{column.label}</p>
                {column.items.map(([label, href]) => (
                  <SmartLink key={label} href={href} onClick={onClose}>
                    {label}
                  </SmartLink>
                ))}
              </div>
            ))}
            <div className="mega-menu__media" aria-hidden="true">
              <img src={menuMedia[active]} alt="" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }) {
  const [activeGroup, setActiveGroup] = useState(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) setActiveGroup(null);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-menu"
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ opacity: 0, transform: "translateY(-2%)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          exit={{ opacity: 0, transform: "translateY(-1%)" }}
          transition={{
            duration: reducedMotion ? 0.08 : 0.24,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <div className="mobile-menu__top">
            <ScaleMark />
            <button type="button" className="icon-button" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!activeGroup ? (
              <motion.div
                key="categories"
                className="mobile-menu__categories"
                initial={{ opacity: 0, transform: "translateX(-10px)" }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                exit={{ opacity: 0, transform: "translateX(-10px)" }}
                transition={{
                  duration: reducedMotion ? 0.05 : 0.3,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                {Object.keys(navGroups).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveGroup(label)}
                  >
                    <span>{label}</span>
                    <span aria-hidden="true">›</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={activeGroup}
                className="mobile-menu__detail"
                initial={{ opacity: 0, transform: "translateX(14px)" }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                exit={{ opacity: 0, transform: "translateX(14px)" }}
                transition={{
                  duration: reducedMotion ? 0.05 : 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <button
                  type="button"
                  className="mobile-menu__back"
                  aria-label="Back to categories"
                  onClick={() => setActiveGroup(null)}
                >
                  <span aria-hidden="true">‹</span>
                  {activeGroup}
                </button>
                {navGroups[activeGroup].columns.map((column) => (
                  <div key={column.label} className="mobile-menu__column">
                    <p>{column.label}</p>
                    {column.items.map(([label, href]) => (
                      <SmartLink key={label} href={href} onClick={onClose}>
                        {label}
                        <span aria-hidden="true">↗</span>
                      </SmartLink>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mobile-menu__actions">
            <SmartLink
              href="https://dashboard.scale.com/login"
              className="button button--outline"
            >
              Log In
            </SmartLink>
            <SmartLink
              href="/demo"
              className="button button--dark"
              onClick={onClose}
            >
              Get Started
            </SmartLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({ announcementHidden, onDismissAnnouncement }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Announcement
        hidden={announcementHidden}
        onDismiss={onDismissAnnouncement}
      />
      <header className="site-header">
        <ScaleMark />
        <nav
          aria-label="Primary navigation"
          className={`desktop-nav ${activeMenu ? "desktop-nav--open" : ""}`}
        >
          {Object.keys(navGroups).map((label) => (
            <button
              key={label}
              type="button"
              onMouseEnter={() => setActiveMenu(label)}
              onFocus={() => setActiveMenu(label)}
              onClick={() =>
                setActiveMenu((current) => (current === label ? null : label))
              }
              aria-expanded={activeMenu === label}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="site-header__actions">
          <SmartLink
            href="https://dashboard.scale.com/login"
            className="button button--outline desktop-only"
          >
            Log In
          </SmartLink>
          <SmartLink href="/demo" className="button button--dark">
            Get Started
          </SmartLink>
          <button
            type="button"
            aria-label="Open menu"
            className="icon-button mobile-only"
            onClick={() => setMobileOpen(true)}
          >
            <span className="hamburger" aria-hidden="true" />
          </button>
        </div>
        <MegaMenu active={activeMenu} onClose={() => setActiveMenu(null)} />
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}



function LegacyCta() {
  return (
    <section className="legacy-cta">
      <div>
        <h2>
          Our legacy,
          <br />
          your success.
        </h2>
        <p>
          Book a demo today and see how Scale can build reliable AI for your
          organization.
        </p>
        <SmartLink href="/demo" className="split-button">
          <span>Get Started</span>
          <span>
            <ArrowIcon />
          </span>
        </SmartLink>
      </div>
      <div className="legacy-cta__art" aria-hidden="true">
        <video
          src="/videos/legacy-cta-loop.mp4"
          autoPlay
          muted
          playsInline
          loop
        />
      </div>
    </section>
  );
}

function Footer({ onCookiePreferences }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__columns">
        <ScaleMark inverted compact />
        {footerGroups.map((group) => (
          <div key={group.label}>
            <p>{group.label}</p>
            {group.items.map(([label, href]) => (
              <SmartLink key={label} href={href}>
                {label}
              </SmartLink>
            ))}
          </div>
        ))}
      </div>
      <div className="site-footer__headline">
        Reliable AI for the world’s most
        <br />
        important decisions
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__social">
          <a href="https://www.linkedin.com/company/scaleai">
            <img src="/icons/social-linkedin.svg" alt="LinkedIn" />
          </a>
          <a href="https://x.com/scale_ai">
            <img src="/icons/social-x.svg" alt="X" />
          </a>
        </div>
        <div>
          <button type="button" onClick={onCookiePreferences}>
            Manage your cookie preferences
          </button>
          <span>Copyright © 2026 Scale AI, Inc.</span>
          <SmartLink href="/legal/terms">Terms of Use</SmartLink>
          <SmartLink href="/legal/privacy">Privacy Policy</SmartLink>
        </div>
      </div>
    </footer>
  );
}

function CookieControls({
  bannerOpen,
  preferencesOpen,
  onOpenPreferences,
  onClosePreferences,
  onDecision,
}) {
  const [expanded, setExpanded] = useState("Strictly Necessary Cookies");
  const [performance, setPerformance] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [targeting, setTargeting] = useState(false);

  useEffect(() => {
    if(!preferencesOpen) return;
    let saved={};
    try { saved=JSON.parse(window.localStorage.getItem('scale-clone-cookie-preferences')||'{}'); } catch { }
    setPerformance(saved.performance===true);
    setFunctional(saved.functional===true);
    setTargeting(saved.targeting===true);
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const close=(event)=>{if(event.key==='Escape')onClosePreferences();};
    window.addEventListener('keydown',close);
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',close);};
  },[preferencesOpen,onClosePreferences]);

  return (
    <>
      <AnimatePresence>
        {bannerOpen && !preferencesOpen && (
          <motion.div
            className="cookie-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "linear" }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bannerOpen && !preferencesOpen && (
          <motion.aside
            className="cookie-banner"
            initial={{ opacity: 0, transform: "translateY(100%)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            exit={{ opacity: 0, transform: "translateY(100%)" }}
            transition={{ duration: 1, ease: "linear" }}
            aria-label="Cookie consent"
          >
            <button
              type="button"
              className="cookie-banner__close"
              aria-label="Close cookie banner"
              onClick={() => onDecision("dismissed")}
            >
              ×
            </button>
            <p>
              This website uses cookies and similar technologies to ensure
              functionality, evaluate website usage, and to serve marketing
              content. Visit our <a href="/legal/privacy">Cookie Policy</a> and{" "}
              <a href="/legal/privacy">Privacy Policy</a> for more information.
            </p>
            <div>
              <button type="button" onClick={onOpenPreferences}>
                Cookie Preferences
              </button>
              <button type="button" onClick={() => onDecision("rejected")}>
                Reject Cookies
              </button>
              <button
                type="button"
                className="cookie-banner__accept"
                onClick={() => onDecision("accepted")}
              >
                Accept Cookies <span>→</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preferencesOpen && (
          <motion.div
              className="cookie-modal"
              data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
          >
            <motion.div
              className="cookie-modal__panel"
              initial={{ opacity: 0, transform: "scale(.97)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(.98)" }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <button
                type="button"
                className="cookie-modal__close"
                onClick={onClosePreferences}
                aria-label="Close cookie preferences"
              >
                ×
              </button>
              <ScaleMark compact />
              <h2 id="cookie-title">Privacy Preference Center</h2>
              <p>
                Choose which cookies this local replica may remember. No form
                data is sent to Scale.
              </p>
              {[
                ["Strictly Necessary Cookies", true, () => {}],
                ["Performance Cookies", performance, setPerformance],
                ["Functional Cookies", functional, setFunctional],
                ["Targeting Cookies", targeting, setTargeting],
              ].map(([label, value, setter]) => (
                <div className="cookie-category" key={label}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) =>
                        current === label ? null : label,
                      )
                    }
                    aria-expanded={expanded === label}
                  >
                    <span>{label}</span>
                    <span>{expanded === label ? "−" : "+"}</span>
                  </button>
                  {expanded === label && (
                    <div>
                      <p>
                        {label === "Strictly Necessary Cookies"
                          ? "Required for navigation and preference storage."
                          : "Optional local-only preference used by this replica."}
                      </p>
                      <label>
                        <input
                          type="checkbox"
                          checked={value}
                          disabled={label === "Strictly Necessary Cookies"}
                          onChange={(event) => setter(event.target.checked)}
                        />
                        <span>{value ? "Active" : "Inactive"}</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
              <div className="cookie-modal__actions">
                <button
                  type="button"
                  onClick={() => onDecision("preferences-saved", { performance, functional, targeting })}
                >
                  Save Preferences
                </button>
                <button type="button" onClick={() => onDecision("accepted")}>
                  Allow All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HomePage() {
  return (
    <main>
      <HeroSequence SmartLink={SmartLink} />
      <ScrollingQuote />
      <RealWorldStage SmartLink={SmartLink}>
        <CustomerRail SmartLink={SmartLink} />
      </RealWorldStage>
      <BenchmarkSection SmartLink={SmartLink} />
      <LatestSection SmartLink={SmartLink} />
      <LegacyCta />
    </main>
  );
}

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="demo-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted ? (
        <motion.div
          className="demo-form__success"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
        >
          <span>✓</span>
          <h2>Thank you.</h2>
          <p>This local demo recorded no data and sent nothing externally.</p>
          <button type="button" onClick={() => setSubmitted(false)}>
            Return to form
          </button>
        </motion.div>
      ) : (
        <>
          <label>
            Work email
            <input type="email" required placeholder="you@company.com" />
          </label>
          <label>
            First name
            <input type="text" required />
          </label>
          <label>
            Last name
            <input type="text" required />
          </label>
          <label>
            Company
            <input type="text" required />
          </label>
          <label className="demo-form__wide">
            How can Scale help?
            <textarea rows="5" />
          </label>
          <button className="button button--dark demo-form__wide" type="submit">
            Submit
          </button>
        </>
      )}
    </form>
  );
}

function RoutePage({ page, pathname }) {
  const isDemo = /demo|request/.test(pathname);
  const family = pathname.split("/").filter(Boolean)[0] || "company";
  const heading =
    decodeHtml(page?.heading || "") ||
    cleanTitle(page?.title || "") ||
    titleFromPath(pathname);
  const description =
    decodeHtml(page?.description || "") ||
    "Reliable AI systems, built for consequential work in the real world.";
  const image =
    page?.ogImage ||
    routeHeroImages[
      (pathname.length + family.length) % routeHeroImages.length
    ];

  return (
    <main className={`route-page route-page--${family}`}>
      <section className="route-hero">
        <div className="route-hero__media">
          <img src={image} alt="" />
        </div>
        <div className="route-hero__copy">
          <p className="eyebrow">{family.replaceAll("-", " ")}</p>
          <h1>{heading}</h1>
          <p>{description}</p>
          {!isDemo && (
            <SmartLink href="/demo" className="split-button">
              <span>Get Started</span>
              <span>
                <ArrowIcon />
              </span>
            </SmartLink>
          )}
        </div>
      </section>

      {isDemo ? (
        <section className="route-form-section">
          <div>
            <p className="eyebrow">Let’s scale together</p>
            <h2>Build reliable AI for your organization.</h2>
            <p>
              This replica keeps the complete form interaction local and never
              sends contact information to the source website.
            </p>
          </div>
          <DemoForm />
        </section>
      ) : (
        <>
          <section className="route-statement">
            <p>From ambitious idea to production system.</p>
            <h2>
              Data, evaluation, and applications aligned around the outcome.
            </h2>
          </section>
          <section className="route-capabilities">
            {[
              ["01", "Find the right problem"],
              ["02", "Build with frontier data"],
              ["03", "Evaluate what matters"],
              ["04", "Own the outcome"],
            ].map(([number, label]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{label}</h3>
                <p>
                  Purpose-built workflows, expert human feedback, and measured
                  reliability from development through deployment.
                </p>
              </article>
            ))}
          </section>
          <section className="route-band">
            <div>
              <p className="eyebrow">Reliable by design</p>
              <h2>Humans stay in the loop.</h2>
            </div>
            <SmartLink href="/about" className="button button--light">
              Learn More
            </SmartLink>
          </section>
          <LegacyCta />
        </>
      )}
    </main>
  );
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = useMemo(
    () => coreMetadata.pages.find((entry) => entry.pathname === pathname),
    [pathname],
  );
  const [announcementHidden, setAnnouncementHidden] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(
    () => !window.localStorage.getItem("scale-clone-cookie-choice"),
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: .14, wheelMultiplier: .8, autoRaf: false,
      autoResize: false, allowNestedScroll: true, syncTouch: matchMedia("(pointer: coarse)").matches });
    let frame;
    const tick = (time) => { lenis.raf(time); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.body);
    const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion=()=>motionPreference.matches||document.body.style.overflow==='hidden'?lenis.stop():lenis.start();
    motionPreference.addEventListener('change',updateMotion);
    const overlayObserver=new MutationObserver(updateMotion);
    overlayObserver.observe(document.body,{attributes:true,attributeFilter:['style']});
    updateMotion();
    return () => { cancelAnimationFrame(frame); observer.disconnect();overlayObserver.disconnect();motionPreference.removeEventListener('change',updateMotion); lenis.destroy(); };
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector('.site-header');
    if (pathname !== "/" || !header) return;
    let last = scrollY;
    const update = () => {
      const y = scrollY;
      const delta = y-last;
      if (Math.abs(delta)>2 || y<100) header.dataset.hidden = String(y>100 && delta>0);
      const bannerHeight=document.querySelector('.announcement')?.getBoundingClientRect().height || 0;
      header.style.top = `${Math.max(0,bannerHeight-y)}px`;
      document.documentElement.dataset.heroTheme = y>350 && y<innerHeight*6.5 ? 'dark' : 'light';
      last = y;
    };
    update(); window.addEventListener('scroll',update,{passive:true});
    const bannerObserver=new ResizeObserver(update);
    const banner=document.querySelector('.announcement');if(banner)bannerObserver.observe(banner);
    window.addEventListener('resize',update);
    return () => { window.removeEventListener('scroll',update);window.removeEventListener('resize',update);bannerObserver.disconnect(); delete document.documentElement.dataset.heroTheme; };
  }, [pathname,announcementHidden]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title =
      page?.title ||
      (pathname === "/"
        ? "Reliable AI Systems for Critical Decisions | Scale AI"
        : `${titleFromPath(pathname)} | Scale AI`);
  }, [page, pathname]);

  const decideCookies = (choice, preferences) => {
    window.localStorage.setItem("scale-clone-cookie-choice", choice);
    if(choice==='accepted'||choice==='rejected') {
      const enabled=choice==='accepted';
      window.localStorage.setItem('scale-clone-cookie-preferences',JSON.stringify({performance:enabled,functional:enabled,targeting:enabled}));
    } else if(preferences) window.localStorage.setItem('scale-clone-cookie-preferences',JSON.stringify(preferences));
    setBannerOpen(false);
    setPreferencesOpen(false);
  };

  if(pathname !== "/") return <SiteRoutes pathname={pathname}/>;

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app-shell${pathname === "/" ? " app-shell--home" : ""}`}>
        <Header
          announcementHidden={announcementHidden}
          onDismissAnnouncement={() => setAnnouncementHidden(true)}
        />
        {pathname === "/" ? (
          <HomePage />
        ) : (
          <RoutePage page={page} pathname={pathname} />
        )}
        <Footer onCookiePreferences={() => setPreferencesOpen(true)} />
        <CookieControls
          bannerOpen={bannerOpen}
          preferencesOpen={preferencesOpen}
          onOpenPreferences={() => setPreferencesOpen(true)}
          onClosePreferences={() => setPreferencesOpen(false)}
          onDecision={decideCookies}
        />
      </div>
    </MotionConfig>
  );
}
