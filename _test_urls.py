import urllib.request
import re
from pathlib import Path

urls = [
    "http://127.0.0.1:8765/assets/images%20copy/02_AI_Farms_Research/10785.jpg",
    "http://127.0.0.1:8765/assets/images%20copy/03_Robotics/IMG_6667.JPG",
    "http://127.0.0.1:8765/resume.pdf",
]
for u in urls:
    try:
        r = urllib.request.urlopen(u)
        print(r.status, r.headers.get("Content-Length"), u.split("/")[-1])
    except Exception as e:
        print("FAIL", u, e)

srcs = re.findall(r'src="(assets/[^"]+)"', Path("index.html").read_text(encoding="utf-8"))
print("sample srcs:", srcs[:4])
print("total srcs", len(srcs))
