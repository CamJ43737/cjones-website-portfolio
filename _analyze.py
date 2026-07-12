from pathlib import Path
import re

root = Path(".")
print("=== ROOT ===")
for p in sorted(root.iterdir(), key=lambda x: x.name.lower()):
    if p.name.startswith("."):
        continue
    kind = "DIR" if p.is_dir() else f"{p.stat().st_size:,}"
    print(f"{p.name:40} {kind}")

src = Path(r"c:\Users\camer_iww195h\Documents\DOCUMENTS\Quick Resume and cover letter\THE BLUEPRINT RESUME\2026 Resume\resume.pdf")
print("\n=== RESUME SOURCE ===")
print("exists:", src.exists())
if src.exists():
    print(src, src.stat().st_size, src.stat().st_mtime)

cur = Path("resume.pdf")
print("\n=== CURRENT RESUME ===")
print("exists:", cur.exists())
if cur.exists():
    print(cur.resolve(), cur.stat().st_size)

html = Path("index.html").read_text(encoding="utf-8")
print("\n=== INDEX ===")
print("bytes:", Path("index.html").stat().st_size)
print("lines:", len(html.splitlines()))
print("imgs:", html.count("<img"))
print("sections:", re.findall(r'<section id="([^"]+)"', html))
print("nav links:", re.findall(r'href="#([^"]+)"', html))
print("resume refs:", html.count("resume.pdf"))
print("mojibake markers:", "â" in html)
print("emoji icons:", sum(html.count(c) for c in "✉↗📍⬇⌥"))
print("hero img:", re.search(r'#hero[\s\S]*?<img[^>]+src="([^"]+)"', html))
m = re.search(r'id="hero"[\s\S]*?<img[^>]+src="([^"]+)"', html)
print("hero src:", m.group(1) if m else None)
print("media paths sample:", re.findall(r'src="(assets/[^"]+)"', html)[:8])
print("style inline:", "<style>" in html)
print("script inline:", "<script>" in html)
