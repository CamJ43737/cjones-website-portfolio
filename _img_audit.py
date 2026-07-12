# -*- coding: utf-8 -*-
"""Image presentation audit only — object-fit / object-position. No layout/content changes."""
from pathlib import Path
import re

path = Path(__file__).resolve().parent / "index.html"
text = path.read_text(encoding="utf-8")

AUDIT_CSS = r"""
/* ===== IMAGE QUALITY AUDIT (presentation only) ===== */
img{
  object-fit:cover;
}
/* Hero — vertical field ops; keep Cameron fully framed on the right */
.hero-media img{
  object-fit:cover !important;
  object-position:82% 27% !important;
}
@media (max-width:768px){
  .hero-media img{object-position:88% 25% !important}
}
@media (max-width:520px){
  .hero-media img{object-position:92% 24% !important}
}

/* About / Rooted in Legacy — Tuskegee portrait; face + torso + backdrop */
.about-frame img{
  object-fit:cover !important;
  object-position:center 18% !important;
}

/* Research bleed — 10782 is vertical spectrometer shot in a wide frame */
.research-bleed,
img.research-bleed{
  object-fit:cover !important;
  object-position:52% 24% !important;
}

/* Fishing — full person + lake environment (not face zoom) */
.beyond-card.featured img,
img[src*="IMG_6209"]{
  object-fit:cover !important;
  object-position:center 48% !important;
}
@media (max-width:560px){
  .beyond-card.featured img,
  img[src*="IMG_6209"]{object-position:center 50% !important}
}

/* Per-asset focal points (art-directed, not centered blindly) */
img[src*="10785.jpg"]{object-position:82% 27%}
img[src*="10782.jpg"]{object-position:52% 24%}
img[src*="10784.jpg"]{object-position:48% 30%}
img[src*="274091622200731962"]{object-position:50% 40%}
img[src*="2104941407774967754"]{object-position:45% 42%}
img[src*="IMG_2029"]{object-position:40% 38%}
img[src*="IMG_2497"]{object-position:50% 45%}
img[src*="IMG_3363"]{object-position:50% 42%}
img[src*="IMG_2775"]{object-position:50% 40%}

img[src*="10198.jpg"]{object-position:50% 26%}
img[src*="10196.jpg"]{object-position:50% 28%}
img[src*="1915048171914742516"]{object-position:50% 32%}
img[src*="CROPPS%20visit-9800"],img[src*="CROPPS visit-9800"]{object-position:45% 35%}
img[src*="CROPPS%20visit-9796"],img[src*="CROPPS visit-9796"]{object-position:50% 42%}

img[src*="IMG_6667"]{object-position:48% 36%}
img[src*="IMG_0073"]{object-position:50% 42%}
img[src*="IMG_1936"]{object-position:50% 62%}
img[src*="IMG_1561"]{object-position:50% 48%}
img[src*="IMG_4364"]{object-position:50% 52%}
img[src*="IMG_6659"]{object-position:50% 40%}
img[src*="IMG_6658"]{object-position:48% 38%}

img[src*="IMG_0669"]{object-position:50% 30%}
img[src*="IMG_0362"]{object-position:50% 28%}
img[src*="IMG_2713"]{object-position:50% 42%}
img[src*="IMG_8101"]{object-position:50% 48%}
img[src*="IMG_2402"]{object-position:50% 40%}

img[src*="IMG_6289"]{object-position:48% 18%}
img[src*="IMG_0062"]{object-position:50% 26%}
img[src*="IMG_0055"]{object-position:50% 28%}
img[src*="8900312655144300583"]{object-position:50% 20%}
img[src*="IMG_5565"]{object-position:50% 26%}

img[src*="IMG_2945"]{object-position:50% 45%}
img[src*="IMG_9256"]{object-position:50% 42%}
img[src*="IMG_6682"]{object-position:50% 38%}

img[src*="IMG_5528"]{object-position:50% 20%}
img[src*="IMG_5538"]{object-position:50% 22%}
img[src*="IMG_4112"]{object-position:50% 22%}
img[src*="IMG_0596"]{object-position:50% 28%}

img[src*="20260420_180837"]{object-position:50% 20%}
img[src*="9777.jpg"]{object-position:50% 32%}
img[src*="IMG_3233"]{object-position:50% 28%}

img[src*="Screenshot%202025-09-11"],img[src*="Screenshot 2025-09-11"]{object-position:center 18%}

/* Section containers — ensure cover + overflow clip */
.about-frame,.r-card .media,.proj .media,.corp-card .media,.beyond-card .media,
.honor-card .media,.robo-card .media,.research-support .media,.exhibit-item,
.lead-mosaic,.roots-photos,.research-feature{
  overflow:hidden;
}
.about-frame img,.r-card img,.proj img,.corp-card img,.beyond-card img,
.honor-card img,.robo-card img,.research-support img,.exhibit-item img,
.lead-mosaic img,.roots-photos img,.research-feature img{
  width:100%;
  height:100%;
  object-fit:cover;
}
.research-feature img{height:clamp(260px,40vw,420px)}
"""

# Remove old conflicting FINAL polish image-position rules (keep layout polish)
# Replace hero object-position block inside FINAL polish
text = re.sub(
    r"/\* Hero cinematic \*/\n\.hero-media img\{[^}]+\}\n@media \(max-width:768px\)\{\n  \.hero-media img\{[^}]+\}\n\}\n@media \(max-width:520px\)\{\n  \.hero-media img\{[^}]+\}\n\}",
    "/* Hero cinematic — positions set in IMAGE QUALITY AUDIT */\n",
    text,
    count=1,
)

# Simpler replacements for known conflicting rules
replacements_css = [
    (
        ".hero-media img{\n  object-position:80% 30% !important;\n  filter:saturate(1.05) contrast(1.04);\n}",
        ".hero-media img{\n  filter:saturate(1.05) contrast(1.04);\n}",
    ),
    (
        ".hero-media img{\n  object-position:82% 27% !important;\n  filter:saturate(1.05) contrast(1.04);\n}",
        ".hero-media img{\n  filter:saturate(1.05) contrast(1.04);\n}",
    ),
    (
        "  .hero-media img{object-position:86% 28% !important}",
        "  /* hero position in audit */",
    ),
    (
        "  .hero-media img{object-position:90% 26% !important}",
        "  /* hero position in audit */",
    ),
    (
        "  .hero-media img{object-position:88% 25% !important}",
        "  /* hero position in audit */",
    ),
    (
        "  .hero-media img{object-position:92% 24% !important}",
        "  /* hero position in audit */",
    ),
    (
        ".research-bleed{\n  height:clamp(300px,46vw,520px) !important;\n  object-position:center 38% !important;\n  filter:saturate(1.04) contrast(1.03);\n  box-shadow:0 0 0 1px rgba(201,168,76,.12);\n}",
        ".research-bleed{\n  height:clamp(300px,46vw,520px) !important;\n  filter:saturate(1.04) contrast(1.03);\n  box-shadow:0 0 0 1px rgba(201,168,76,.12);\n}",
    ),
    (
        ".about-frame img{object-position:center 12% !important}",
        "/* about position in audit */",
    ),
    (
        ".beyond-card.featured img{\n  object-fit:cover !important;\n  object-position:center 55% !important;\n}\n.beyond-card:not(.featured) img{object-position:center 40% !important}",
        ".beyond-card:not(.featured) img{/* per-asset in audit */}",
    ),
    (
        "  .beyond-card.featured img{object-position:center 52% !important}",
        "  /* fishing in audit */",
    ),
    (
        ".robo-card.featured img{object-position:center 42% !important}",
        "/* robotics in audit */",
    ),
]
for a, b in replacements_css:
    text = text.replace(a, b)

# Strip inline object-position — CSS attribute selectors own framing
text = re.sub(r'\s*style="object-position:[^"]*"', "", text)

# Inject audit CSS once
if "IMAGE QUALITY AUDIT" not in text:
    text = text.replace("</style>", AUDIT_CSS + "\n</style>", 1)
else:
    text = re.sub(
        r"/\* ===== IMAGE QUALITY AUDIT \(presentation only\) ===== \*/.*?(?=\n</style>)",
        AUDIT_CSS.strip() + "\n",
        text,
        count=1,
        flags=re.S,
    )

# Sync base hero/about without fighting audit (audit uses !important)
text = text.replace(
    "object-fit:cover;object-position:68% 28%;",
    "object-fit:cover;",
)
text = text.replace(
    "object-fit:cover;object-position:center 15%;",
    "object-fit:cover;",
)
text = text.replace(
    "object-fit:cover;object-position:center 45%;",
    "object-fit:cover;",
)

path.write_text(text, encoding="utf-8")

# Verify
inline_left = len(re.findall(r'style="object-position', text))
imgs = len(re.findall(r"<img\s", text))
print(f"Images: {imgs}")
print(f"Inline object-position left: {inline_left}")
print(f"Audit CSS present: {'IMAGE QUALITY AUDIT' in text}")
print(f"Hero rule: {'82% 27%' in text}")
print(f"Fishing rule: {'IMG_6209' in text and '48%' in text}")
