# -*- coding: utf-8 -*-
"""Final premium polish — no new images, no reorganization."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
path = ROOT / "index.html"
text = path.read_text(encoding="utf-8")

# --- Fix broken orphaned CSS from prior pass ---
text = re.sub(
    r"/\* About frame gold accent \*/\n\.about-frame::before\{[^}]+\}\n\n\n  \.video-grid\{grid-template-columns:1fr\}\n  \.hero-media img\{object-position:72% 26%\}\n\}\n\n",
    "/* About frame gold accent */\n.about-frame::before{border-color:rgba(201,168,76,.28);box-shadow:var(--glow)}\n\n",
    text,
    count=1,
)

FINAL_CSS = r"""
/* ===== FINAL LUXURY POLISH PASS ===== */
:root{
  --max:1180px;
  --pad-x:clamp(1.4rem,5.2vw,4.75rem);
  --pad-y:clamp(5rem,12vw,10.5rem);
  --glow:0 0 42px rgba(201,168,76,.09);
  --glow-strong:0 0 56px rgba(201,168,76,.18);
  --glass:linear-gradient(165deg,rgba(36,31,22,.88),rgba(18,15,11,.94));
}
body{
  background:
    radial-gradient(ellipse 70% 45% at 8% -8%,rgba(201,168,76,.085),transparent 58%),
    radial-gradient(ellipse 55% 40% at 92% 12%,rgba(201,168,76,.045),transparent 52%),
    radial-gradient(ellipse 50% 30% at 50% 100%,rgba(201,168,76,.03),transparent 60%),
    var(--bg) !important;
}

/* Grid alignment — shared content rail */
.section-header,
.industry-header{
  max-width:var(--max);
  margin-left:auto;
  margin-right:auto;
  padding-left:var(--pad-x);
  padding-right:var(--pad-x);
  margin-bottom:clamp(2.8rem,6vw,4.6rem);
}
.section-header[style*="padding"],
.industry-header{box-sizing:border-box}
.section-title{
  letter-spacing:.045em;
  font-size:clamp(2.85rem,5.8vw,5.8rem);
}
.section-subtitle{
  max-width:520px;
  margin-top:1.35rem;
  font-size:clamp(.92rem,1.35vw,1.02rem);
  letter-spacing:.01em;
  color:var(--muted);
  line-height:1.9;
}
.section-eyebrow{margin-bottom:1.15rem;letter-spacing:.32em}

/* Hero cinematic */
.hero-media img{
  object-position:72% 42% !important;
  filter:saturate(1.05) contrast(1.04);
}
.hero-media::after{
  background:
    linear-gradient(105deg,rgba(10,9,6,.97) 0%,rgba(10,9,6,.82) 28%,rgba(10,9,6,.35) 55%,rgba(10,9,6,.45) 100%),
    linear-gradient(0deg,rgba(10,9,6,.96) 0%,rgba(10,9,6,.4) 32%,rgba(10,9,6,.08) 58%,transparent 76%),
    radial-gradient(ellipse 60% 50% at 70% 40%,rgba(201,168,76,.08),transparent 65%) !important;
}
.hero-name{letter-spacing:.03em;text-shadow:0 2px 40px rgba(0,0,0,.45)}
.hero-name span{text-shadow:0 0 40px rgba(201,168,76,.25)}
.hero-stat-num{text-shadow:0 0 30px rgba(201,168,76,.28)}
.hero-content{max-width:780px}
.btn{
  min-height:48px;
  letter-spacing:.22em;
}
.btn-primary{
  box-shadow:0 0 28px rgba(201,168,76,.22), inset 0 1px 0 rgba(255,255,255,.15);
}
.btn-primary:hover{
  box-shadow:0 0 40px rgba(201,168,76,.35), 0 16px 40px rgba(201,168,76,.2);
}
.btn-ghost:hover{
  box-shadow:0 0 24px rgba(201,168,76,.12);
  background:rgba(201,168,76,.06);
}

/* Luxury glass components */
.r-card,.proj,.corp-card,.beyond-card,.honor-card,.story-cell,.robo-card,.tl-item{
  background:var(--glass) !important;
  border:1px solid rgba(201,168,76,.2) !important;
  box-shadow:var(--glow), inset 0 1px 0 rgba(232,201,122,.07) !important;
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  transition:transform .45s var(--ease),border-color .35s,box-shadow .45s !important;
}
.r-card:hover,.proj:hover,.corp-card:hover,.beyond-card:hover,.honor-card:hover,.story-cell:hover,.robo-card:hover{
  transform:translateY(-6px) !important;
  border-color:rgba(201,168,76,.48) !important;
  box-shadow:var(--glow-strong),0 28px 64px rgba(0,0,0,.48),inset 0 1px 0 rgba(232,201,122,.12) !important;
}
.collab-bar,.impact-line,.pull-quote{
  background:var(--glass) !important;
  border:1px solid rgba(201,168,76,.28) !important;
  box-shadow:var(--glow) !important;
  backdrop-filter:blur(12px);
  max-width:var(--max);
  margin-left:auto !important;
  margin-right:auto !important;
  width:calc(100% - 2 * var(--pad-x));
}
.about-grid,.bento,.lead-layout,.corp-strip,.research-grid,.story-strip,
.research-feature,.beyond-grid,.roots-layout,.honors-grid,.contact-layout,
.timeline,.robo-cats,.research-support,.research-mission,.exhibit-grid{
  max-width:var(--max);
  margin-left:auto;
  margin-right:auto;
}

/* Research showcase */
.research-bleed{
  height:clamp(300px,46vw,520px) !important;
  object-position:center 38% !important;
  filter:saturate(1.04) contrast(1.03);
  box-shadow:0 0 0 1px rgba(201,168,76,.12);
}
.research-caption{letter-spacing:.22em;color:var(--gold-dim)}
.research-support .media{
  border:1px solid rgba(201,168,76,.2) !important;
  box-shadow:var(--glow);
}
.research-feature img{
  border:1px solid rgba(201,168,76,.28) !important;
  box-shadow:var(--glow-strong);
}
.story-cell{padding:1.55rem 1.45rem !important}
.r-card-num{color:rgba(201,168,76,.35) !important;font-size:2.7rem}

/* About portrait */
.about-frame img{object-position:center 12% !important}
.about-frame::after{
  content:'';position:absolute;inset:auto -8% -8% auto;width:42%;height:42%;
  background:radial-gradient(circle,rgba(201,168,76,.14),transparent 70%);
  pointer-events:none;z-index:0;
}

/* Fishing / beyond — show full environment, not face crop */
.beyond-card.featured .media{
  aspect-ratio:4/5 !important;
  min-height:0 !important;
  max-height:560px;
}
.beyond-card.featured img{
  object-fit:cover !important;
  object-position:center 48% !important;
}
.beyond-card:not(.featured) img{object-position:center 40% !important}
.beyond-grid{gap:1.15rem !important}
@media (min-width:769px){
  .beyond-card.featured{
    grid-column:1 / 2;
    grid-row:1 / 3;
  }
  .beyond-card.featured .media{
    aspect-ratio:auto !important;
    height:100%;
    min-height:420px;
  }
}

/* Selected Work — curated exhibition (not slideshow) */
#selected{background:var(--bg2)}
.exhibit-grid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:1rem;
  padding:0 var(--pad-x);
}
.exhibit-item{
  position:relative;overflow:hidden;
  border:1px solid rgba(201,168,76,.2);
  background:var(--glass);
  box-shadow:var(--glow);
  min-height:220px;
  transition:transform .45s var(--ease),border-color .35s,box-shadow .45s;
}
.exhibit-item:hover{
  transform:translateY(-4px);
  border-color:rgba(201,168,76,.45);
  box-shadow:var(--glow-strong),0 24px 50px rgba(0,0,0,.4);
}
.exhibit-item img{
  width:100%;height:100%;object-fit:cover;
  transition:transform .8s var(--ease),filter .5s;
  filter:saturate(1.02);
}
.exhibit-item:hover img{transform:scale(1.04);filter:saturate(1.08)}
.exhibit-item figcaption{
  position:absolute;inset:auto 0 0;padding:1.15rem 1.2rem;
  background:linear-gradient(transparent,rgba(10,9,6,.92));
  font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--off);
  opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s var(--ease);
}
.exhibit-item:hover figcaption{opacity:1;transform:none}
.exhibit-item.e-lg{grid-column:span 7;min-height:340px}
.exhibit-item.e-md{grid-column:span 5;min-height:340px}
.exhibit-item.e-sm{grid-column:span 4;min-height:240px}
.exhibit-item.e-sm:nth-child(n+4){min-height:260px}
.gallery-controls{display:none !important}

/* Honors — award presence */
.honor-card{
  text-align:center;
  position:relative;
}
.honor-card::before{
  content:'';position:absolute;inset:-1px;pointer-events:none;
  background:linear-gradient(135deg,rgba(201,168,76,.25),transparent 40%,transparent 60%,rgba(201,168,76,.12));
  opacity:.55;z-index:1;
}
.honor-card .media{position:relative;z-index:0}
.honor-card p{position:relative;z-index:2;color:var(--gold-light) !important;letter-spacing:.18em !important}

/* Timeline milestones */
#journey .tl-item{
  border-left:none;
}
.tl-year{text-shadow:0 0 24px rgba(201,168,76,.3)}
.tl-item::before{
  box-shadow:0 0 0 5px rgba(201,168,76,.16),0 0 18px rgba(201,168,76,.4) !important;
}

/* Image reveal */
.reveal img,.reveal .media{
  clip-path:inset(4% 4% 4% 4%);
  transition:clip-path 1.1s var(--ease),opacity .95s var(--ease),transform .95s var(--ease);
}
.reveal.visible img,.reveal.visible .media{clip-path:inset(0 0 0 0)}
.reveal{
  opacity:0;transform:translateY(36px);
  transition:opacity 1s var(--ease),transform 1s var(--ease);
}
.reveal.visible{opacity:1;transform:none}

/* Corp strip alignment */
.corp-strip{grid-template-columns:repeat(4,1fr) !important;gap:1.1rem}

/* Robotics featured framing */
.robo-card.featured img{object-position:center 42% !important}
.robo-cat-label{letter-spacing:.3em}

/* Mobile designed, not compressed */
@media (max-width:900px){
  .exhibit-item.e-lg,.exhibit-item.e-md{grid-column:span 6;min-height:260px}
  .exhibit-item.e-sm{grid-column:span 6}
  .corp-strip{grid-template-columns:1fr 1fr !important}
  .beyond-card.featured{grid-column:1/-1;grid-row:auto}
  .beyond-card.featured .media{aspect-ratio:4/5 !important;max-height:480px;height:auto;min-height:0}
}
@media (max-width:768px){
  .hero-media img{object-position:78% 38% !important}
  .section-title{font-size:clamp(2.5rem,11vw,3.6rem)}
  .exhibit-item.e-lg,.exhibit-item.e-md,.exhibit-item.e-sm{grid-column:span 12;min-height:220px}
  .exhibit-item figcaption{opacity:1;transform:none}
  .btn{min-height:50px}
}
@media (max-width:520px){
  .hero-media img{object-position:82% 36% !important}
  .beyond-card.featured img{object-position:center 45% !important}
}
@media (prefers-reduced-motion:reduce){
  .reveal img,.reveal .media{clip-path:none;transition:none}
}
"""

# Inject before </style> if not already present
if "FINAL LUXURY POLISH PASS" not in text:
    text = text.replace("</style>", FINAL_CSS + "\n</style>", 1)

# --- Fishing image object-position ---
text = text.replace(
    'src="assets/images%20copy/07_Hobbies_and_Passions/IMG_6209.jpeg" alt="Cameron Jones holding a catch after fishing by the lake" loading="lazy" style="object-position:center 20%"',
    'src="assets/images%20copy/07_Hobbies_and_Passions/IMG_6209.jpeg" alt="Cameron Jones holding a catch after fishing by the lake" loading="lazy" style="object-position:center 48%"',
)

# Soften other face-heavy crops toward environment
replacements = [
    ('IMG_2945.JPG" alt="Outdoor passion photography" loading="lazy" style="object-position:center 25%"',
     'IMG_2945.JPG" alt="Outdoor passion photography" loading="lazy" style="object-position:center 42%"'),
    ('IMG_9256.JPG" alt="Hobby and passion photography" loading="lazy" style="object-position:center 30%"',
     'IMG_9256.JPG" alt="Hobby and passion photography" loading="lazy" style="object-position:center 40%"'),
    ('IMG_6682.JPG" alt="Cinematic personal photography" loading="lazy" style="object-position:center 28%"',
     'IMG_6682.JPG" alt="Cinematic personal photography" loading="lazy" style="object-position:center 40%"'),
    ('10784.jpg" alt="Cameron Jones conducting leaf measurements during field research" loading="lazy" style="object-position:center 30%"',
     '10784.jpg" alt="Cameron Jones conducting leaf measurements during field research" loading="lazy" style="object-position:center 35%"'),
    ('IMG_6659.JPG" alt="Robotics demonstration for community and stakeholders" loading="lazy" style="object-position:center 30%"',
     'IMG_6659.JPG" alt="Robotics demonstration for community and stakeholders" loading="lazy" style="object-position:center 38%"'),
    ('10198.jpg" alt="Cameron Jones presenting first-author research poster on AI-powered robotic systems" loading="lazy" style="object-position:center 18%"',
     '10198.jpg" alt="Cameron Jones presenting first-author research poster on AI-powered robotic systems" loading="lazy" style="object-position:center 22%"'),
    ('20260420_180837.jpg" alt="Formal academic honor society recognition" loading="lazy" style="object-position:center 15%"',
     '20260420_180837.jpg" alt="Formal academic honor society recognition" loading="lazy" style="object-position:center 22%"'),
]
for a, b in replacements:
    text = text.replace(a, b)

# --- Selected Work: replace carousel with exhibition grid (same 8 images) ---
old_selected = re.search(
    r'<section id="selected">.*?</section>',
    text,
    re.S,
)
if old_selected:
    new_selected = r'''<section id="selected">
  <div class="section-header reveal">
    <div class="section-eyebrow">Curated Exhibition</div>
    <h2 class="section-title">Selected<br><em>Work.</em></h2>
    <p class="section-subtitle">Eight frames. One story — research, robotics, and impact at industry caliber.</p>
  </div>
  <div class="exhibit-grid reveal">
    <figure class="exhibit-item e-lg"><img src="assets/images%20copy/03_Robotics/IMG_1936.JPG" alt="Multi-robot field deployment" loading="lazy" style="object-position:center 48%"><figcaption>Multi-Robot Field Ops</figcaption></figure>
    <figure class="exhibit-item e-md"><img src="assets/images%20copy/02_AI_Farms_Research/IMG_2029.JPEG" alt="Greenhouse research systems" loading="lazy"><figcaption>Greenhouse Systems</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/03_Robotics/IMG_6667.JPG" alt="Robot dog field research" loading="lazy" style="object-position:center 42%"><figcaption>Robot Dog</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/05_Industry_Corporate/10198.jpg" alt="Research poster presentation" loading="lazy" style="object-position:center 18%"><figcaption>First-Author Poster</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/06_Projects/IMG_0669.JPEG" alt="UIUC hackathon first place" loading="lazy" style="object-position:center 28%"><figcaption>UIUC — First Place</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/04_Leadership_Community/IMG_5565.JPG" alt="Leadership cohort" loading="lazy" style="object-position:center 28%"><figcaption>Leadership</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/03_Robotics/IMG_1561.JPG" alt="Agricultural rover" loading="lazy" style="object-position:center 42%"><figcaption>Agricultural Rover</figcaption></figure>
    <figure class="exhibit-item e-sm"><img src="assets/images%20copy/10_Honors_Achievements/20260420_180837.jpg" alt="Academic honor recognition" loading="lazy" style="object-position:center 20%"><figcaption>Honors</figcaption></figure>
  </div>
</section>'''
    text = text[: old_selected.start()] + new_selected + text[old_selected.end() :]

# Normalize section-header inline padding (grid CSS handles it)
text = text.replace(
    'class="section-header reveal" style="padding:0 var(--pad-x)"',
    'class="section-header reveal"',
)
text = text.replace(
    'class="section-header reveal" style="padding:0 var(--pad-x);margin-bottom:2rem"',
    'class="section-header reveal"',
)
text = text.replace(
    'class="corp-strip reveal" style="grid-template-columns:repeat(4,1fr)"',
    'class="corp-strip reveal"',
)

# Improve reveal observer + drop carousel / refine parallax
old_js_tail = """const track = document.getElementById('carouselTrack');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let current = 0;
function getSlideStep() {
  if (!track) return 416;
  const slide = track.querySelector('.gallery-slide');
  if (!slide) return 416;
  const gap = parseFloat(getComputedStyle(track).gap) || 16;
  return slide.getBoundingClientRect().width + gap;
}
function getMaxSlide() {
  if (!track) return 0;
  const slides = track.querySelectorAll('.gallery-slide');
  const step = getSlideStep();
  const visible = Math.max(1, Math.floor(track.parentElement.clientWidth / step));
  return Math.max(0, slides.length - visible);
}
function updateCarousel() {
  if (!track) return;
  current = Math.min(current, getMaxSlide());
  track.style.transform = `translateX(-${current * getSlideStep()}px)`;
}
if (nextBtn && prevBtn && track) {
  nextBtn.addEventListener('click', () => { current = Math.min(current + 1, getMaxSlide()); updateCarousel(); });
  prevBtn.addEventListener('click', () => { current = Math.max(current - 1, 0); updateCarousel(); });
  window.addEventListener('resize', updateCarousel, { passive: true });
}

// Subtle hero parallax
const heroImg = document.querySelector('.hero-media img');
if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 500);
    heroImg.style.transform = `scale(1.06) translateY(${y * 0.12}px)`;
  }, { passive: true });
}"""

new_js_tail = """// Subtle hero parallax
const heroImg = document.querySelector('.hero-media img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroImg && !reduceMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 480);
      heroImg.style.transform = `scale(1.05) translateY(${y * 0.1}px)`;
      ticking = false;
    });
  }, { passive: true });
}"""

if old_js_tail in text:
    text = text.replace(old_js_tail, new_js_tail)

# Strengthen IntersectionObserver threshold if present
text = text.replace(
    "threshold: 0.12",
    "threshold: 0.14, rootMargin: '0px 0px -6% 0px'",
)
text = text.replace(
    "threshold:0.12",
    "threshold:0.14,rootMargin:'0px 0px -6% 0px'",
)

# Verify counts
from urllib.parse import unquote
imgs = len(re.findall(r"<img\s", text))
missing = []
for src in re.findall(r'src="(assets/[^"]+)"', text):
    if not (ROOT / unquote(src)).exists():
        missing.append(src)

path.write_text(text, encoding="utf-8")
print(f"Images: {imgs}")
print(f"Missing: {len(missing)}")
for m in missing:
    print(" ", m)
print("Exhibition:", "exhibit-grid" in text)
print("Carousel gone:", "carouselTrack" not in text)
print("Final polish CSS:", "FINAL LUXURY POLISH PASS" in text)
