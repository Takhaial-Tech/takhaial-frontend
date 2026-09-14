"""Page builders. Run via `python tools/build.py`."""

from build import (  # noqa: F401
    ARTICLES, C, EMAIL, INDUSTRIES, LINKEDIN, PROJECTS, SERVICES, SERVICE_GROUPS,
    cta_band, e, media_block, page, poster,
)


def page_hero(eyebrow, title, lead, extra=""):
    return """
<main id="main">
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p class="page-hero__lead">{lead}</p>
      {extra}
    </div>
  </section>
""".format(eyebrow=e(eyebrow), title=e(title), lead=e(lead), extra=extra)


def project_card(slug):
    p = PROJECTS[slug]
    tags = "".join('<li>%s</li>' % e(t) for t in p.get("tags", [])[:3])
    return """
        <article class="work-card reveal" id="{slug}">
          {media}
          <div class="work-card__body">
            <p class="eyebrow">{type} &middot; {cat}</p>
            <h3>{name}</h3>
            <p>{summary}</p>
            <ul class="tag-row">{tags}</ul>
          </div>
        </article>""".format(
        slug=p["slug"], media=media_block(p["media"], p["name"]),
        type=e(p["type"]), cat=e(p["category"]), name=e(p["name"]),
        summary=e(p.get("summary") or ""), tags=tags,
    )


# ------------------------------------------------------------------ home

def build_home():
    slides = [
        ("Custom AI and automation <em>for your operation</em>",
         "We build one process properly — document handling, safety monitoring, enquiry response, reporting — and connect it to the systems you already use.",
         "hero-operation", "Scattered work resolving into one ordered system",
         ("Talk to our team", "contact.html"), ("See what we build", "services.html")),
        ("When the work has to <em>be seen to be understood</em>",
         "Virtual showrooms, spatial demonstrations and guided training. Real-time 3D is the engineering foundation under our AI work, not a side business.",
         "lexus-vr-showroom", "Lexus VR showroom",
         ("Explore the work", "work.html"), ("XR &amp; spatial", "services.html#immersive-experiences")),
        ("You see the numbers <em>before you commit</em>",
         "We map how the work moves today, build one system that handles it, then measure the result against how the process ran before.",
         "product-validation", "Interactive product validation",
         ("How we work", "approach.html"), ("Start with one process", "contact.html")),
    ]
    track = ""
    for i, (title, body, media, alt, a, b) in enumerate(slides):
        open_tag = "h1" if i == 0 else 'h2 class="hero__title"'
        close_tag = "h1" if i == 0 else "h2"
        track += """
        <article class="hero__slide{on}">
          <div class="hero__copy">
            <{open}>{title}</{close}>
            <p>{body}</p>
            <div class="btn-row">
              <a class="btn btn--primary" href="{ah}">{at}</a>
              <a class="btn btn--outline" href="{bh}">{bt}</a>
            </div>
          </div>
          <div class="hero__media"><img src="{img}" alt="{alt}" loading="{load}"></div>
        </article>""".format(
            on=" is-active" if i == 0 else "", open=open_tag, close=close_tag,
            title=title, body=e(body), img=poster(media), alt=e(alt),
            load="eager" if i == 0 else "lazy",
            at=a[0], ah=a[1], bt=b[0], bh=b[1])

    dots = "".join(
        '<button type="button" class="hero__dot%s" role="tab" aria-label="Slide %d"></button>'
        % (" is-active" if i == 0 else "", i + 1) for i in range(len(slides)))

    sectors = [s for i in C["industries"] for s in i["sectors"][:4]]
    chips = "".join('<div class="logos__item"><span class="sector-chip">%s</span></div>' % e(s)
                    for s in sectors)

    # The home card is a headline, one sentence and the keywords. The full
    # paragraph lives on the services page, where someone is already reading.
    caps = "".join(
        """<article class="path reveal">
             <div class="path__num">{n:02d}</div>
             <h3>{name}</h3>
             <p>{short}</p>
             <ul class="keys">{keys}</ul>
           </article>""".format(
            n=i + 1, name=e(g["name"]), short=e(g["short"]),
            keys="".join("<li>%s</li>" % e(k.strip()) for k in g["meta"].split("·")))
        for i, g in enumerate(C["engines"]))

    ind_cards = "".join(
        """<a class="ind-card reveal" href="industries.html#{slug}">
             <h3>{name}</h3>
             <p>{short}</p>
             <span class="arrow-link">See what we build</span>
           </a>""".format(slug=i["slug"], name=e(i["name"]), short=e(i["short"]))
        for i in C["industries"])

    work = "".join(project_card(s) for s in
                   ["lexus-vr-showroom", "heritage-spatial-experience", "oil-sector-ar"])

    reads = "".join(
        """<a class="teaser reveal" href="insights.html#{slug}">
             <div class="teaser__body">
               <p class="eyebrow">Article</p>
               <h3>{title}</h3>
               <p>{summary}</p>
             </div>
           </a>""".format(slug=a["slug"], title=e(a["title"].rstrip(".")), summary=e(a["summary"]))
        for a in C["articles"])

    body = """
<main id="main">
  <section class="hero" aria-label="Featured">
    <div class="container hero__inner">
      <div class="hero__track js-hero-track">{track}
      </div>
      <div class="hero__dots js-hero-dots" role="tablist" aria-label="Slides">{dots}</div>
    </div>
  </section>

  <section class="logos" aria-label="Sectors">
    <div class="container"><h2 class="logos__title">Built for the way these operations actually run</h2></div>
    <div class="logos__viewport"><div class="logos__track js-logo-track"><div class="logos__set">{chips}</div></div></div>
  </section>

  <section class="story">
    <div class="container">
      <h2 class="section-title section-title--center reveal">Three steps. In this order.</h2>
      <p class="section-lead reveal">Most of what goes wrong in a project like this happens before any code is written: the wrong problem gets picked, and nobody finds out for six months.</p>
      <div class="story__grid">
        <article class="story__step reveal"><span class="step__num">01</span><h3>We map how the work moves today</h3><p>A short engagement with the people doing the job: where requests wait, what gets re-typed, and what the delay is costing.</p></article>
        <article class="story__step reveal"><span class="step__num">02</span><h3>We build one system that handles it</h3><p>A working application for that one process, connected to the tools you already run. Not a platform you have to move your company into.</p></article>
        <article class="story__step reveal"><span class="step__num">03</span><h3>You see the numbers before you commit</h3><p>Measured against how the process ran before — hours, errors, response time. The commercial agreement comes after that.</p></article>
      </div>
      <div class="story__more reveal"><a class="btn btn--outline" href="approach.html">See the full engagement</a></div>
    </div>
  </section>

  <section class="paths">
    <div class="container">
      <h2 class="section-title section-title--center reveal">Four capabilities behind the work</h2>
      <p class="section-lead reveal">Whatever the sector, these decide whether a result is trustworthy enough to run on.</p>
      <div class="paths__grid">{caps}</div>
    </div>
  </section>

  <section class="inds">
    <div class="container">
      <h2 class="section-title section-title--center reveal">Start where the work gets stuck</h2>
      <p class="section-lead reveal">The same engineering, pointed at the problems a sector actually has.</p>
      <div class="inds__grid">{ind_cards}</div>
    </div>
  </section>

  <section class="analysts">
    <div class="container">
      <p class="eyebrow eyebrow--center reveal">Selected work</p>
      <h2 class="section-title section-title--center reveal">Engineering you can look at</h2>
      <div class="work-grid work-grid--three">{work}</div>
      <div class="story__more reveal"><a class="btn btn--outline" href="work.html">See all work</a></div>
    </div>
  </section>

  <section class="next-steps">
    <div class="container">
      <h2 class="section-title reveal">Practical thinking, before the build</h2>
      <div class="next-steps__grid">{reads}</div>
    </div>
  </section>
{cta}
</main>
""".format(track=track, dots=dots, chips=chips, caps=caps, ind_cards=ind_cards,
           work=work, reads=reads, cta=cta_band())
    return page("index.html",
                "Custom AI and automation for your operation | Takhaial Tech",
                "Takhaial Tech builds one process properly and connects it to the systems you already use.",
                body, "index.html")


# ------------------------------------------------------------------ services

def build_services():
    jump = "".join(
        '<a class="jump__link" href="#%s">%s</a>' % (s["slug"], e(s["name"]))
        for s in C["services"])

    blocks = ""
    for gi, (group, slugs) in enumerate(SERVICE_GROUPS):
        blocks += '\n  <section class="group"><div class="container"><p class="group__label">%s</p></div></section>' % e(group)
        for slug in slugs:
            s = SERVICES.get(slug)
            if not s:
                continue
            examples = "".join("<li>%s</li>" % e(x) for x in s.get("examples", []))
            delivers = "".join("<li>%s</li>" % e(x) for x in s.get("deliverables", []))
            steps = "".join(
                '<li><span>%02d</span>%s</li>' % (i + 1, e(x))
                for i, x in enumerate(s.get("steps", [])))
            blocks += """
  <section class="svc" id="{slug}">
    <div class="container svc__inner">
      <div class="svc__head">
        <h2>{name}</h2>
        <p class="svc__lead">{lead}</p>
        <p class="svc__focus">{focus}</p>
      </div>
      <div class="svc__body">
        <p>{body}</p>
        <div class="svc__cols">
          <div><h3>What it looks like</h3><ul class="ticks">{examples}</ul></div>
          <div><h3>What you get</h3><ul class="ticks">{delivers}</ul></div>
        </div>
        <ol class="steps-inline">{steps}</ol>
      </div>
    </div>
  </section>""".format(slug=s["slug"], name=e(s["name"]), lead=e(s["lead"]),
                       focus=e(s["focus"]), body=e(s["body"]),
                       examples=examples, delivers=delivers, steps=steps)

    body = page_hero(
        "Services", "What we build",
        "Seven things, grouped by the job they do. Most engagements start with one of them and grow only when there is a reason to.",
        '<nav class="jump" aria-label="On this page">%s</nav>' % jump,
    ) + blocks + cta_band(
        title="Not sure which one you need? <em>That is the first conversation.</em>",
        secondary=("See the industries", "industries.html"),
    ) + "\n</main>\n"
    return page("services.html", "Services | Takhaial Tech",
                "AI and workflow automation, assistants, knowledge systems, integration, creative pipelines, XR and real-time 3D.",
                body, "services.html")


# ------------------------------------------------------------------ industries

def build_industries():
    jump = "".join(
        '<a class="jump__link" href="#%s">%s</a>' % (i["slug"], e(i["name"]))
        for i in C["industries"])

    blocks = ""
    for ind in C["industries"]:
        tags = "".join("<li>%s</li>" % e(t) for t in ind["sectors"])
        groups = ""
        for g in ind["groups"]:
            items = "".join("<li>%s</li>" % e(x) for x in g["items"])
            latin = ' <small>%s</small>' % e(g["latin"]) if g.get("latin") else ""
            groups += '<div class="usecase"><h3>%s%s</h3><ul class="ticks">%s</ul></div>' % (
                e(g["title"]), latin, items)
        related = "".join(
            '<a class="arrow-link" href="services.html#%s">%s</a>' % (sl, e(SERVICES[sl]["name"]))
            for sl in ind.get("services", []) if sl in SERVICES)
        blocks += """
  <section class="ind" id="{slug}">
    <div class="container">
      <div class="ind__head">
        <h2>{name}</h2>
        <p class="ind__lead">{lead}</p>
        <ul class="tag-row">{tags}</ul>
      </div>
      <div class="ind__problem">
        <h3>What usually goes wrong</h3>
        <p>{problem}</p>
      </div>
      <div class="usecases">{groups}</div>
      <div class="guardrail">
        <p class="eyebrow">Where the boundary sits</p>
        <p>{guard}</p>
      </div>
      <div class="ind__related">{related}</div>
    </div>
  </section>""".format(slug=ind["slug"], name=e(ind["name"]), lead=e(ind["lead"]),
                       tags=tags, problem=e(ind["problem"]), groups=groups,
                       guard=e(ind["guardrail"]), related=related)

    body = page_hero(
        "Industries", "Start where the work gets stuck",
        "Five sectors, and what we can actually build in each one today. Every section also says where the boundary sits, because a vision system supports a safety process — it does not replace it.",
        '<nav class="jump" aria-label="On this page">%s</nav>' % jump,
    ) + blocks + cta_band(
        title="Your sector is not on this list? <em>Tell us the process.</em>",
        secondary=("See the services", "services.html"),
    ) + "\n</main>\n"
    return page("industries.html", "Industries | Takhaial Tech",
                "What we build for industry and energy, real estate, hospitality, professional services and workforce training.",
                body, "industries.html")


# ------------------------------------------------------------------ work

def build_work():
    order = ["lexus-vr-showroom", "automotive-experience", "lexus-ar-experience",
             "heritage-spatial-experience", "real-estate-vr", "oil-sector-ar",
             "safety-training", "mixed-reality-surgery", "interactive-product-validation",
             "snow-environment", "the-hell-draft", "ai-unity-vr", "3d-to-ai-jaguar",
             "ai-can-fluids"]
    cats = [("XR", "xr"), ("Real-time 3D", "real-time-3d"), ("AI & R&D", "ai-r-d")]
    blocks = ""
    for label, slug in cats:
        items = [s for s in order if s in PROJECTS and PROJECTS[s]["category"] == label]
        if not items:
            continue
        blocks += """
  <section class="work-group" id="{slug}">
    <div class="container">
      <h2 class="section-title reveal">{label}</h2>
      <div class="work-grid">{cards}</div>
    </div>
  </section>""".format(slug=slug, label=e(label),
                       cards="".join(project_card(s) for s in items))

    body = page_hero(
        "Selected work", "Engineering you can look at",
        "Delivered projects, prototypes and research. Press play on any of them — these are the actual films, hosted here.",
        '<nav class="jump" aria-label="On this page">%s</nav>' % "".join(
            '<a class="jump__link" href="#%s">%s</a>' % (sl, e(lb)) for lb, sl in cats),
    ) + blocks + cta_band(
        title="Want something like this <em>for your operation?</em>",
        secondary=("How we work", "approach.html"),
    ) + "\n</main>\n"
    return page("work.html", "Selected work | Takhaial Tech",
                "Virtual showrooms, spatial demonstrations, industrial AR, training research and real-time 3D.",
                body, "work.html")


# ------------------------------------------------------------------ approach

def build_approach():
    steps = "".join(
        """<article class="step reveal">
             <span class="step__num">{n:02d}</span>
             <h3>{t}</h3>
             <p>{b}</p>
           </article>""".format(n=i + 1, t=e(t), b=e(b))
        for i, (t, b) in enumerate(C["engagement"]["steps"]))

    principles = "".join(
        """<article class="principle reveal"><h3>{t}</h3><p>{b}</p></article>""".format(
            t=e(t), b=e(b)) for t, b in C["engagement"]["principles"])

    build_stages = [
        ("Discover", "Map the current workflow, owners, tools and constraints. Identify one opportunity worth testing.", "An opportunity brief and a clear scope."),
        ("Prototype", "Build a focused version using representative inputs. Make the important interactions and risks visible early.", "A working prototype to review."),
        ("Connect", "Integrate the approved knowledge, systems and interfaces. Design access, review and exception paths.", "An end-to-end workflow."),
        ("Validate", "Check normal cases, missing information, failures and handover against agreed acceptance criteria.", "Evidence for the release decision."),
        ("Hand over & improve", "Document how the system works, who owns it and how to maintain it. Real feedback decides what comes next.", "A usable system and an improvement plan."),
    ]
    stages = "".join(
        """<div class="stage reveal">
             <span>{n:02d}</span>
             <h3>{t}</h3>
             <div><p>{b}</p><small>YOU LEAVE WITH</small><p>{o}</p></div>
           </div>""".format(n=i + 1, t=e(t), b=e(b), o=e(o))
        for i, (t, b, o) in enumerate(build_stages))

    starts = "".join(
        """<article class="start-card reveal">
             <h3>{name}</h3>
             <p>{lead}</p>
             <ol class="flow">{flow}</ol>
           </article>""".format(
            name=e(s["name"]), lead=e(s["lead"]),
            flow="".join("<li>%s</li>" % e(f) for f in s["flow"]))
        for s in C["solutions"])

    body = page_hero(
        "How we work", "Proof first. Then a commitment.",
        "A transformation programme is an expensive way to discover you picked the wrong problem. We would rather find the problem, build one answer to it, and let the result make the argument.",
    ) + """
  <section class="blueprint steps-band" id="engagement">
    <div class="container">
      <h2 class="section-title section-title--light section-title--center reveal">The engagement, in order</h2>
      <div class="steps">{steps}</div>
    </div>
  </section>

  <section class="principles-band" id="terms">
    <div class="container">
      <h2 class="section-title section-title--center reveal">Priced against use, not against hope</h2>
      <p class="section-lead reveal">Software you pay for and never open is the most common waste in this category. These three rules exist to keep that from happening.</p>
      <div class="principles">{principles}</div>
    </div>
  </section>

  <section class="stages" id="build">
    <div class="container">
      <h2 class="section-title reveal">Inside a build</h2>
      <p class="section-lead reveal">Each stage answers a question before the next commitment.</p>
      <div class="stages__list">{stages}</div>
    </div>
  </section>

  <section class="starts">
    <div class="container">
      <h2 class="section-title section-title--center reveal">Three opportunities worth checking first</h2>
      <div class="starts__grid">{starts}</div>
    </div>
  </section>
""".format(steps=steps, principles=principles, stages=stages, starts=starts) + cta_band(
        title="Ready to find your first process? <em>Let us look at it.</em>",
        secondary=("See the work", "work.html"),
    ) + "\n</main>\n"
    return page("approach.html", "How we work | Takhaial Tech",
                "Find the problem, build one focused proof, measure it on your operation, then agree the commercial terms.",
                body, "approach.html")


# ------------------------------------------------------------------ insights

def build_insights():
    blocks = ""
    for a in C["articles"]:
        sections = "".join(
            "<h3>%s</h3><p>%s</p>" % (e(t), e(b)) for t, b in a["sections"])
        blocks += """
  <article class="post" id="{slug}">
    <div class="container post__inner">
      <header class="post__head">
        <p class="eyebrow">Article</p>
        <h2>{title}</h2>
        <p class="post__lead">{summary}</p>
      </header>
      <div class="post__body">{sections}</div>
    </div>
  </article>""".format(slug=a["slug"], title=e(a["title"].rstrip(".")),
                       summary=e(a["summary"]), sections=sections)

    jump = "".join('<a class="jump__link" href="#%s">%s</a>' % (a["slug"], e(a["title"].rstrip(".")))
                   for a in C["articles"])
    body = page_hero(
        "Insights", "Practical thinking, before the build",
        "Short pieces on the decisions that decide whether an automation project is worth starting.",
        '<nav class="jump" aria-label="On this page">%s</nav>' % jump,
    ) + blocks + cta_band(
        title="Have a process in mind? <em>Let us look at it together.</em>",
        secondary=("How we work", "approach.html"),
    ) + "\n</main>\n"
    return page("insights.html", "Insights | Takhaial Tech",
                "How to choose your first automation, why an AI agent needs boundaries, and where AI and immersive technology meet.",
                body, "insights.html")


# ------------------------------------------------------------------ about

def build_about():
    # The story before the current focus, from the 2024 brand profile. The
    # immersive years are not a former life — they are the engineering base the
    # automation work stands on, so the timeline runs straight into it.
    milestones = [
        ("2015", "The idea is conceived",
         "Founded as General Senses, one of the first studios in the region built specifically around virtual and augmented reality."),
        ("2016", "First institutional work",
         "Projects delivered for the Ministry of Interior, KIB and Alargan establish the practice."),
        ("2017", "Startup of the Year",
         "Named Kuwait Startup of the Year by SeedStars. The first commercial real-estate VR and AR work follows, in France and Belgium."),
        ("2018", "General Senses becomes Takhaial",
         "A management restructure and a joint venture with the technology company Alboum turn the studio into the Takhaial Tech brand."),
        ("2019", "Automotive and government",
         "Partnerships with Jaguar and with the Government of Kuwait take the work from demonstrations to production programmes."),
        ("2020", "The case makes itself",
         "Covid closes showrooms and training floors. Remote, immersive alternatives stop being a novelty and start being infrastructure."),
        ("2022", "Automotive at scale",
         "Work with Lexus and NDG, and agreements with the German University in Cairo and the Galala International University."),
        ("2024", "Spatial computing arrives",
         "An Apple Vision Pro development kit puts the team on the platform before most of the market can build for it."),
        ("Today", "AI leads, engineering carries",
         "AI and automation are what we sell. The real-time and spatial engineering underneath is what lets us build the parts other teams configure around."),
    ]
    timeline = "".join(
        """<li class="milestone reveal">
             <span class="milestone__year">{y}</span>
             <div><h3>{t}</h3><p>{b}</p></div>
           </li>""".format(y=e(y), t=e(t), b=e(b))
        for y, t, b in milestones)

    offices = [
        ("New Cairo", "5th Settlement", "+20 155 618 3995"),
        ("Alexandria", "Mostafa Kamel", "+20 103 393 0216"),
        ("Hawally, Kuwait", "Alrehab Mall", "+965 9974 3375"),
        ("Dubai", "Business Bay", "+971 50 282 7035"),
    ]
    office_cards = "".join(
        """<article class="office reveal">
             <h3>{city}</h3>
             <p class="office__where">{where}</p>
             <a class="office__tel" href="tel:{tel_raw}">{tel}</a>
           </article>""".format(city=e(c), where=e(w), tel=e(t), tel_raw=t.replace(" ", ""))
        for c, w, t in offices)

    body = page_hero(
        "About Takhaial", "Ten years of building things people step into",
        "Takhaial Tech started in 2015 as a virtual and augmented reality studio. The immersive work never stopped — it became the engineering foundation for what we build now.",
    ) + """
  <section class="prose">
    <div class="container prose__grid">
      <h2 class="reveal">New focus.<br>Real foundations.</h2>
      <div class="reveal">
        <p>We have spent a decade on interactive applications, immersive experiences and real-time visual systems — the kind of work where people, software, content and the physical environment all have to be considered at once.</p>
        <p>We bring that same approach to AI and automation: understand the task, connect the right tools, design for the person using them, and verify the result. It is the same discipline pointed at a different problem.</p>
      </div>
    </div>
  </section>

  <section class="timeline">
    <div class="container">
      <h2 class="section-title section-title--center reveal">How we got here</h2>
      <p class="section-lead reveal">Nine points on a ten-year line, from a regional VR studio to an AI and automation practice.</p>
      <ol class="timeline__list">{timeline}</ol>
    </div>
  </section>

  <section class="blueprint band-dark">
    <div class="container prose__grid prose__grid--dark">
      <div class="reveal">
        <p class="eyebrow">Where we are going</p>
        <h2 class="section-title section-title--light">Automation first.<br>More possibilities ahead.</h2>
      </div>
      <div class="reveal">
        <p>We focus on workflows that help teams handle information, requests and decisions. XR and other emerging technologies stay part of our longer-term direction wherever they add practical value — and in training, inspection and product work, they often do.</p>
        <p>We do not start with a technology and search for a reason to use it. We start with the work.</p>
        <a class="btn btn--white" href="services.html">Explore our capabilities</a>
      </div>
    </div>
  </section>

  <section class="facts">
    <div class="container">
      <h2 class="section-title section-title--center reveal">What that means in practice</h2>
      <div class="facts__grid">
        <article class="fact reveal"><h3>One process at a time</h3><p>We do not sell a platform migration. We build the system that removes one specific bottleneck and connect it to what you already run.</p></article>
        <article class="fact reveal"><h3>Boundaries written down first</h3><p>What a system may know, what it may do, and when it must hand over to a person are decided before it ships, not after.</p></article>
        <article class="fact reveal"><h3>Engineering you can inspect</h3><p>Real-time software and immersive systems are where we came from. When a problem needs something built rather than configured, that is the part we do not outsource.</p></article>
      </div>
    </div>
  </section>

  <section class="offices">
    <div class="container">
      <h2 class="section-title reveal">Where we are</h2>
      <p class="section-lead section-lead--left reveal">Four offices across Egypt, Kuwait and the UAE.</p>
      <div class="offices__grid">{offices}</div>
    </div>
  </section>
""".format(timeline=timeline, offices=office_cards) + cta_band(
        secondary=("See the work", "work.html")) + "\n</main>\n"
    return page("about.html", "About Takhaial Tech",
                "Takhaial Tech started in 2015 as a virtual and augmented reality studio and now builds custom AI and automation on that engineering foundation.",
                body, "about.html")


# ------------------------------------------------------------------ contact

def build_contact():
    body = page_hero(
        "Contact", "Start with one process",
        "Tell us what the work looks like today. If there is something worth building, we will say so — and if there is not, we will say that too.",
    ) + """
  <section class="contact">
    <div class="container contact__grid">
      <form class="contact__form" novalidate>
        <div class="field">
          <label for="name">Your name</label>
          <input id="name" name="name" type="text" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="company">Company</label>
          <input id="company" name="company" type="text" autocomplete="organization">
        </div>
        <div class="field">
          <label for="email">Work email</label>
          <input id="email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="field">
          <label for="sector">Sector</label>
          <select id="sector" name="sector">
            <option value="">Choose one</option>
            {options}
            <option>Something else</option>
          </select>
        </div>
        <div class="field field--wide">
          <label for="message">What happens today?</label>
          <textarea id="message" name="message" rows="6" placeholder="Where the work waits, who repeats what, and what it costs when it is late." required></textarea>
        </div>
        <div class="field field--wide">
          <button class="btn btn--primary" type="submit">Send it over</button>
          <p class="contact__note js-form-note" role="status">This opens your mail app with the details filled in, addressed to <a href="mailto:{mail}">{mail}</a>.</p>
        </div>
      </form>

      <aside class="contact__aside">
        <h2>Direct</h2>
        <p><a class="contact__big" href="mailto:{mail}">{mail}</a></p>
        <p><a class="arrow-link" href="{li}" target="_blank" rel="noreferrer">Takhaial Tech on LinkedIn</a></p>

        <h3>What happens next</h3>
        <ol class="flow">
          <li>We read it and reply with whether there is something here worth a call.</li>
          <li>A short call about how the work runs today — not a pitch.</li>
          <li>If it looks buildable, we scope one process and put numbers to it.</li>
        </ol>

        <h3>What we will ask for</h3>
        <ul class="ticks">
          <li>Who owns the process today</li>
          <li>What starts it and what finishes it</li>
          <li>Which systems already hold the data</li>
          <li>What it costs when it is slow</li>
        </ul>
      </aside>
    </div>
  </section>
""".format(mail=EMAIL, li=LINKEDIN,
           options="".join("<option>%s</option>" % e(i["name"]) for i in C["industries"])) + "\n</main>\n"
    return page("contact.html", "Contact | Takhaial Tech",
                "Tell us what the work looks like today and we will tell you whether there is something worth building.",
                body, "contact.html")


# ------------------------------------------------------------------ privacy

def build_privacy():
    body = page_hero(
        "Privacy & terms", "A clear view of your information",
        "This is a short, plain statement of what this site does with what you send it.",
    ) + """
  <section class="prose prose--single">
    <div class="container">
      <h2>What this site collects</h2>
      <p>Nothing automatically. There is no analytics script, no advertising pixel and no third-party tracker on these pages. Fonts and media are served from this site rather than a content network, so no request leaves it as you browse.</p>

      <h2>What you send us</h2>
      <p>If you use the contact form or write to us directly, we keep your message and your contact details for as long as it takes to answer you and to carry out any work that follows. We do not sell it, and we do not add you to a mailing list you did not ask for.</p>

      <h2>Your material during a project</h2>
      <p>Documents, recordings and operational data shared with us during an engagement stay yours. We hold only what a build needs, we agree access boundaries in writing before we start, and we return or delete the material when the work ends.</p>

      <h2 id="terms">Terms of use</h2>
      <p>The text, imagery and film on this site describe our own work and remain ours. Project descriptions are accounts of what was built; they are not offers, and nothing here is a guarantee of a particular result in a different operation.</p>
      <p>Where a page describes a capability — vision systems, assistants, predictive models — it describes what we can build, not a claim of certification. Deployment in a regulated environment needs its own domain review.</p>

      <h2>Getting in touch</h2>
      <p>Questions about any of this go to <a href="mailto:{mail}">{mail}</a>.</p>
    </div>
  </section>
""".format(mail=EMAIL) + cta_band(secondary=("Back to home", "index.html")) + "\n</main>\n"
    return page("privacy.html", "Privacy & terms | Takhaial Tech",
                "What this site collects, what happens to what you send us, and how project material is handled.",
                body, "privacy.html")


# privacy.html is not built: the live domain already serves reviewed legal
# pages at /privacy-policy and /terms-of-service, and the footer links there.
BUILDERS = [build_home, build_services, build_industries, build_work,
            build_approach, build_insights, build_about, build_contact]
