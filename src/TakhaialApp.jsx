import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import HeroSequence from "./HeroSequence";
import ScrollingQuote from "./ScrollingQuote";
import WorkflowDemo from "./takhaial/WorkflowDemo";
import Media, { Poster, ProjectGallery } from "./takhaial/Media";
import Contact from "./takhaial/Contact";
import Brand from './takhaial/Brand';
import { normalisePath } from "./takhaial/routing";
import {
  articles,
  company,
  engagement,
  engines,
  featuredWorkSlugs,
  industries,
  legacyRedirects,
  pageList,
  projects,
  services,
  solutions,
} from "./takhaial/content";
import "./takhaial/site.css";
const PUBLIC_PREVIEW = import.meta.env.VITE_PUBLIC_PREVIEW === "true";
const Admin = PUBLIC_PREVIEW ? null : lazy(() => import("./takhaial/Admin"));
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const Link = ({ children, ...props }) => <a {...props}>{children}</a>;
/* Four entries, one of which opens a panel at a time. Insights and How we work
   stay reachable from the footer and from the pages that lead to them. */
const nav = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Work", "/work"],
  ["About", "/about"],
];
const footerNav = [
  ...nav,
  ["Insights", "/insights"],
  ["How we work", "/approach"],
  ["Contact", "/contact"],
];
/* The seven services read as one list of seven decisions. Grouped, they read as
   three. Order inside a group follows the order of the services array. */
const serviceGroups = [
  ["Automate & integrate", ["ai-automation", "systems-integration"]],
  ["Understand & assist", ["ai-agents", "knowledge-systems"]],
  [
    "Build & experience",
    ["ai-creative-pipelines", "immersive-experiences", "real-time-3d"],
  ],
];
function Button({ children, href = "/contact", light = false }) {
  return (
    <a className={`tk-button${light ? " tk-button--light" : ""}`} href={href}>
      {children}
      <Arrow />
    </a>
  );
}
function Label({ children }) {
  return (
    <p className="tk-label">
      <i />
      {children}
    </p>
  );
}
function Header({ path, email = company.email }) {
  const [menu, setMenu] = useState(null),
    [mobile, setMobile] = useState(false),
    mobileRef = useRef(null),
    toggleRef = useRef(null);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  useEffect(() => {
    if (!mobile) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileRef.current?.querySelector("a,button")?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const focusables = [...mobileRef.current.querySelectorAll("a,button")];
      const first = focusables[0],
        last = focusables.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", trap);
    };
  }, [mobile]);
  const panel =
    menu === "Services"
      ? {
          href: "/services",
          heading: "A useful system starts with the right problem.",
          columns: serviceGroups.map(([title, slugs]) => [
            title,
            slugs
              .map((slug) => services.find((s) => s.slug === slug))
              .filter(Boolean)
              .map((s) => [s.name, "/services/" + s.slug, s.short]),
          ]),
        }
      : menu === "Industries"
        ? {
            href: "/industries",
            heading: "Built for the way your sector actually runs.",
            columns: [
              [
                null,
                industries.map((s) => [
                  s.name,
                  "/industries/" + s.slug,
                  s.short,
                ]),
              ],
            ],
          }
        : null;
  return (
    <>
      <a href="#main" className="tk-skip">
        Skip to content
      </a>
      <header className="tk-header" onMouseLeave={() => setMenu(null)}>
        <a className="tk-logo" href="/" aria-label="Takhaial Tech home">
          <Brand/>
        </a>
        <nav className="tk-desktop-nav" aria-label="Main navigation">
          {nav.map(([name, href]) =>
            ["Services", "Industries"].includes(name) ? (
              <button
                key={name}
                aria-expanded={menu === name}
                onMouseEnter={() => setMenu(name)}
                onFocus={() => setMenu(name)}
                onClick={() => setMenu(name)}
              >
                {name}
                <span>⌄</span>
              </button>
            ) : (
              <a
                key={name}
                href={href}
                aria-current={path.startsWith(href) ? "page" : undefined}
                onMouseEnter={() => setMenu(null)}
              >
                {name}
              </a>
            ),
          )}
        </nav>
        <div className="tk-header-actions">
          <a className="tk-header-cta" href="/contact">
            Let’s talk
            <Arrow />
          </a>
          <button
            ref={toggleRef}
            className="tk-menu-toggle"
            aria-label="Open navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <span />
            <span />
          </button>
        </div>
        {panel && (
          <div className="tk-megamenu">
            <div className="tk-megamenu-intro">
              <Label>{menu}</Label>
              <h2>{panel.heading}</h2>
              <a className="tk-text-link" href={panel.href}>
                Explore all {menu.toLowerCase()} <Arrow />
              </a>
            </div>
            <div
              className={`tk-megamenu-links${panel.columns.length > 1 ? " tk-megamenu-links--grouped" : ""}`}
            >
              {panel.columns.map(([title, links]) => (
                <div key={title || "all"} className="tk-megamenu-column">
                  {title && <p className="tk-megamenu-group">{title}</p>}
                  {links.map(([name, href, summary]) => (
                    <a key={href} href={href}>
                      <h3>
                        {name}
                        <Arrow />
                      </h3>
                      <p>{summary}</p>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
      {mobile && (
        <div
          ref={mobileRef}
          className="tk-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="tk-mobile-top">
            <Brand/>
            <button
              onClick={() => {
                setMobile(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>
          <nav>
            {footerNav
              .filter(([name]) => name !== "Contact")
              .map(([name, href]) => (
                <a key={href} href={href}>
                  {name}
                  <Arrow />
                </a>
              ))}
          </nav>
          <Button>Let’s talk</Button>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      )}
    </>
  );
}
function Footer({ email = company.email }) {
  return (
    <footer className="tk-footer">
      <div className="tk-container tk-footer-top">
        <div>
          <a className="tk-footer-logo" href="/">
            <Brand/>
          </a>
          <p>
            Intelligent systems.
            <br />
            Human possibilities.
          </p>
        </div>
        <nav aria-label="Footer">
          {footerNav.map(([name, path]) => (
            <a key={path} href={path}>
              {name}
            </a>
          ))}
        </nav>
        <div>
          <p>Let’s find the useful next step.</p>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={company.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
      <div className="tk-container tk-footer-bottom">
        <p>© {new Date().getFullYear()} Takhaial Tech</p>
        <a href="/privacy">Privacy</a>
        <a href={company.portfolio} target="_blank" rel="noreferrer">
          Selected work by Ammar Keshta ↗
        </a>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
function CTA({
  title = "Let’s find your first useful workflow.",
  body = "Start with a conversation about what happens today—and what should work better.",
}) {
  return (
    <section className="tk-cta">
      <div className="tk-container">
        <Label>Build what comes next</Label>
        <h2>{title}</h2>
        <p>{body}</p>
        <Button>Start a conversation</Button>
      </div>
      <div className="tk-cta-lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}
function ProjectCard({ project, large = false, trailer = false }) {
  const Tag = trailer ? "article" : "a";
  return (
    <Tag
      className={`tk-project-card${large ? " tk-project-card--large" : ""}${trailer ? " tk-project-card--trailer" : ""}`}
      href={trailer ? undefined : "/work/" + project.slug}
    >
      <div className="tk-project-card-image">
        {trailer ? <Media name={project.media} title={project.name} actionLabel="Watch Lexus VR trailer" /> : <><Poster name={project.media} alt={project.name} />
        <span className="tk-circle-arrow">
          <Arrow />
        </span></>}
      </div>
      <div className="tk-card-caption">
        <div>
          <small>{project.type}</small>
          <h3>{trailer ? <a href={"/work/" + project.slug}>{project.name} <Arrow /></a> : project.name}</h3>
        </div>
        <span>{project.category}</span>
      </div>
    </Tag>
  );
}
function ServiceRows({ items = services }) {
  return (
    <div className="tk-service-rows">
      {items.map((s, i) => (
        <a key={s.slug} href={"/services/" + s.slug}>
          <span className="tk-number">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
          </div>
          <Arrow />
        </a>
      ))}
    </div>
  );
}
function Home({ settings }) {
  return (
    <main id="main">
      <HeroSequence
        SmartLink={Link}
        title={settings.heroTitle}
        description={settings.heroDescription}
      />
      <section className="tk-home-offer" aria-labelledby="workflow-section-title">
       <div className="tk-container">
        <div className="tk-split-head">
          <Label>How it works</Label>
          <div>
            <h2 id="workflow-section-title">
              A request comes in.
              <br />
              The system does the next step.
            </h2>
            <p>
              Pick an example below and run it. This is the shape of what we
              build: the request is captured, the missing detail is found, a
              person approves what matters, and the next action is created — in
              the tools your team already uses.
            </p>
          </div>
        </div>
        <WorkflowDemo />
       </div>
      </section>
      <ScrollingQuote />
      <section className="tk-container tk-services-section">
        <div className="tk-split-head">
          <div>
            <Label>What we build</Label>
            <h2>
              From the first connection
              <br />
              to the whole experience.
            </h2>
          </div>
          <p>
            Automation and AI are our focus. Software, real-time 3D and XR give
            us the range to bring them into useful products and experiences.
          </p>
        </div>
        <ServiceRows />
      </section>
      <section className="tk-container tk-capability-section">
        <div className="tk-section-heading">
          <div>
            <Label>Inside every build</Label>
            <h2>Four capabilities behind the work.</h2>
          </div>
          <a href="/approach" className="tk-text-link">
            How we work <Arrow />
          </a>
        </div>
        <div className="tk-capability-row">
          {engines.map((e, i) => (
            <article key={e.slug}>
              <span className="tk-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{e.name}</h3>
              <p>{e.short}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="tk-dark tk-work-section">
        <div className="tk-container">
          <div className="tk-section-heading">
            <div>
              <Label>Takhaial AR &amp; VR</Label>
              <h2>Engineering you can see.</h2>
            </div>
            <a href="/work" className="tk-text-link">
              Explore the work <Arrow />
            </a>
          </div>
          <div className="tk-featured-work">
            {featuredWorkSlugs.map((slug,index)=><ProjectCard key={slug} project={projects.find(p=>p.slug===slug)} large={index===0} trailer={index===0} />)}
          </div>
          <p className="tk-work-boundary">
            Selected AR and VR work by Takhaial Tech—from immersive automotive showrooms to spatial product and cultural experiences.
          </p>
        </div>
      </section>
      <section className="tk-container tk-evolution">
        <div className="tk-evolution-copy">
          <Label>Built for your sector</Label>
          <h2>
            Same engineering.
            <br />
            Different floor plan.
          </h2>
          <p>
            A safety alert on a production line and a missed property enquiry
            are the same failure: information that arrived too late to act on.
            The build differs by sector—the discipline does not.
          </p>
          <ul className="tk-industry-strip">
            {industries.map((s) => (
              <li key={s.slug}>
                <a href={"/industries/" + s.slug}>
                  {s.name}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Media
          name="product-validation"
          title="Interactive product validation"
        />
      </section>
      <section className="tk-insight-section tk-container">
        <div className="tk-section-heading">
          <div>
            <Label>Ideas for the next step</Label>
            <h2>
              Practical thinking.
              <br />
              Before the build.
            </h2>
          </div>
          <a href="/insights" className="tk-text-link">
            All insights <Arrow />
          </a>
        </div>
        <ArticleCards />
      </section>
      <CTA />
    </main>
  );
}
function Intro({ label, title, body }) {
  return (
    <section className="tk-page-intro tk-container">
      {label && <Label>{label}</Label>}
      <h1>{title}</h1>
      {body && <p>{body}</p>}
    </section>
  );
}
function ServicesIndex() {
  return (
    <main id="main">
      <Intro
        label="Services"
        title="Build the system your work needs."
        body="AI and automation first. Connected software and immersive technology where the task calls for them."
      />
      <section className="tk-container tk-bottom-space">
        <ServiceRows />
      </section>
      <section className="tk-dark tk-container-full">
        <div className="tk-container tk-split-head">
          <h2>
            A first project
            <br />
            with a clear purpose.
          </h2>
          <div>
            <p>
              We define one use case, its constraints and how you’ll judge the
              result. The output might be a workflow pilot, a working product or
              a focused experience—not a slide deck about what AI might do.
            </p>
            <a href="/approach" className="tk-text-link">
              How we work <Arrow />
            </a>
          </div>
        </div>
      </section>
      <CTA />
    </main>
  );
}
function ServicePage({ service: s }) {
  const [choice, setChoice] = useState(0);
  return (
    <main id="main">
      <Intro label={s.name} title={s.headline} body={s.lead} />
      <div className="tk-container tk-detail-jump">
        <a href="#scope">The opportunity</a>
        <a href="#examples">Examples</a>
        <a href="#delivery">What you get</a>
        <a href="#related-work">Relevant work</a>
        <a href={`/contact?service=${s.slug}`}>
          Discuss a project <Arrow />
        </a>
      </div>
      <section className="tk-container tk-editorial-split" id="scope">
        <h2>{s.focus}</h2>
        <p>{s.body}</p>
      </section>
      <section className="tk-scenario-section tk-container" id="examples">
        <Label>Ways to apply it</Label>
        <h2>Make the next step concrete.</h2>
        <div className="tk-scenarios">
          <div role="group" aria-label="Use case examples">
            {s.examples.map((e, i) => (
              <button
                key={e}
                aria-pressed={choice === i}
                onClick={() => setChoice(i)}
              >
                <span>0{i + 1}</span>
                {e}
                <Arrow />
              </button>
            ))}
          </div>
          <div
            className="tk-scenario-result"
            role="region"
            aria-label="Selected use case"
            aria-live="polite"
          >
            <small>EXAMPLE OPPORTUNITY / 0{choice + 1}</small>
            <h3>{s.examples[choice]}</h3>
            <p>
              We’ll start by mapping the current process, the available
              information and the people who own the next action. The scope and
              success criteria are agreed before implementation.
            </p>
            <Button href={`/contact?service=${s.slug}`}>
              Explore this with us
            </Button>
          </div>
        </div>
      </section>
      {["ai-automation", "ai-agents", "knowledge-systems"].includes(s.slug) && (
        <section className="tk-container tk-bottom-space">
          <WorkflowDemo initial={s.lane} />
        </section>
      )}
      <section className="tk-dark tk-container-full" id="delivery">
        <div className="tk-container">
          <div className="tk-split-head">
            <div>
              <Label>What you get</Label>
              <h2>
                A working result.
                <br />A clear handover.
              </h2>
            </div>
            <ol className="tk-deliverables">
              {s.deliverables.map((d, i) => (
                <li key={d}>
                  <span>0{i + 1}</span>
                  {d}
                </li>
              ))}
            </ol>
          </div>
          <div className="tk-process-strip">
            {s.steps.map((d, i) => (
              <div key={d}>
                <small>0{i + 1}</small>
                <h3>{d}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="tk-container tk-bottom-space tk-related"
        id="related-work"
      >
        <div className="tk-section-heading">
          <h2>Related engineering experience.</h2>
          <a href="/work" className="tk-text-link">
            All work <Arrow />
          </a>
        </div>
        <div className="tk-project-grid">
          {s.related.map((slug) => (
            <ProjectCard
              key={slug}
              project={projects.find((p) => p.slug === slug)}
            />
          ))}
        </div>
      </section>
      <CTA />
    </main>
  );
}
function EngineGrid({ dark = false }) {
  return (
    <div className={`tk-engine-grid${dark ? " tk-engine-grid--dark" : ""}`}>
      {engines.map((e, i) => (
        <article key={e.slug}>
          <span className="tk-number">{String(i + 1).padStart(2, "0")}</span>
          <h3>{e.name}</h3>
          <p className="tk-engine-lead">{e.short}</p>
          <p>{e.body}</p>
          <p className="tk-engine-meta">{e.meta}</p>
        </article>
      ))}
    </div>
  );
}
function IndustriesIndex() {
  return (
    <main id="main">
      <Intro
        label="Industries"
        title="Start where the work gets stuck."
        body="The same engineering, pointed at the problems a sector actually has. Each one lists what we can build today, and where the boundary sits."
      />
      <section className="tk-container tk-industry-list">
        {industries.map((s, i) => (
          <a href={"/industries/" + s.slug} key={s.slug}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <div>
              <h2>{s.name}</h2>
              <p>{s.lead}</p>
            </div>
            <ul className="tk-tag-row">
              {s.sectors.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <Arrow />
          </a>
        ))}
      </section>
      <section className="tk-dark tk-container-full tk-engine-section">
        <div className="tk-container">
          <div className="tk-split-head">
            <div>
              <Label>Inside every build</Label>
              <h2>
                Four capabilities
                <br />
                behind the work.
              </h2>
            </div>
            <p>
              Whatever the sector, the same foundations decide whether the
              result is trustworthy enough to run on.
            </p>
          </div>
          <EngineGrid dark />
        </div>
      </section>
      <CTA />
    </main>
  );
}
function IndustryPage({ industry: s }) {
  const related = s.services
    .map((slug) => services.find((x) => x.slug === slug))
    .filter(Boolean);
  return (
    <main id="main">
      <Intro label={s.name} title={s.headline} body={s.lead} />
      <section className="tk-container tk-industry-meta">
        <ul className="tk-tag-row">
          {s.sectors.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </section>
      <section className="tk-container tk-editorial-split">
        <h2>
          What usually
          <br />
          goes wrong.
        </h2>
        <p>{s.problem}</p>
      </section>
      <section className="tk-container tk-use-cases">
        <Label>What we can build</Label>
        <div className="tk-use-case-groups">
          {s.groups.map((g) => (
            <div key={g.title}>
              <h3>
                {g.title}
                {g.latin && <small>{g.latin}</small>}
              </h3>
              <ul className="tk-simple-list">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="tk-container tk-bottom-space">
        <WorkflowDemo initial={s.lane} />
      </section>
      <section className="tk-dark tk-container-full">
        <div className="tk-container tk-split-head">
          <h2>
            Designed with
            <br />
            clear boundaries.
          </h2>
          <p>{s.guardrail}</p>
        </div>
      </section>
      <section className="tk-container tk-related-services">
        <div className="tk-section-heading">
          <div>
            <Label>Where this gets built</Label>
            <h2>The services behind it.</h2>
          </div>
          <a href="/industries" className="tk-text-link">
            All industries <Arrow />
          </a>
        </div>
        <ServiceRows items={related} />
      </section>
      <CTA />
    </main>
  );
}
function WorkIndex() {
  const [category, setCategory] = useState("All work"),
    [query, setQuery] = useState("");
  const shown = projects.filter(
    (p) =>
      (category === "All work" || p.category === category) &&
      `${p.name} ${p.tags.join(" ")} ${p.summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main id="main">
      <Intro
        label="Selected work"
        title="Ideas made real."
        body="Company projects, experiments and selected work by Ammar Keshta. Explore the craft behind our software, AI and immersive capabilities."
      />
      <section className="tk-container tk-bottom-space">
        <div className="tk-work-filters">
          <div role="group" aria-label="Filter work">
            {["All work", "AI & R&D", "XR", "Real-time 3D"].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="search"
            aria-label="Search work"
            placeholder="Find a project…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="tk-results" aria-live="polite">
          {shown.length} projects
        </p>
        <div className="tk-project-grid">
          {shown.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        {!shown.length && (
          <div className="tk-empty">
            <h2>No matching projects.</h2>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All work");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <CTA />
    </main>
  );
}
function WorkPage({ project: p }) {
  return (
    <main id="main">
      <Intro label={p.type} title={p.title} body={p.summary} />
      <section className="tk-container">
        <div className="tk-project-meta">
          <span>{p.name}</span>
          <span>{p.tags.join(" / ")}</span>
        </div>
        {p.slug === "ai-unity-vr" ? (
          <ProjectGallery name={p.media} title={p.name} />
        ) : (
          <Media name={p.media} title={p.name} hasVideo={!p.imageOnly} />
        )}
        {p.fullFilm && (
          <p className="tk-attribution">
            {p.preview
              ? "The local player shows an eight-second preview."
              : "The original project film is hosted externally."}{" "}
            <a
              href={p.fullFilm}
              target="_blank"
              rel="noreferrer"
              className="tk-text-link"
            >
              Watch the complete film on YouTube <Arrow />
            </a>
          </p>
        )}
      </section>
      <section className="tk-container tk-case-body">
        <div>
          <Label>Project notes</Label>
          <h2>
            The thinking
            <br />
            behind the work.
          </h2>
        </div>
        <div>
          <section>
            <h3>Context</h3>
            <p>{p.context}</p>
          </section>
          <section>
            <h3>What was built</h3>
            <p>{p.built}</p>
          </section>
          <section>
            <h3>Why it matters</h3>
            <p>{p.connection}</p>
          </section>
          {p.external && (
            <a
              className="tk-text-link"
              href={p.external}
              target="_blank"
              rel="noreferrer"
            >
              View the original portfolio project <Arrow />
            </a>
          )}
          <p className="tk-attribution">
            Attribution: {p.type}. Project media is presented as a record of
            this work. No performance metrics or additional client relationships
            are implied.
          </p>
        </div>
      </section>
      <section className="tk-container tk-bottom-space">
        <div className="tk-section-heading">
          <h2>Keep exploring.</h2>
          <a href="/work" className="tk-text-link">
            All projects <Arrow />
          </a>
        </div>
        <div className="tk-project-grid">
          {projects
            .filter((x) => x.slug !== p.slug && x.category === p.category)
            .slice(0, 2)
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
      </section>
      <CTA />
    </main>
  );
}
function ArticleCards() {
  return (
    <div className="tk-article-cards">
      {articles.map((a, i) => (
        <a key={a.slug} href={"/insights/" + a.slug}>
          <div
            className={`tk-article-art tk-article-art--${i}`}
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </div>
          <small>Field notes · {a.minutes}</small>
          <h3>{a.title}</h3>
          <p>{a.summary}</p>
          <span>
            Read the guide <Arrow />
          </span>
        </a>
      ))}
    </div>
  );
}
function ArticlePage({ article: a }) {
  return (
    <main id="main">
      <Intro
        label={`Field notes · ${a.minutes}`}
        title={a.title}
        body={a.summary}
      />
      <div className="tk-container tk-article-layout">
        <aside>
          <p>In this guide</p>
          {a.sections.map(([title], i) => (
            <a key={title} href={"#section-" + i}>
              {title}
            </a>
          ))}
        </aside>
        <article>
          {a.sections.map(([title, body], i) => (
            <section id={"section-" + i} key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          <div className="tk-article-end">
            <p>Have a workflow in mind?</p>
            <a className="tk-text-link" href="/contact">
              Let’s explore it together <Arrow />
            </a>
          </div>
        </article>
      </div>
      <CTA />
    </main>
  );
}
function About() {
  return (
    <main id="main">
      <Intro
        label="About Takhaial"
        title="Technology, with somewhere useful to go."
        body="Takhaial Tech connects creative engineering with practical business needs. Our next chapter puts AI and automation at the centre."
      />
      <section className="tk-container tk-editorial-split tk-about-opening">
        <h2>
          New focus.
          <br />
          Real foundations.
        </h2>
        <div>
          <p>
            We’ve worked across interactive applications, immersive experiences
            and real-time visual systems. Building those experiences means
            thinking about people, software, content and the environment
            together.
          </p>
          <p>
            We’re bringing that same approach to AI and automation: understand
            the task, connect the right tools, design for the person using them
            and verify the result.
          </p>
        </div>
      </section>
      <section className="tk-dark tk-container-full">
        <div className="tk-container tk-split-head">
          <div>
            <Label>Where we’re going</Label>
            <h2>
              Automation first.
              <br />
              More possibilities ahead.
            </h2>
          </div>
          <div>
            <p>
              We focus on workflows that help teams handle information, requests
              and decisions. XR and other emerging technologies remain part of
              our longer-term direction when they add practical value.
            </p>
            <p>
              We don’t start with a technology and search for a reason to use
              it. We start with the work.
            </p>
            <a href="/services" className="tk-text-link">
              Explore our capabilities <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="tk-container tk-editorial-split">
        <div>
          <Label>The people behind the work</Label>
          <h2>
            Creative depth.
            <br />
            Engineering ownership.
          </h2>
        </div>
        <div>
          <p>
            Selected work by Ammar Keshta adds a view into the technical art,
            Unity, Unreal and AI-assisted production experience behind this
            direction.
          </p>
          <p>
            Personal work and company projects are clearly identified throughout
            the portfolio. We share the work for what it demonstrates, without
            turning every experiment into a client claim.
          </p>
          <a
            href={company.portfolio}
            target="_blank"
            rel="noreferrer"
            className="tk-text-link"
          >
            Explore Ammar’s portfolio <Arrow />
          </a>
        </div>
      </section>
      <CTA />
    </main>
  );
}
function Approach() {
  const steps = [
    [
      "Discover",
      "Map the current workflow, owners, tools and constraints. Identify one opportunity worth testing.",
      "An opportunity brief and a clear scope.",
    ],
    [
      "Prototype",
      "Build a focused version using representative inputs. Make the important interactions and risks visible early.",
      "A working prototype to review.",
    ],
    [
      "Connect",
      "Integrate the approved knowledge, systems and interfaces. Design access, review and exception paths.",
      "An end-to-end workflow.",
    ],
    [
      "Validate",
      "Check normal cases, missing information, failures and handover. Compare the result with agreed acceptance criteria.",
      "Evidence for the release decision.",
    ],
    [
      "Hand over & improve",
      "Document how the system works, who owns it and how to maintain it. Use real feedback to decide what comes next.",
      "A usable system and an improvement plan.",
    ],
  ];
  return (
    <main id="main">
      <Intro
        label="How we work"
        title="A clear path from problem to working system."
        body="We keep scope, ownership and evidence visible. Each stage answers a question before the next commitment."
      />
      <section className="tk-dark tk-container-full tk-engagement">
        <div className="tk-container">
          <div className="tk-split-head">
            <div>
              <Label>Before anything is signed</Label>
              <h2>
                Proof first.
                <br />
                Then a commitment.
              </h2>
            </div>
            <p>
              A transformation programme is an expensive way to discover you
              picked the wrong problem. We would rather find the problem, build
              one answer to it, and let the result make the argument.
            </p>
          </div>
          <div className="tk-engagement-steps">
            {engagement.steps.map(([title, body], i) => (
              <article key={title}>
                <span className="tk-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tk-container tk-principles">
        <div className="tk-split-head">
          <div>
            <Label>How the commercials work</Label>
            <h2>
              Priced against use,
              <br />
              not against hope.
            </h2>
          </div>
          <p>
            Software you pay for and never open is the most common waste in this
            category. These three rules exist to keep that from happening.
          </p>
        </div>
        <div className="tk-principle-row">
          {engagement.principles.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="tk-container tk-approach-list">
        <Label>Inside a build</Label>
        {steps.map(([title, body, out], i) => (
          <div key={title}>
            <span>0{i + 1}</span>
            <h2>{title}</h2>
            <div>
              <p>{body}</p>
              <small>YOU LEAVE WITH</small>
              <p>{out}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="tk-container tk-starting-points">
        <div className="tk-section-heading">
          <div>
            <Label>Where teams usually start</Label>
            <h2>Three opportunities worth checking first.</h2>
          </div>
        </div>
        <div className="tk-starting-point-row">
          {solutions.map((s) => (
            <article key={s.slug}>
              <h3>{s.name}</h3>
              <p>{s.lead}</p>
              <ol className="tk-flow-list">
                {s.flow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <a className="tk-text-link" href={"/services/" + s.service}>
                See the service <Arrow />
              </a>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </main>
  );
}
function Privacy() {
  return (
    <main id="main">
      <Intro
        label="Privacy"
        title="A clear view of your information."
        body="How this local website preview handles information."
      />
      <article className="tk-policy">
        <h2>Contact briefs</h2>
        <p>
          The contact form prepares a brief in your browser. It does not submit
          the brief to a server. Opening an email draft or WhatsApp link
          transfers you to a service you choose to use. You decide whether to
          send it.
        </p>
        <h2>Local administration</h2>
        <p>
          The unlisted administration area uses a local authentication session.
          Its password is stored as a salted server-side hash, not in the page
          code. Content settings are stored locally. Administrator session
          cookies are used only for authentication.
        </p>
        <h2>Media and analytics</h2>
        <p>
          Project media is served from the local site. This preview does not
          install advertising trackers or analytics. Links to portfolio and
          social sites open services with their own privacy practices.
        </p>
        <h2>Before publication</h2>
        <p>
          Hosting, contact delivery, retention and applicable policy
          requirements must be reviewed before this preview is published. This
          page describes the current local implementation and is not a claim of
          legal certification.
        </p>
        <h2>Questions</h2>
        <p>
          Contact <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      </article>
    </main>
  );
}
function NotFound() {
  return (
    <main id="main" className="tk-not-found tk-container">
      <Label>404</Label>
      <h1>
        This page isn’t part
        <br />
        of our next chapter.
      </h1>
      <p>Explore Takhaial’s services, selected work or start a conversation.</p>
      <Button href="/">Back to Takhaial</Button>
      <a href="/services" className="tk-text-link">
        Explore services <Arrow />
      </a>
    </main>
  );
}
export function RoutedPage({ path, settings = {} }) {
  const service = services.find((s) => path === "/services/" + s.slug),
    industry = industries.find((s) => path === "/industries/" + s.slug),
    project = projects.find((p) => path === "/work/" + p.slug),
    article = articles.find((a) => path === "/insights/" + a.slug);
  if (path === "/") return <Home settings={settings} />;
  if (service) return <ServicePage service={service} />;
  if (industry) return <IndustryPage industry={industry} />;
  if (project) return <WorkPage project={project} />;
  if (article) return <ArticlePage article={article} />;
  if (path === "/services") return <ServicesIndex />;
  if (path === "/industries") return <IndustriesIndex />;
  if (path === "/work") return <WorkIndex />;
  if (path === "/insights")
    return (
      <main id="main">
        <Intro
          label="Field notes"
          title="Make a better first decision."
          body="Practical guides to choosing, building and evaluating AI-enabled workflows."
        />
        <section className="tk-container tk-bottom-space">
          <ArticleCards />
        </section>
        <CTA />
      </main>
    );
  if (path === "/about") return <About />;
  if (path === "/approach") return <Approach />;
  if (path === "/contact")
    return <Contact email={settings.contactEmail || company.email} />;
  if (path === "/privacy") return <Privacy />;
  return <NotFound />;
}
export default function TakhaialApp() {
  const path = normalisePath(location.pathname),
    [settings, setSettings] = useState({});
  /* Addresses published while Solutions existed keep working. */
  useEffect(() => {
    const target = legacyRedirects[path];
    if (target) location.replace(target);
  }, [path]);
  useEffect(() => {
    if (PUBLIC_PREVIEW) return;
    let active = true;
    fetch("/api/takhaial/content")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (active) setSettings(data.settings || {});
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const page = pageList.find((p) => p.path === path);
    document.title =
      (path === "/"
        ? "AI & Automation"
        : page?.title ||
          (path === "/studio" && !PUBLIC_PREVIEW ? "Local Studio" : "Page not found")) +
      " | Takhaial Tech";
    document.documentElement.dataset.site = "takhaial";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let lenis, raf;
    if (!reduced.matches) {
      lenis = new Lenis({
        lerp: 0.14,
        wheelMultiplier: 0.8,
        anchors: true,
        prevent: (node) =>
          !!node.closest?.(
            "dialog,.tk-mobile-menu,.tk-contact__form,.tk-workflow,.tk-admin",
          ),
      });
      const tick = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [path]);
  if (path === "/studio" && !PUBLIC_PREVIEW)
    return (
      <Suspense fallback={<div className="tk-loading">Loading studio…</div>}>
        <Admin
          defaultSettings={{
            heroTitle: "Custom AI and automation for your operation.",
            heroDescription:
              "We build one process properly — document handling, safety monitoring, enquiry response, reporting — and connect it to the systems you already use.",
            contactEmail: company.email,
          }}
        />
      </Suspense>
    );
  return (
    <div id="top" className={`tk-app${path === "/" ? " tk-app--home" : ""}`}>
      <Header path={path} email={settings.contactEmail || company.email} />
      <RoutedPage path={path} settings={settings} />
      <Footer email={settings.contactEmail || company.email} />
    </div>
  );
}
