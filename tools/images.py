#!/usr/bin/env python3
"""Optimise les images du site.

Entrée : src/images/*.jpg (photos d'origine, n'importe quelle taille)
Sortie : src/static/img/<nom>-<largeur>.avif + .webp (jusqu'à 4 largeurs) + src/data/images.json
         AVIF = format le plus léger (navigateurs récents) ; WebP = solution de repli universelle.
Usage  : python3 tools/images.py   (nécessite Pillow ≥ 11.3 : pip install pillow)
"""
import json, pathlib
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "src/images", ROOT / "src/static/img"
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("*"):
    old.unlink()
WIDTHS = (320, 480, 800, 1280)   # miniature · mobile · carte / tablette · grand écran
manifest = {}

for path in sorted(SRC.glob("*.jpg")):
    key = path.stem
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if key == "logo-fmb":
        for size in (96, 192):
            im.resize((size, size), Image.LANCZOS).save(OUT / f"logo-{size}.webp", quality=90, method=6)
        for size in (180, 192, 512):
            im.resize((size, size), Image.LANCZOS).save(OUT / f"icon-{size}.png", optimize=True)
        im.resize((48, 48), Image.LANCZOS).save(ROOT / "src/static/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
        continue
    widths = [w for w in WIDTHS if w <= im.width]
    if not widths or (im.width < 1280 and im.width not in widths and im.width - widths[-1] > 100):
        widths.append(im.width)
    for w in widths:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"{key}-{w}.webp", quality=70 if w <= 800 else 62, method=6)
        r.save(OUT / f"{key}-{w}.avif", quality=54 if w <= 800 else 48, speed=3)
    big = widths[-1]
    manifest[key] = {"w": big, "h": round(im.height * big / im.width), "widths": widths}

# Image de partage sur les réseaux sociaux (1200 × 630)
og = ImageOps.fit(Image.open(SRC / "qm3-bleu-avant.jpg").convert("RGB"), (1200, 630), Image.LANCZOS, centering=(0.5, 0.55))
og.save(OUT / "og-default.jpg", quality=82, optimize=True, progressive=True)

(ROOT / "src/data/images.json").write_text(json.dumps(manifest, indent=2) + "\n")
total = sum(f.stat().st_size for f in OUT.glob("*")) / 1024 / 1024
print(f"{len(manifest)} images optimisées (AVIF + WebP) → {OUT.relative_to(ROOT)} · {total:.1f} Mo au total")
