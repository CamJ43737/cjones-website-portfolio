#!/usr/bin/env python3
"""Surgical elevation of existing portfolio — no full rebuild."""
from pathlib import Path
from urllib.parse import quote

def media(*parts: str) -> str:
    return "/".join(quote(p, safe=".-_~") for p in ("assets", "images copy", *parts))

path = Path("index.html")
html = path.read_text(encoding="utf-8")

# ---------------------------------------------------------------------------
# 1) Fix encoding / mojibake remnants
# ---------------------------------------------------------------------------
replacements = {
    "2Ã— Hackathon Champion": "2× Hackathon Champion",
    "2Ã\u0097 Hackathon Champion": "2× Hackathon Champion",
}
for a, b in replacements.items():
    html = html.replace(a, b)

# Fix broken contact icons — replace whole contact-info blocks icons
ICON_MAIL = '''<svg class="ci-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>'''
ICON_LINK = '''<svg class="ci-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM5 5v14h14v-7h-2v5H7V7h5V5H5z"/></svg>'''
ICON_CODE = '''<svg class="ci-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>'''
ICON_DL = '''<svg class="ci-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>'''
ICON_PIN = '''<svg class="ci-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>'''

# Replace any mojibake icon div contents by matching contact-info-item order
import re

def replace_icon_in_item(html_text, label, svg):
    # Find the contact-info-item that contains this label and replace its icon div
    pattern = rf'(<div class="contact-info-item">\s*<div class="contact-info-icon">)(.*?)(</div>\s*<div>\s*<div class="contact-info-label">{label}</div>)'
    return re.sub(pattern, rf'\1{svg}\3', html_text, count=1, flags=re.DOTALL)

html = replace_icon_in_item(html, "Email", ICON_MAIL)
html = replace_icon_in_item(html, "LinkedIn", ICON_LINK)
html = replace_icon_in_item(html, "GitHub", ICON_CODE)
html = replace_icon_in_item(html, "Resume", ICON_DL)
html = replace_icon_in_item(html, "Based At", ICON_PIN)

# Also nuke leftover mojibake sequences in icon area if any remain
html = re.sub(r'<div class="contact-info-icon">[^<]*(?:â|ð)[^<]*</div>', 
              lambda m: m.group(0), html)  # no-op safety

# ---------------------------------------------------------------------------
# 2) Hero — cinematic engineering image (multi-robot fleet)
# ---------------------------------------------------------------------------
old_hero_img = '''  <div class="hero-media">
    <img src="assets/images%20copy/01_Hero/Screenshot%202025-09-11%20at%2013.40.26.jpeg" alt="Cameron Jones, AI researcher at Tuskegee University, professional portrait" width="1600" height="2000" fetchpriority="high">
  </div>
  <div class="hero-content">
    <div class="hero-eyebrow">Tuskegee University · AI Farms Initiative</div>
    <h1 class="hero-name">Cameron<br><span>Jones</span></h1>
    <p class="hero-tagline">AI Researcher. Roboticist. Precision Agriculture Innovator. Building technology at the intersection of artificial intelligence, autonomous systems, and the future of food.</p>
    <div class="hero-cta-row">
      <a href="#research" class="btn btn-primary">View Research</a>
      <a href="resume.pdf" class="btn btn-ghost" download="Cameron_Jones_Resume.pdf">Download Resume</a>
    </div>'''

new_hero_img = f'''  <div class="hero-media">
    <img src="{media('03_Robotics', 'IMG_1936.JPG')}" alt="AI Farms multi-robot field deployment with quadruped robot, drone, and autonomous rovers at Tuskegee University" width="2400" height="1600" fetchpriority="high">
  </div>
  <div class="hero-content">
    <div class="hero-eyebrow">Tuskegee University · AI Farms Initiative</div>
    <h1 class="hero-name">Cameron<br><span>Jones</span></h1>
    <p class="hero-identity">AI · Robotics · Real-World Research</p>
    <p class="hero-tagline">AI Researcher. Roboticist. Precision Agriculture Innovator. Building technology at the intersection of artificial intelligence, autonomous systems, and the future of food.</p>
    <div class="hero-cta-row">
      <a href="#research" class="btn btn-primary">View Research</a>
      <a href="resume.pdf" class="btn btn-ghost" download="Cameron_Jones_Resume.pdf">Download Resume</a>
      <a href="#journey" class="btn btn-ghost">My Journey</a>
    </div>'''

if old_hero_img not in html:
    raise SystemExit("Hero block not found for replacement")
html = html.replace(old_hero_img, new_hero_img, 1)

# Update hero CSS object-position for landscape engineering shot
html = html.replace(
    ".hero-media img{\n  width:100%;height:100%;object-fit:cover;object-position:center 18%;\n  transform:scale(1.04);animation:heroKen 18s var(--ease) forwards;\n}",
    ".hero-media img{\n  width:100%;height:100%;object-fit:cover;object-position:center 55%;\n  transform:scale(1.06);animation:heroKen 20s var(--ease) forwards;\n}"
)
# Fix if minified differently
html = html.replace(
    "object-position:center 18%;\n  transform:scale(1.04);animation:heroKen 18s",
    "object-position:center 55%;\n  transform:scale(1.06);animation:heroKen 20s"
)

# Stronger hero gradient for landscape photos
html = html.replace(
    """background:
    linear-gradient(90deg,rgba(10,9,6,.92) 0%,rgba(10,9,6,.55) 42%,rgba(10,9,6,.25) 70%,rgba(10,9,6,.45) 100%),
    linear-gradient(0deg,rgba(10,9,6,.95) 0%,rgba(10,9,6,.2) 42%,transparent 70%);""",
    """background:
    linear-gradient(90deg,rgba(10,9,6,.94) 0%,rgba(10,9,6,.72) 38%,rgba(10,9,6,.35) 68%,rgba(10,9,6,.55) 100%),
    linear-gradient(0deg,rgba(10,9,6,.96) 0%,rgba(10,9,6,.45) 38%,rgba(10,9,6,.15) 65%,transparent 82%);"""
)

# ---------------------------------------------------------------------------
# 3) Inject CSS for new components before </style>
# ---------------------------------------------------------------------------
EXTRA_CSS = '''
/* Hero identity line */
.hero-identity{
  font-family:'DM Mono',monospace;font-size:clamp(.72rem,1.2vw,.85rem);
  letter-spacing:.28em;text-transform:uppercase;color:var(--gold-light);
  margin:-.4rem 0 1.35rem;
}
.ci-svg{width:1.15rem;height:1.15rem;display:block}

/* Research story strip */
.story-strip{
  display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;
  max-width:var(--max);margin:clamp(2rem,4vw,3.2rem) auto 0;padding:0 var(--pad-x);
}
.story-cell{
  padding:1.4rem 1.35rem;background:var(--card);border:.5px solid var(--border);
  transition:border-color .35s,transform .35s var(--ease);
}
.story-cell:hover{border-color:var(--border-strong);transform:translateY(-3px)}
.story-label{
  font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--gold);margin-bottom:.55rem;
}
.story-cell p{font-size:.88rem;color:var(--off);line-height:1.7}

/* Research editorial feature */
.research-feature{
  display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(1.5rem,4vw,3rem);
  max-width:var(--max);margin:clamp(2.2rem,5vw,3.5rem) auto;padding:0 var(--pad-x);
  align-items:center;
}
.research-feature img{
  width:100%;height:clamp(260px,40vw,420px);object-fit:cover;border:.5px solid var(--border);
}
.research-feature h3{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(1.8rem,3vw,2.6rem);
  line-height:1.05;margin-bottom:.8rem;letter-spacing:.02em;
}
.research-feature h3 span{color:var(--gold)}
.research-feature p{color:var(--muted);font-size:.92rem;line-height:1.8;margin-bottom:1rem}

/* Project tech chips */
.proj-tech{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.85rem}
.proj-tech span{
  font-family:'DM Mono',monospace;font-size:.52rem;letter-spacing:.12em;text-transform:uppercase;
  padding:.28rem .55rem;border:.5px solid var(--border);color:var(--muted);
}

/* Industry header */
.industry-header{padding:0 var(--pad-x);margin:clamp(2.5rem,5vw,3.5rem) auto 1.2rem;max-width:var(--max)}
.industry-header .section-title{font-size:clamp(2rem,3.5vw,2.8rem);text-align:left}

/* Journey timeline */
#journey{padding:var(--pad-y) 0;background:var(--bg)}
.timeline{
  max-width:820px;margin:0 auto;padding:0 var(--pad-x);
  position:relative;
}
.timeline::before{
  content:'';position:absolute;left:clamp(1.1rem,4vw,1.55rem);top:0;bottom:0;width:1px;
  background:linear-gradient(180deg,transparent,var(--border-strong),transparent);
}
.tl-item{
  position:relative;padding:0 0 clamp(2.2rem,4vw,3rem) clamp(3.2rem,7vw,4.2rem);
  opacity:0;transform:translateY(24px);
  transition:opacity .8s var(--ease),transform .8s var(--ease);
}
.tl-item.visible{opacity:1;transform:none}
.tl-item::before{
  content:'';position:absolute;left:clamp(.85rem,3.6vw,1.3rem);top:.35rem;
  width:.55rem;height:.55rem;border-radius:50%;
  background:var(--gold);box-shadow:0 0 0 4px rgba(201,168,76,.15);
}
.tl-year{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,3vw,2.6rem);
  color:var(--gold);line-height:1;margin-bottom:.35rem;
}
.tl-title{font-size:1.05rem;font-weight:500;margin-bottom:.45rem;color:var(--white)}
.tl-body{font-size:.9rem;color:var(--muted);line-height:1.75}
.tl-body li{margin-left:1.1rem;margin-bottom:.25rem}

@media (max-width:900px){
  .story-strip{grid-template-columns:1fr 1fr}
  .research-feature{grid-template-columns:1fr}
}
@media (max-width:520px){
  .story-strip{grid-template-columns:1fr}
}
'''

if EXTRA_CSS not in html:
    html = html.replace("</style>", EXTRA_CSS + "\n</style>", 1)

# ---------------------------------------------------------------------------
# 4) Nav — add Journey
# ---------------------------------------------------------------------------
html = html.replace(
    '''    <li><a href="#leadership">Leadership</a></li>
    <li><a href="#beyond">Beyond</a></li>''',
    '''    <li><a href="#leadership">Leadership</a></li>
    <li><a href="#journey">Journey</a></li>
    <li><a href="#beyond">Beyond</a></li>'''
)

# ---------------------------------------------------------------------------
# 5) Research storytelling — insert after pull-quote, before research-grid
# ---------------------------------------------------------------------------
STORY = f'''
  <div class="story-strip reveal">
    <div class="story-cell">
      <div class="story-label">Challenge</div>
      <p>Agriculture needs scalable sensing and autonomy — fields are large, labor is limited, and decisions demand better data.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Technology</div>
      <p>Drones, quadruped robots, autonomous rovers, IoT sensors, and computer vision deployed together in real environments.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Research</div>
      <p>First-author work integrating AI-powered robotic systems for precision agriculture and environmental monitoring.</p>
    </div>
    <div class="story-cell">
      <div class="story-label">Impact</div>
      <p>Live demos for researchers, dignitaries, and students — proving multi-robot systems can operate in the field today.</p>
    </div>
  </div>

  <div class="research-feature reveal">
    <img src="{media('05_Industry_Corporate', '10198.jpg')}" alt="Cameron Jones presenting first-author research poster on AI-powered robotic systems for precision agriculture" loading="lazy" style="object-position:center 20%">
    <div>
      <h3>First-Author<br><span>Research.</span></h3>
      <p>"Integrating AI-Powered Robotic Systems for Precision Agriculture and Environmental Monitoring" — developed and presented in collaboration with Tuskegee University, USDA, CROPPS, and Cornell University.</p>
      <p>The work bridges autonomous platforms with environmental sensing — showing how AI and robotics can inform agricultural decisions at scale.</p>
    </div>
  </div>
'''

marker = '  <div class="research-grid reveal">'
if STORY.strip() not in html and marker in html:
    html = html.replace(marker, STORY + "\n" + marker, 1)

# ---------------------------------------------------------------------------
# 6) Project case-study tech chips
# ---------------------------------------------------------------------------
tech_map = [
    (
        "bringing autonomous robotics to policymakers and 8-year-olds alike.</p>\n      </div>\n    </article>",
        "bringing autonomous robotics to policymakers and 8-year-olds alike.</p>\n        <div class=\"proj-tech\"><span>Quadruped Robotics</span><span>Field Ops</span><span>STEM Outreach</span></div>\n      </div>\n    </article>",
    ),
    (
        'First Place. "Project Tropical." Four teammates. One win.</p>\n      </div>\n    </article>',
        'First Place. "Project Tropical." Four teammates. One win.</p>\n        <div class="proj-tech"><span>Full-Stack</span><span>Hackathon</span><span>Team Lead</span></div>\n      </div>\n    </article>',
    ),
    (
        "2026 Precision &amp; Digital Agriculture Hackathon.</p>\n      </div>\n    </article>",
        "2026 Precision &amp; Digital Agriculture Hackathon.</p>\n        <div class=\"proj-tech\"><span>Analytics</span><span>Decision Support</span><span>AgTech</span></div>\n      </div>\n    </article>",
    ),
    (
        "simultaneous field research sessions.</p>\n      </div>\n    </article>",
        "simultaneous field research sessions.</p>\n        <div class=\"proj-tech\"><span>Drones</span><span>Rovers</span><span>Systems Integration</span></div>\n      </div>\n    </article>",
    ),
    (
        "experimental greenhouse beds.</p>\n      </div>\n    </article>",
        "experimental greenhouse beds.</p>\n        <div class=\"proj-tech\"><span>IoT</span><span>Sensors</span><span>Hardware</span></div>\n      </div>\n    </article>",
    ),
    (
        "government stakeholders.</p>\n      </div>\n    </article>\n  </div>\n</section>\n\n<section id=\"leadership\">",
        f'''government stakeholders.</p>
        <div class="proj-tech"><span>First Author</span><span>AI Systems</span><span>Precision Ag</span></div>
      </div>
    </article>
    <article class="proj proj-md reveal">
      <div class="media"><img src="{media('06_Projects', 'IMG_8101.jpeg')}" alt="Custom PC hardware build engineered by Cameron Jones" loading="lazy" style="object-position:center 40%"></div>
      <div class="proj-body">
        <div class="proj-label">Hardware · Systems</div>
        <div class="proj-title">Custom PC Builds</div>
        <p class="proj-desc">End-to-end custom computing hardware — assembling, tuning, and deploying high-performance systems for research and development workloads.</p>
        <div class="proj-tech"><span>Hardware</span><span>Systems</span><span>Engineering</span></div>
      </div>
    </article>
  </div>
</section>

<section id="leadership">''',
    ),
]
for old, new in tech_map:
    if old in html:
        html = html.replace(old, new, 1)

# ---------------------------------------------------------------------------
# 7) Industry section header before corp-strip
# ---------------------------------------------------------------------------
INDUSTRY_HDR = '''
  <div class="industry-header reveal">
    <div class="section-eyebrow left">Industry &amp; Institutions</div>
    <h2 class="section-title">Professional<br><em>Exposure.</em></h2>
    <p class="section-subtitle" style="text-align:left;margin-left:0">From corporate campuses to research partnerships — building relationships across industry and academia.</p>
  </div>
'''
if 'id="industry"' not in html and 'Professional<br><em>Exposure.</em>' not in html:
    html = html.replace('  <div class="corp-strip reveal">', INDUSTRY_HDR + '  <div class="corp-strip reveal">', 1)

# Expand industry cards to 6 with better labels if only 3 exist
old_corp = f'''  <div class="corp-strip reveal">
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/10196.jpg" alt="Industry visit and professional engagement" loading="lazy" style="object-position:center 25%"></div>
      <div class="corp-card-label">Industry · Leadership Summit</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/20250425_Tuskegee%20CROPPS%20visit-9800.jpeg" alt="CROPPS research visit at Tuskegee University farm" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">CROPPS · Tuskegee Field Visit</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="assets/images%20copy/05_Industry_Corporate/1915048171914742516.jpg" alt="Corporate and research partnership engagement" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">Partnerships · Research Network</div>
    </article>
  </div>'''

new_corp = f'''  <div class="corp-strip reveal">
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '10196.jpg')}" alt="Cameron Jones at an industry leadership engagement" loading="lazy" style="object-position:center 25%"></div>
      <div class="corp-card-label">Industry · Leadership Summit</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '20250425_Tuskegee CROPPS visit-9800.jpeg')}" alt="CROPPS research collaboration visit at Tuskegee University farm" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">CROPPS · Cornell Network</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '1915048171914742516.jpg')}" alt="Professional networking and research partnership engagement" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">Syngenta · MANRRS Network</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '1535327722005446767.jpg')}" alt="Corporate campus and industry visit experience" loading="lazy" style="object-position:center 30%"></div>
      <div class="corp-card-label">Corporate · Campus Visits</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '3027502746096312634.jpg')}" alt="Drone field research with precision agriculture team" loading="lazy"></div>
      <div class="corp-card-label">Field Research · Partners</div>
    </article>
    <article class="corp-card">
      <div class="media"><img src="{media('05_Industry_Corporate', '1246882608925951347.jpg')}" alt="Industry and academic collaboration experience" loading="lazy" style="object-position:center 25%"></div>
      <div class="corp-card-label">UIUC · Academic Partners</div>
    </article>
  </div>'''

if old_corp in html:
    html = html.replace(old_corp, new_corp, 1)

# Update corp-strip grid for 6 cards
html = html.replace(
    ".corp-strip{\n  display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;",
    ".corp-strip{\n  display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;"
)
# Add media query tweak - already have 1 col at 768. At 1100 keep 3.

# ---------------------------------------------------------------------------
# 8) Journey timeline — insert before #contact
# ---------------------------------------------------------------------------
JOURNEY = '''
<section id="journey">
  <div class="section-header reveal" style="padding:0 var(--pad-x)">
    <div class="section-eyebrow">Path</div>
    <h2 class="section-title">My<br><em>Journey.</em></h2>
    <p class="section-subtitle">From first research deployments to first-author work — a story of building real systems in the field.</p>
  </div>
  <div class="timeline">
    <article class="tl-item reveal">
      <div class="tl-year">2022</div>
      <div class="tl-title">AI Farms Research Assistant</div>
      <div class="tl-body">Began AI and robotics research at Tuskegee University — joining the AI Farms initiative and stepping into autonomous systems for agriculture.</div>
    </article>
    <article class="tl-item reveal reveal-d1">
      <div class="tl-year">2023</div>
      <div class="tl-title">Autonomous Systems Growth</div>
      <div class="tl-body">
        <ul>
          <li>Drone systems and aerial monitoring</li>
          <li>Rover deployments in field environments</li>
          <li>IoT sensors and environmental data collection</li>
          <li>Precision agriculture research foundations</li>
        </ul>
      </div>
    </article>
    <article class="tl-item reveal reveal-d2">
      <div class="tl-year">2024</div>
      <div class="tl-title">Robotics and Outreach</div>
      <div class="tl-body">
        <ul>
          <li>Robotics demonstrations for stakeholders</li>
          <li>STEM education and youth engagement</li>
          <li>Community-facing technology programs</li>
        </ul>
      </div>
    </article>
    <article class="tl-item reveal">
      <div class="tl-year">2025</div>
      <div class="tl-title">Leadership and Industry Growth</div>
      <div class="tl-body">
        <ul>
          <li>UNCF Ambassador</li>
          <li>MANRRS SMART Ag Tech cohort</li>
          <li>Industry experiences across agriculture and tech</li>
          <li>Competitive hackathons and team builds</li>
        </ul>
      </div>
    </article>
    <article class="tl-item reveal reveal-d1">
      <div class="tl-year">2026</div>
      <div class="tl-title">Research Innovation</div>
      <div class="tl-body">
        <ul>
          <li>First-author research poster</li>
          <li>USDA / CROPPS / Cornell collaboration</li>
          <li>Continued AI and robotics development in the field</li>
        </ul>
      </div>
    </article>
  </div>
</section>

'''

if 'id="journey"' not in html:
    html = html.replace('<section id="contact">', JOURNEY + '<section id="contact">', 1)

# ---------------------------------------------------------------------------
# 9) JS — observe timeline items (already uses .reveal)
# ---------------------------------------------------------------------------
# Ensure timeline items get observed — they have reveal class already.

# Soft parallax on hero (subtle)
PARALLAX_JS = '''
// Subtle hero parallax
const heroImg = document.querySelector('.hero-media img');
if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 500);
    heroImg.style.transform = `scale(1.06) translateY(${y * 0.12}px)`;
  }, { passive: true });
}
'''
if "Subtle hero parallax" not in html:
    html = html.replace("</script>", PARALLAX_JS + "\n</script>", 1)

# Verify media for new files
missing = []
for m in re.findall(r'src="(assets/[^"]+)"', html):
    from urllib.parse import unquote
    p = Path(unquote(m))
    if not p.exists():
        missing.append(m)

path.write_text(html, encoding="utf-8")
print(f"Updated {path} ({path.stat().st_size:,} bytes)")
print(f"Missing: {len(missing)}")
for m in missing:
    print(" ", m)
print("journey:", 'id="journey"' in html)
print("hero identity:", "hero-identity" in html)
print("story strip:", "story-strip" in html)
print("svg icons:", html.count("ci-svg"))
print("mojibake left in icons:", bool(re.search(r'contact-info-icon">[^<]*â', html)))
'''
