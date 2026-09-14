"""Emits the static site.

The site itself has no build step — these are plain files served as-is. This
script exists so the header, footer and page shell stay identical across every
page, and so the copy comes from the real content module rather than being
re-typed. Run it, commit the output, serve the folder.

    python tools/build.py

Source of truth for copy: content.json, dumped from the live site's
src/takhaial/content.js. Personal attribution is stripped here — every project
is presented as the company's work.
"""

import html
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "tools", "content.json")

with io.open(DATA, encoding="utf-8") as fh:
    C = json.load(fh)

# ---------------------------------------------------------------- content prep

# No individual is named anywhere on this site; the work is the company's.
TYPE_MAP = {
    "Ammar’s personal portfolio": "Takhaial real-time 3D",
    "Ammar's personal portfolio": "Takhaial real-time 3D",
    "Ammar’s personal R&D": "Takhaial R&D",
    "Ammar's personal R&D": "Takhaial R&D",
}
PERSONAL = re.compile(r"Ammar[’']?s?\b[^.]*\.|\bAmmar\b", re.I)

for p in C["projects"]:
    p["type"] = TYPE_MAP.get(p["type"], p["type"])
    if p.get("summary"):
        p["summary"] = PERSONAL.sub("", p["summary"]).replace("  ", " ").strip()

for s in C["services"]:
    for key in ("body", "lead"):
        if s.get(key):
            s[key] = PERSONAL.sub("", s[key]).replace("  ", " ").strip()

SERVICES = {s["slug"]: s for s in C["services"]}
INDUSTRIES = {i["slug"]: i for i in C["industries"]}
PROJECTS = {p["slug"]: p for p in C["projects"]}
ARTICLES = {a["slug"]: a for a in C["articles"]}

# Films that exist under assets/video as a 720p web profile.
FILMS = {
    f[:-4]
    for f in os.listdir(os.path.join(ROOT, "assets", "video"))
    if f.endswith(".mp4")
}

EMAIL = "info@takhaialtech.com"
LINKEDIN = "https://www.linkedin.com/company/takhaialtechx/"

SERVICE_GROUPS = [
    ("Automate & integrate", ["ai-automation", "systems-integration"]),
    ("Understand & assist", ["ai-agents", "knowledge-systems"]),
    ("Build & experience", ["ai-creative-pipelines", "immersive-experiences", "real-time-3d"]),
]

# ---------------------------------------------------------------- helpers

def e(text):
    return html.escape(str(text), quote=False)


def para(text):
    return "<p>%s</p>" % e(text)


def anchor(slug):
    return re.sub(r"[^a-z0-9]+", "-", slug.lower()).strip("-")


def poster(name):
    return "assets/img/%s.webp" % name


def media_block(name, alt, classes="", play=True):
    """A poster that upgrades to the film when one exists for that project."""
    if play and name in FILMS:
        return (
            '<figure class="media {cls}">'
            '<video src="assets/video/{n}.mp4" poster="{p}" muted loop playsinline preload="none" '
            'aria-label="{a}"></video>'
            '<button type="button" class="media__play js-play" aria-label="Play {a}"></button>'
            "</figure>"
        ).format(cls=classes, n=name, p=poster(name), a=e(alt))
    return '<figure class="media {cls}"><img src="{p}" alt="{a}" loading="lazy"></figure>'.format(
        cls=classes, p=poster(name), a=e(alt)
    )


# ---------------------------------------------------------------- shell

NAV = [
    ("Services", "services.html", [(s["name"], "services.html#" + s["slug"]) for s in C["services"]]),
    ("Industries", "industries.html", [(i["name"], "industries.html#" + i["slug"]) for i in C["industries"]]),
    ("Work", "work.html", [("All work", "work.html"), ("XR & spatial", "work.html#xr"), ("Real-time 3D", "work.html#real-time-3d")]),
    ("How we work", "approach.html", [("The engagement", "approach.html#engagement"), ("Inside a build", "approach.html#build"), ("Commercial terms", "approach.html#terms")]),
    ("Insights", "insights.html", [(a["title"].rstrip("."), "insights.html#" + a["slug"]) for a in C["articles"]]),
    ("About", "about.html", [("About Takhaial", "about.html"), ("How we work", "approach.html"), ("Contact", "contact.html")]),
]


def head(title, description, page):
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://takhaialtech.com/{canon}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" href="/logo192.png">
<link rel="manifest" href="/manifest.json">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Takhaial Tech">
<meta property="og:url" content="https://takhaialtech.com/{canon}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://takhaialtech.com/takhaial-og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="https://takhaialtech.com/takhaial-og-image.png">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/responsive.css">
<link rel="stylesheet" href="assets/css/pages.css">
</head>
<body data-page="{page}">

<a class="skip-link" href="#main">Skip to main content</a>
""".format(title=e(title), desc=e(description), page=page,
           canon="" if page == "index" else page)


def header(active):
    items = []
    for label, href, children in NAV:
        links = "".join(
            '<a class="mega__link" href="%s">%s</a>' % (h, e(t)) for t, h in children
        )
        wide = " mega__inner--wide" if len(children) > 4 else ""
        items.append(
            """        <li class="main-nav__item{on}">
          <button type="button" class="main-nav__trigger" aria-expanded="false">{label}</button>
          <div class="mega">
            <div class="container mega__inner{wide}">
              <a class="mega__link mega__link--lead" href="{href}">Go to {label}</a>
              {links}
            </div>
          </div>
        </li>""".format(
                on=" is-current" if active == href else "",
                label=e(label), href=href, links=links, wide=wide,
            )
        )
    return """
<div class="utility-bar">
  <div class="container utility-bar__inner">
    <a class="utility-bar__sites" href="index.html">
      <span class="grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      Takhaial Tech
    </a>
    <div class="utility-bar__actions">
      <a class="utility-bar__link" href="{li}" target="_blank" rel="noreferrer">LinkedIn</a>
      <a class="utility-bar__link" href="mailto:{mail}">{mail}</a>
    </div>
  </div>
</div>

<header class="site-header" id="site-header">
  <div class="container site-header__inner">
    <a class="site-header__logo" href="index.html" aria-label="Takhaial Tech home">
      <img src="assets/img/dark-horizontal.png" alt="Takhaial Tech" width="137" height="30">
    </a>

    <nav class="main-nav" aria-label="Main navigation">
      <ul class="main-nav__list">
{items}
      </ul>

      <div class="drawer-extra">
        <div class="drawer-extra__group">
          <a class="drawer-row" href="mailto:{mail}">
            <svg class="drawer-row__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            {mail}
          </a>
          <a class="drawer-row" href="{li}" target="_blank" rel="noreferrer">
            <svg class="drawer-row__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7M7 7.2v.1M11 17v-4a2 2 0 0 1 4 0v4"/></svg>
            LinkedIn
          </a>
        </div>
      </div>

      <a class="drawer-cta" href="contact.html">Talk to our team</a>
    </nav>

    <div class="site-header__actions">
      <a class="btn btn--primary btn--small" href="contact.html">Talk to our team</a>
      <button type="button" class="burger js-burger" aria-label="Menu" aria-expanded="false">
        <span class="burger__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        <svg class="burger__x" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
    </div>
  </div>
</header>
""".format(items="\n".join(items), mail=EMAIL, li=LINKEDIN)


def cta_band(title='Start with one process. <em>See it working first.</em>',
             primary=("Talk to our team", "contact.html"),
             secondary=("How we work", "approach.html")):
    return """
  <section class="cta">
    <div class="container cta__inner">
      <p class="cta__title">{title}</p>
      <div class="btn-row btn-row--center">
        <a class="btn btn--yellow" href="{ph}">{pt}</a>
        <a class="btn btn--white" href="{sh}">{st}</a>
      </div>
    </div>
  </section>
""".format(title=title, pt=primary[0], ph=primary[1], st=secondary[0], sh=secondary[1])


def footer():
    svc = "".join('<li><a href="services.html#%s">%s</a></li>' % (s["slug"], e(s["name"])) for s in C["services"])
    ind = "".join('<li><a href="industries.html#%s">%s</a></li>' % (i["slug"], e(i["name"])) for i in C["industries"])
    return """
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__top">
      <div class="site-footer__about">
        <h2>About Takhaial</h2>
        <p>Takhaial Tech builds custom AI and automation for companies that run real
        operations. We start with one process, build the system that handles it, and
        show the result against how the work ran before. Our background in real-time
        software and immersive engineering is what lets us build the parts other
        teams leave out.</p>

        <h3>Join the conversation</h3>
        <ul class="social">
          <li><a href="{li}" target="_blank" rel="noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.82-1.95 3.75-1.95 4 0 4.4 2.5 4.4 5.8V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z"/></svg></a></li>
          <li><a href="mailto:{mail}" aria-label="Email"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a></li>
        </ul>
      </div>

      <nav class="site-footer__col" aria-label="Services">
        <h3 class="site-footer__acc-head"><button type="button" class="site-footer__acc js-footer-acc" aria-expanded="false">Services</button></h3>
        <ul>{svc}</ul>
      </nav>

      <nav class="site-footer__col" aria-label="Industries">
        <h3 class="site-footer__acc-head"><button type="button" class="site-footer__acc js-footer-acc" aria-expanded="false">Industries</button></h3>
        <ul>{ind}</ul>
      </nav>

      <nav class="site-footer__col" aria-label="Company">
        <h3 class="site-footer__acc-head"><button type="button" class="site-footer__acc js-footer-acc" aria-expanded="false">Company</button></h3>
        <ul>
          <li><a href="about.html">About Takhaial</a></li>
          <li><a href="work.html">Selected work</a></li>
          <li><a href="approach.html">How we work</a></li>
          <li><a href="insights.html">Insights</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="mailto:{mail}">{mail}</a></li>
        </ul>
      </nav>
    </div>

    <div class="site-footer__legal">
      <h3>Legal</h3>
      <ul>
        <li><a href="/privacy-policy">Privacy</a></li>
        <li><a href="/terms-of-service">Terms of use</a></li>
      </ul>
      <p class="site-footer__copy">&copy;2026 Takhaial Tech</p>
    </div>
  </div>
</footer>

<script src="assets/js/main.js"></script>
<script src="assets/js/pages.js"></script>
</body>
</html>
""".format(svc=svc, ind=ind, mail=EMAIL, li=LINKEDIN)


def page(filename, title, description, body, active=""):
    out = head(title, description, filename.replace(".html", "")) + header(active) + body + footer()
    with io.open(os.path.join(ROOT, filename), "w", encoding="utf-8") as fh:
        fh.write(out)
    return filename


if __name__ == "__main__":
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from pages import BUILDERS

    for build in BUILDERS:
        print("wrote", build())
