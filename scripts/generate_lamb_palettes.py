#!/usr/bin/env python3
"""Generate permanent, theme-aware variants of the user-approved Lamb illustration.

Only violet/purple linework is recolored. Skin, hair, shirt, transparency,
and dark eyes/nose/mouth retain their exact original RGBA pixels.
These PNGs are shipped with GitHub Pages and the signed Android APK;
no canvas, runtime filters, masks or redraws are used in the app.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "rosary-lamb-illustration.png"
OUTPUT = ROOT / "assets" / "rosary-lamb-palettes"

# Matches the actual outline values in rosary-colors.js. Classic uses
# light/dark ink; missionary uses section border; mystery uses each palette
# variant's light/dark outline. The filename is the RGB hex itself.
INKS = [
    "947960", "C3A982",                                    # Classic
    "23845E", "BD3948", "9BA19D", "365DAB", "D3AA22",        # Missionary
    "694C89", "B696D1", "A63F55", "DA92A0",                 # Dolorosos
    "A58025", "E9CB7D", "C9A232", "FFE29A",                 # Luminosos
    "4A9BC8", "8ACAE9", "266AA7", "8CBDEE",                 # Gozosos
    "929D99", "AEB6AF",                                    # Gloriosos
]


def clamp01(x):
    return max(0.0, min(1.0, x))


def themed_pixel(pixel, ink):
    r, g, b, a = pixel
    if not a:
        return pixel

    # Weight is continuous to preserve anti-aliasing along strokes.
    # Violet is blue above red, red above green. Brown hair and the
    # peach/cream fills do not qualify. Very dark (r~20-35) facial ink
    # remains unchanged, with a smooth transition for nearby shading.
    violet = min(
        clamp01((b - r - 2) / 14.0),
        clamp01((r - g - 2) / 12.0),
        clamp01((b - g - 10) / 18.0),
    )
    weight = violet * clamp01((r - 35) / 45.0)
    if weight <= 0:
        return pixel

    brightness = (r * 0.30 + g * 0.44 + b * 0.26) / (
        122 * 0.30 + 90 * 0.44 + 153 * 0.26
    )
    shade = min(1.60, max(0.52, brightness))
    rgb = tuple(
        round(old * (1.0 - weight) + min(255, tone * shade) * weight)
        for old, tone in zip((r, g, b), ink)
    )
    return (*rgb, a)


def main():
    src = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assert src.width >= 100 and src.height >= 150
    original = list(src.getdata())

    for color in INKS:
        ink = tuple(bytes.fromhex(color))
        result = [themed_pixel(px, ink) for px in original]
        changed = sum(px != opx for px, opx in zip(result, original))
        if not (100 < changed < len(original) // 2):
            raise RuntimeError(f"Unexpected contour segmentation {color}: {changed}")
        # Eye/nose/mouth dark strokes are invariant; all alpha is invariant.
        if not all(new[3] == old[3] for new, old in zip(result, original)):
            raise RuntimeError("Transparency changed")
        if not all(new == old for new, old in zip(result, original) if old[0] <= 35):
            raise RuntimeError("Dark facial ink changed")
        image = Image.new("RGBA", src.size)
        image.putdata(result)
        image.save(OUTPUT / f"ink-{color.lower()}.png", optimize=True)
        print(f"Saved {color} — {changed} contour pixels")

    assert len(set(INKS)) == len(INKS)
    print(f"Generated {len(INKS)} faithful contour variants.")


if __name__ == "__main__":
    main()
