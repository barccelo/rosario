#!/usr/bin/env python3
"""Color the *original high-resolution* approved Lamb of God illustration.

The image geometry is never redrawn; 420x600 RGBA pixels, alpha and all
facial features are identical in every theme. Only original purple-ink pixels
are replaced, including anti-aliased outline edges. No low-res resampling.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "rosary-lamb-approved-master.png"
OUTPUT = ROOT / "assets" / "rosary-lamb-palettes"

# The precise --rosario-lamb-ink tones used by rosary-colors.js.
INKS = [
    "947960", "C3A982",                                    # Classic
    "23845E", "BD3948", "9BA19D", "365DAB", "D3AA22",        # Missionary
    "694C89", "B696D1", "A63F55", "DA92A0",                 # Dolorosos
    "A58025", "E9CB7D", "C9A232", "FFE29A",                 # Luminosos
    "4A9BC8", "8ACAE9", "266AA7", "8CBDEE",                 # Gozosos
    "929D99", "AEB6AF",                                    # Gloriosos
]


def main():
    source = np.asarray(Image.open(SOURCE).convert("RGBA"))
    h, w = source.shape[:2]
    if (w, h) != (420, 600):
        raise RuntimeError(f"High-res master was replaced by {w}x{h}!")

    y, x = np.indices((h, w))
    r, g, b = source[:, :, :3].astype(np.float32).transpose(2, 0, 1)
    alpha = source[:, :, 3]

    # Only the small eyes, nose and mouth marks retain the dark original.
    # The silhouette around the face is OUTSIDE these masks and adapts to
    # the theme like the sleeve, shoulder, fist and elbow.
    facial_marks = (
        ((x >= 122) & (x <= 166) & (y >= 174) & (y <= 200)) |
        ((x >= 193) & (x <= 240) & (y >= 171) & (y <= 202)) |
        ((x >= 160) & (x <= 192) & (y >= 201) & (y <= 239)) |
        ((x >= 167) & (x <= 210) & (y >= 243) & (y <= 269))
    )

    # Unlike the previous scripts, this finds both light lavender outline
    # pixels AND the deeply shaded purple strokes, including alpha edges.
    # No partial overlays: every purple RGB pixel is *replaced* directly.
    purple_ink = (
        (b > r - 1) & (r > g + 1) & (b > g + 6) &
        ~facial_marks & (alpha > 0)
    )
    count = int(np.count_nonzero(purple_ink))
    if not 18000 <= count <= 35000:
        raise RuntimeError(f"Unexpected high-resolution stroke mask: {count}")

    # Maintain the approved light/dark hierarchy of outlines (e.g., the
    # raised arm still has its exact existing strokes, with no new lines).
    luminance = .299 * r + .44 * g + .261 * b
    shade = np.clip(luminance / 111.0, .42, 1.28)

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for color in INKS:
        target = np.array(list(bytes.fromhex(color)), dtype=np.float32)
        rgb = np.minimum(255, target[None, None, :] * shade[:, :, None])
        result = source.copy()
        result[:, :, :3][purple_ink] = rgb.astype(np.uint8)[purple_ink]

        if not np.array_equal(result[:, :, 3], alpha):
            raise RuntimeError(f"Transparency changed: {color}")
        if not np.array_equal(result[:, :, :3][facial_marks],
                              source[:, :, :3][facial_marks]):
            raise RuntimeError(f"Facial features changed: {color}")
        if not np.array_equal(result[:, :, :3][~purple_ink],
                              source[:, :, :3][~purple_ink]):
            raise RuntimeError(f"Non-outline pixels changed: {color}")

        # Non-purple themes must have zero pixels of the rejected purple
        # outline remaining outside the intentionally protected face.
        tr, tg, tb = tuple(bytes.fromhex(color))
        if not (tb > tr - 1 and tr > tg + 1 and tb > tg + 6):
            rr, gg, bb = result[:, :, :3].astype(np.float32).transpose(2, 0, 1)
            remaining = (
                (bb > rr - 1) & (rr > gg + 1) & (bb > gg + 6) &
                ~facial_marks & (alpha > 0)
            )
            if np.any(remaining):
                raise RuntimeError(f"Purple contamination in {color}")

        path = OUTPUT / f"ink-{color.lower()}.png"
        Image.fromarray(result, "RGBA").save(path, optimize=True)
        print(f"{path.name}: {w}x{h}, {count} original stroke pixels replaced")

    if len(set(INKS)) != 21:
        raise RuntimeError("Duplicate or missing palette")
    print("21 high-resolution illustrations: original contours and facial features verified.")


if __name__ == "__main__":
    main()
