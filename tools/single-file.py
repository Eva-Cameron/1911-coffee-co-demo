import base64
import mimetypes
import re
from pathlib import Path

# Settings
DIST = Path(__file__).resolve().parent.parent / "dist"
OUTPUT = DIST.parent / "1911-coffee-co.html"
MAX_IMAGE_WIDTH = 1000          # the widest photo variant worth embedding
HAIRLINE_FILES = ["kernel.js", "cups.js", "dome.js"]

mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("image/avif", ".avif")
mimetypes.add_type("image/webp", ".webp")


def data_uri(path):
    kind = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{kind};base64,{base64.b64encode(path.read_bytes()).decode()}"


html = (DIST / "index.html").read_text()

# Stylesheet inline, with woff2 fonts embedded and the woff fallbacks dropped (every current browser takes woff2)
for link in re.findall(r'<link rel="stylesheet" href="([^"]+)">', html):
    css = (DIST / link.lstrip("/")).read_text()
    css = re.sub(r',\s*url\([^)]*\.woff\) format\("woff"\)', "", css)
    css = re.sub(r"url\((/_astro/[^)]+\.woff2)\)", lambda match: f"url({data_uri(DIST / match.group(1).lstrip('/'))})", css)
    html = html.replace(f'<link rel="stylesheet" href="{link}">', f"<style>{css}</style>")

# Each <picture> keeps its wrapper but holds one <img> carrying the largest WebP no wider than MAX_IMAGE_WIDTH
def flatten_picture(match):
    block = match.group(0)
    webp = re.search(r'<source[^>]*srcset="([^"]+)"[^>]*type="image/webp"', block) or re.search(r'<source[^>]*type="image/webp"[^>]*srcset="([^"]+)"', block)
    candidates = []
    for entry in webp.group(1).split(","):
        url, width = entry.strip().rsplit(" ", 1)
        candidates.append((int(width.rstrip("w")), url))
    fitting = [item for item in sorted(candidates) if item[0] <= MAX_IMAGE_WIDTH] or sorted(candidates)[:1]
    chosen = fitting[-1][1]
    image = re.search(r"<img[^>]*>", block).group(0)
    image = re.sub(r'\s(srcset|sizes)="[^"]*"', "", image)
    image = re.sub(r'src="[^"]*"', f'src="{data_uri(DIST / chosen.lstrip("/"))}"', image)
    opening = re.match(r"<picture[^>]*>", block).group(0)
    return f"{opening}{image}</picture>"

html = re.sub(r"<picture[^>]*>.*?</picture>", flatten_picture, html, flags=re.S)

# The Hairline figures are loaded by script tags at run time; point those at embedded copies
embedded = {f"/hairline/{name}": data_uri(DIST / "hairline" / name).replace("data:application/javascript", "data:text/javascript") for name in HAIRLINE_FILES}
html = html.replace("<head>", "<head><script>window.__embedded=" + repr(embedded).replace("'", '"') + ";</script>", 1)
html = html.replace("r.src=e,", "r.src=(window.__embedded||{})[e]||e,", 1)

# Favicon inline; drop links that only make sense on a live host
html = re.sub(r'<link rel="icon" href="/favicon.svg"[^>]*>', f'<link rel="icon" href="{data_uri(DIST / "favicon.svg")}">', html)
html = re.sub(r'<link rel="sitemap"[^>]*>', "", html)

leftovers = sorted(set(re.findall(r'(?:src|href)="(/_astro/[^"]+)"', html)))
OUTPUT.write_text(html)
print(f"{OUTPUT} {OUTPUT.stat().st_size / 1e6:.1f} MB; unresolved local refs: {leftovers or 'none'}")
