# Takhaial Tech — full static site on the pega.com layout

Nine pages, every navigation link live, all media hosted here. Built to be
published: no framework, no runtime dependency, no external request.

## Run it

```bash
python -m http.server 8792 --directory "D:/Vibe Space/Takhaial-PegaLayout"
```

Or the `takhaial-pega` entry in `D:\Vibe Space\.claude\launch.json`. Do not open
the files over `file://` — the relative paths break.

## The pages

| Page | What it does |
| --- | --- |
| `index.html` | The story in order: what we do → who for → the three steps → the four capabilities → the sectors → work → reading → contact |
| `services.html` | All seven services in three named groups, each with what it looks like, what you get, and the steps |
| `industries.html` | Five sectors, each with what goes wrong, the use cases, and where the boundary sits |
| `work.html` | Fourteen projects in three groups, every one with its film playable inline |
| `approach.html` | The engagement, the commercial rules, the five build stages, three places to start |
| `insights.html` | Three articles in full |
| `about.html` | The ten-year story: origin, a nine-point timeline, direction, and the four offices |
| `contact.html` | Form, direct routes, what happens next, what we will ask for |
| `privacy.html` | Privacy and terms, including the `#terms` anchor the footer points at |

Every mega-menu entry resolves to a page or a real anchor on one. There is no
`href="#"` anywhere in the site.

## Editing the copy

The pages are generated so the header, footer and shell stay identical across
all nine:

```bash
python tools/build.py
```

`tools/content.json` holds the words, dumped from the live site's
`src/takhaial/content.js`. `tools/pages.py` holds the page structure. The output
is plain HTML — the site itself still has no build step, and the generator is
only needed when the copy or structure changes.

## Rules this build follows

- **No individual is named.** Every project is presented as the company's work.
  The generator strips personal attribution from the source data, and the audit
  fails if a name reappears.
- **No borrowed identity.** Nothing of Pega's is loaded: not the logo, the
  photography, the icons, the client logos or the analyst marks. The four
  background photo plates became CSS gradients. Only the section geometry and
  the interaction behaviour came from the measured clone.
- **No invented proof.** The original design assumes social proof Takhaial does
  not have, so three sections were repurposed rather than filled with fiction:
  the client logo wall became a sector marquee, the analyst awards became real
  work, and the client testimonials became case descriptions. The capability
  cards dropped the original's headline percentages for the same reason.

## Media

All hosted here — `assets/video` (14 films, 720p web profile, 120 MB) and
`assets/img` (15 posters plus the brand mark). Films use `preload="none"` and
only fetch when someone presses play, so the page costs nothing until then; a
film that scrolls out of view pauses itself.

## Measured

| | Desktop 1440 | Mobile 390 |
| --- | --- | --- |
| Horizontal overflow | none on any page | none on any page |
| Console errors | none | none |
| Failed requests | none | none |
| Video bytes before a click | 0 | 0 |

Page heights at 1440: home 5,238 · services 5,422 · industries 6,180 ·
work 6,892 · approach 4,226 · insights 3,771 · about 2,483 · contact 1,717.

## From the 2024 brand profile

`about.html` merges history taken from `A:\Takhaial\Pres\Brand Profile.pdf`:
founded 2015 as General Senses, early institutional work, SeedStars Kuwait
Startup of the Year 2017, the rebrand and Alboum joint venture, the automotive
and government partnerships, the Apple Vision Pro development kit, and the four
offices. The timeline ends on the present focus, so the immersive decade reads
as the foundation for the automation work rather than a previous life.

**Three things there need confirming before this is public:**

1. **Client names.** Jaguar, Lexus, the Ministry of Interior, KIB, Alargan, NDG,
   GUC and GIU appear in the timeline because the company published them in its
   own brand profile. Confirm each is still cleared for use.
2. **Offices and numbers.** Taken from the 2024 profile. Only the Alexandria
   number matches what the live site uses today.
3. **Head office.** The profile says Kuwait; the site's contact details are
   Egyptian. The page avoids naming a head office for that reason.

## Before this goes public

- `noindex, nofollow` is set in every page head. Remove it when the domain is
  decided.
- The contact form has no mailbox behind it and says so on the page. Wire it to
  a real endpoint before launch.
- Add a favicon set and an OG image if this replaces the current site.
