#!/usr/bin/env python3
"""Final premium polish: hero/about, CSS luxury, expanded media archive."""
from pathlib import Path
from urllib.parse import quote, unquote
import re

ROOT = Path(".")
BASE = ROOT / "assets" / "images copy"
HTML_PATH = ROOT / "index.html"

def media(*parts: str) -> str:
    return "/".join(quote(p, safe=".-_~") for p in ("assets", "images copy", *parts))

def list_media(folder: str, exts, limit=None, min_kb=80):
    d = BASE / folder
    files = [
        f for f in d.iterdir()
        if f.is_file()
        and not f.name.startswith("._")
        and f.suffix.lower() in exts
        and f.stat().st_size >= min_kb * 1024
    ]
    files.sort(key=lambda f: (-f.stat().st_size, f.name.lower()))
    if limit:
        files = files[:limit]
    return files

html = HTML_PATH.read_text(encoding="utf-8")

# ---------------------------------------------------------------------------
# 1) Hero → cinematic drone field ops (10785)
# About → Tuskegee step-and-repeat portrait
# ---------------------------------------------------------------------------
html = html.replace(
    'src="assets/images%20copy/03_Robotics/IMG_1936.JPG" alt="AI Farms multi-robot field deployment with quadruped robot, drone, and autonomous rovers at Tuskegee University" width="2400" height="1600" fetchpriority="high"',
    f'src="{media("02_AI_Farms_Research", "10785.jpg")}" alt="Cameron Jones operating an autonomous agricultural drone during AI Farms field research at Tuskegee University" width="2000" height="2800" fetchpriority="high"'
)

html = html.replace(
    "object-position:center 55%;\n  transform:scale(1.06);animation:heroKen 20s var(--ease) forwards;",
    "object-position:center 32%;\n  transform:scale(1.05);animation:heroKen 22s var(--ease) forwards;"
)

html = html.replace(
    'src="assets/images%20copy/01_Hero/IMG_3211.JPG" alt="Cameron Jones professional headshot in navy polo" width="1200" height="1500" loading="lazy"',
    f'src="{media("01_Hero", "Screenshot 2025-09-11 at 13.40.26.jpeg")}" alt="Cameron Jones professional portrait in front of Tuskegee University step-and-repeat backdrop" width="1200" height="1500" loading="lazy"'
)

html = html.replace(
    "object-position:center 12%;",
    "object-position:center 18%;",
    1,  # about image only - careful: might hit research too
)

# Fix about specifically - the about-frame rule
html = html.replace(
    ".about-frame img{\n  width:100%;height:clamp(380px,52vw,620px);object-fit:cover;object-position:center 18%;",
    ".about-frame img{\n  width:100%;height:clamp(420px,54vw,640px);object-fit:cover;object-position:center 15%;"
)

# ---------------------------------------------------------------------------
# 2) Premium CSS injection before </style>
# ---------------------------------------------------------------------------
POLISH_CSS = r'''
/* ===== QFilmz-inspired premium polish ===== */
:root{
  --glow: 0 0 40px rgba(201,168,76,.08);
  --glow-strong: 0 0 48px rgba(201,168,76,.16);
  --glass: rgba(28,24,18,.72);
}
body{
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(201,168,76,.07), transparent 55%),
    radial-gradient(900px 500px at 90% 20%, rgba(201,168,76,.04), transparent 50%),
    var(--bg);
}
.inner, .about-grid, .bento, .lead-layout, .corp-strip, .research-grid, .story-strip, .research-feature, .beyond-grid, .roots-layout, .honors-grid, .contact-layout, .timeline, .archive-masonry, .video-grid{
  width:100%;
}
.section-header{margin-bottom:clamp(2.8rem,6vw,4.8rem)}
.section-title{letter-spacing:.04em}
.section-subtitle{max-width:560px;line-height:1.85}

/* Luxury cards */
.r-card,.proj,.corp-card,.beyond-card,.honor-card,.story-cell,.tl-item,.archive-item,.video-card{
  background:linear-gradient(180deg, rgba(34,30,22,.92), rgba(22,19,14,.96));
  border:1px solid rgba(201,168,76,.18);
  box-shadow: var(--glow), inset 0 1px 0 rgba(255,255,255,.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.r-card:hover,.proj:hover,.corp-card:hover,.beyond-card:hover,.honor-card:hover,.story-cell:hover,.archive-item:hover,.video-card:hover{
  border-color:rgba(201,168,76,.42);
  box-shadow: var(--glow-strong), 0 24px 60px rgba(0,0,0,.45);
}
.collab-bar,.pull-quote{
  border:1px solid rgba(201,168,76,.22);
  box-shadow: var(--glow);
  background:linear-gradient(135deg, rgba(34,30,22,.95), rgba(20,17,12,.98));
}
.btn-primary{box-shadow:0 0 24px rgba(201,168,76,.18)}
.btn-primary:hover{box-shadow:0 0 36px rgba(201,168,76,.32), 0 14px 36px rgba(201,168,76,.22)}
.btn-ghost{backdrop-filter:blur(8px)}

/* Timeline premium */
.tl-item{
  padding:1.4rem 1.5rem 1.5rem clamp(3.2rem,7vw,4.2rem) !important;
  margin-bottom:1rem;
  border-radius:0;
}
.tl-item::before{z-index:2}

/* Hero identity breathing room */
.hero-content{max-width:760px}
.hero-tagline{max-width:520px;font-size:clamp(1rem,1.7vw,1.15rem)}
.hero-stats{max-width:580px;gap:clamp(1.6rem,4vw,3.2rem)}

/* About frame gold accent */
.about-frame::before{border-color:rgba(201,168,76,.28);box-shadow:var(--glow)}

/* Expanded visual archive */
#archive{padding:var(--pad-y) 0;background:var(--bg2)}
.archive-masonry{
  columns:3;column-gap:1rem;
  max-width:var(--max);margin:0 auto;padding:0 var(--pad-x);
}
.archive-item{
  break-inside:avoid;margin-bottom:1rem;overflow:hidden;
  transition:transform .4s var(--ease), border-color .35s, box-shadow .4s;
}
.archive-item img,.archive-item video{
  width:100%;height:auto;display:block;object-fit:cover;
}
.archive-item figcaption{
  padding:.75rem 1rem;font-family:'DM Mono',monospace;font-size:.55rem;
  letter-spacing:.14em;text-transform:uppercase;color:var(--muted);
}
.archive-cat{
  font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--gold);margin:2.5rem auto 1rem;
  max-width:var(--max);padding:0 var(--pad-x);
}

#reels{padding:var(--pad-y) 0;background:var(--bg)}
.video-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;
  max-width:var(--max);margin:0 auto;padding:0 var(--pad-x);
}
.video-card{overflow:hidden}
.video-card video{width:100%;aspect-ratio:16/10;object-fit:cover;background:#000}
.video-card p{
  padding:.9rem 1.1rem;font-family:'DM Mono',monospace;font-size:.55rem;
  letter-spacing:.14em;text-transform:uppercase;color:var(--muted);
}

@media (max-width:900px){
  .archive-masonry{columns:2}
  .video-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:560px){
  .archive-masonry{columns:1}
  .video-grid{grid-template-columns:1fr}
  .hero-media img{object-position:center 28%}
}
'''

if "QFilmz-inspired premium polish" not in html:
    html = html.replace("</style>", POLISH_CSS + "\n</style>", 1)

# ---------------------------------------------------------------------------
# 3) Expand horizontal gallery with more slides
# ---------------------------------------------------------------------------
extra_gallery = []
gallery_picks = [
    ("03_Robotics", "IMG_6667.JPG", "Robot Dog — Field Research"),
    ("03_Robotics", "IMG_6658.JPG", "Robot Dog Operations"),
    ("03_Robotics", "IMG_6659.JPG", "Robotics Demonstration"),
    ("03_Robotics", "IMG_0073.JPG", "Quadruped Platform"),
    ("03_Robotics", "IMG_4364.JPG", "Autonomous Rovers"),
    ("03_Robotics", "IMG_3171.JPG", "Team Hardware Systems"),
    ("02_AI_Farms_Research", "10785.jpg", "Drone Field Operations"),
    ("02_AI_Farms_Research", "10784.jpg", "Precision Field Science"),
    ("02_AI_Farms_Research", "2104941407774967754.jpg", "Lab Robotics"),
    ("02_AI_Farms_Research", "IMG_3363.JPG", "Crop Sensing"),
    ("06_Projects", "IMG_0362.JPEG", "AuburnHacks Team"),
    ("06_Projects", "IMG_2574.JPEG", "UIUC Hackathon"),
    ("06_Projects", "IMG_2725.JPEG", "Hardware Build Process"),
    ("06_Projects", "IMG_8100.jpeg", "Custom Systems"),
    ("04_Leadership_Community", "IMG_6284.jpeg", "Community Leadership"),
    ("04_Leadership_Community", "IMG_0062.JPG", "STEM Outreach"),
    ("04_Leadership_Community", "IMG_0055.JPG", "Workshop Engagement"),
    ("05_Industry_Corporate", "6905568674245338.jpg", "Industry Engagement"),
    ("05_Industry_Corporate", "20250425_Tuskegee CROPPS visit-9798.jpeg", "CROPPS Collaboration"),
    ("09_Tuskegee_Legacy", "IMG_0596.PNG", "Tuskegee Legacy"),
    ("09_Tuskegee_Legacy", "IMG_8958.JPEG", "Campus Pride"),
    ("07_Hobbies_and_Passions", "IMG_8504.JPG", "Beyond the Lab"),
    ("08_Beyond_The_Lab", "IMG_3250.JPG", "Cinematic Moment"),
    ("08_Beyond_The_Lab", "IMG_3635.JPG", "Personal Story"),
    ("10_Honors_Achievements", "IMG_3207.JPEG", "Honor Recognition"),
]

# Keep existing gallery track content but append unique new slides before closing track
existing_srcs = set(re.findall(r'src="([^"]+)"', html))
append_slides = []
for folder, name, cap in gallery_picks:
    src = media(folder, name)
    if src in existing_srcs:
        continue
    if not (BASE / folder / name).exists():
        continue
    append_slides.append(
        f'      <figure class="gallery-slide"><img src="{src}" alt="{cap}" loading="lazy"><figcaption>{cap}</figcaption></figure>'
    )

if append_slides:
    html = html.replace(
        '    </div>\n  </div>\n  <div class="gallery-controls">',
        "\n".join(append_slides) + "\n    </div>\n  </div>\n  <div class=\"gallery-controls\">",
        1,
    )

# ---------------------------------------------------------------------------
# 4) Build Visual Archive + Video Reel sections (most media)
# ---------------------------------------------------------------------------
categories = [
    ("02_AI_Farms_Research", "AI Farms Research", 12, None),
    ("03_Robotics", "Robotics", 12, None),
    ("04_Leadership_Community", "Leadership & Community", 16, None),
    ("05_Industry_Corporate", "Industry & Corporate", 16, None),
    ("06_Projects", "Projects & Builds", 18, None),
    ("07_Hobbies_and_Passions", "Hobbies & Passions", 7, 50),
    ("08_Beyond_The_Lab", "Beyond the Lab", 36, 100),
    ("09_Tuskegee_Legacy", "Tuskegee Legacy", 14, 50),
    ("10_Honors_Achievements", "Honors & Achievements", 5, 40),
]

archive_parts = [
    '''
<section id="archive">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Visual Archive</div>
    <h2 class="section-title">Every Frame,<br><em>Intentional.</em></h2>
    <p class="section-subtitle">A fuller look at the research, robotics, leadership, and life behind the work.</p>
  </div>
'''
]

used_in_archive = set()
for folder, label, limit, min_kb in categories:
    stills = list_media(folder, {".jpg", ".jpeg", ".png", ".webp"}, limit=limit, min_kb=min_kb or 80)
    if not stills:
        continue
    archive_parts.append(f'  <div class="archive-cat reveal">{label}</div>')
    archive_parts.append('  <div class="archive-masonry">')
    for f in stills:
        src = media(folder, f.name)
        used_in_archive.add(src)
        alt = f"{label}: {f.stem.replace('_', ' ')}"
        archive_parts.append(
            f'    <figure class="archive-item reveal"><img src="{src}" alt="{alt}" loading="lazy"></figure>'
        )
    archive_parts.append("  </div>")

archive_parts.append("</section>\n")
ARCHIVE_HTML = "\n".join(archive_parts)

# Videos from key folders
video_folders = [
    ("02_AI_Farms_Research", "AI Farms Field Capture"),
    ("03_Robotics", "Robotics in Motion"),
    ("04_Leadership_Community", "Leadership Moments"),
    ("06_Projects", "Projects & Builds"),
    ("08_Beyond_The_Lab", "Life Beyond the Lab"),
]
video_cards = []
for folder, label in video_folders:
    vids = list_media(folder, {".mp4", ".mov"}, limit=2, min_kb=400)
    for i, v in enumerate(vids):
        src = media(folder, v.name)
        video_cards.append(
            f'''    <article class="video-card reveal">
      <video src="{src}" muted playsinline controls preload="metadata" poster=""></video>
      <p>{label}</p>
    </article>'''
        )

REELS_HTML = f'''
<section id="reels">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Motion</div>
    <h2 class="section-title">In <em>Motion.</em></h2>
    <p class="section-subtitle">Field deployments, demos, and moments that still photos can\'t fully hold.</p>
  </div>
  <div class="video-grid">
{chr(10).join(video_cards)}
  </div>
</section>
'''

if 'id="archive"' not in html:
    html = html.replace('<section id="journey">', ARCHIVE_HTML + "\n" + REELS_HTML + "\n<section id=\"journey\">", 1)

# Nav links for archive
if 'href="#archive"' not in html:
    html = html.replace(
        '<li><a href="#beyond">Beyond</a></li>',
        '<li><a href="#archive">Archive</a></li>\n    <li><a href="#beyond">Beyond</a></li>',
        1,
    )

# Expand beyond grid with more hobby/beyond images
beyond_extra = list_media("08_Beyond_The_Lab", {".jpg", ".jpeg", ".png"}, limit=8, min_kb=500)
hobby_extra = list_media("07_Hobbies_and_Passions", {".jpg", ".jpeg", ".png"}, limit=7, min_kb=50)
# Inject additional beyond cards before beyond-note if not already many
if html.count('class="beyond-card"') < 10:
    more_cards = []
    for f in (hobby_extra + beyond_extra)[:6]:
        folder = "07_Hobbies_and_Passions" if f.parent.name == "07_Hobbies_and_Passions" else "08_Beyond_The_Lab"
        src = media(folder, f.name)
        if src in html:
            continue
        more_cards.append(
            f'''    <article class="beyond-card reveal">
      <div class="media"><img src="{src}" alt="Personal photography — {f.stem}" loading="lazy"></div>
      <div class="beyond-caption">Life Beyond Tech</div>
    </article>'''
        )
    if more_cards:
        html = html.replace(
            '  <p class="beyond-note">· Kayaking · Fishing · Photography · More coming soon ·</p>',
            "\n".join(more_cards) + '\n  <p class="beyond-note">· Kayaking · Fishing · Photography · More coming soon ·</p>',
            1,
        )

# Expand roots photos
legacy = list_media("09_Tuskegee_Legacy", {".jpg", ".jpeg", ".png"}, limit=8, min_kb=80)
roots_extra = []
for f in legacy:
    src = media("09_Tuskegee_Legacy", f.name)
    if src in html:
        continue
    roots_extra.append(
        f'      <img src="{src}" alt="Tuskegee legacy and community — {f.stem}" loading="lazy">'
    )
if roots_extra[:4]:
    html = html.replace(
        '    </div>\n  </div>\n</section>\n\n<section id="honors">',
        "\n".join(roots_extra[:4]) + "\n    </div>\n  </div>\n</section>\n\n<section id=\"honors\">",
        1,
    )

# Leadership mosaic — add more photos
lead_imgs = list_media("04_Leadership_Community", {".jpg", ".jpeg", ".png"}, limit=8, min_kb=200)
lead_extra = []
for f in lead_imgs:
    src = media("04_Leadership_Community", f.name)
    if src in html:
        continue
    lead_extra.append(
        f'      <img src="{src}" alt="Leadership and community impact — {f.stem}" loading="lazy">'
    )
if lead_extra[:3]:
    html = html.replace(
        '    </div>\n  </div>\n\n  <div class="industry-header reveal">',
        "\n".join(lead_extra[:3]) + "\n    </div>\n  </div>\n\n  <div class=\"industry-header reveal\">",
        1,
    )

# Resume already synced — ensure download attrs remain
assert html.count('href="resume.pdf"') >= 3

# Verify missing
missing = []
for src in re.findall(r'src="(assets/[^"]+)"', html):
    if not Path(unquote(src)).exists():
        missing.append(src)

HTML_PATH.write_text(html, encoding="utf-8")
print(f"Wrote {HTML_PATH} ({HTML_PATH.stat().st_size:,} bytes)")
print(f"imgs: {html.count('<img')}")
print(f"videos: {html.count('<video')}")
print(f"archive: {'id=\"archive\"' in html}")
print(f"reels: {'id=\"reels\"' in html}")
print(f"missing: {len(missing)}")
for m in missing[:20]:
    print(" ", m)
print(f"hero has 10785: {'10785.jpg' in html}")
print(f"about has Screenshot: {'Screenshot' in html and 'about-frame' in html}")
