from pathlib import Path
from urllib.parse import unquote
import re

html = Path("index.html").read_text(encoding="utf-8")
missing = []
for src in re.findall(r'src="(assets/[^"]+)"', html):
    p = Path(unquote(src))
    if not p.exists():
        missing.append(src)
print("imgs", html.count("<img"))
print("missing", len(missing))
for m in missing:
    print(" ", m)
print("journey", 'id="journey"' in html)
print("hero fleet", "IMG_1936" in html and "hero-media" in html)
print("story", "story-strip" in html)
print("svg icons", html.count("ci-svg"))
print("mojibake icons", bool(re.search(r'contact-info-icon">[^<]*[âð]', html)))
print("resume refs", html.count("resume.pdf"))
print("sections", re.findall(r'<section id="([^"]+)"', html))
