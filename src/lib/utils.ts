import UPNG from "upng-js";

export async function loadImage(src: string) {
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });

    const bitmap = createImageBitmap(img);
    img.remove();
    return bitmap;
}

export async function loadFile(src: string) {
    const res = await fetch(src);
    const text = await res.text();
    return text;
}

export function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

export function urlToFilename(url: string) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const extIndex = filename.lastIndexOf(".");
    return filename.substring(0, extIndex);
}

export async function generateHeightMap(imgUrl: string) {
    const arrayBuffer = await fetch(imgUrl).then((res) => res.arrayBuffer());

    const img = UPNG.decode(arrayBuffer);
    const rgba16 = new Uint8Array(UPNG.toRGBA8(img)[0]);

    const width = img.width;
    const height = img.height;
    const heights = new Float32Array(width * height);
    const maxWorldHeight = 100;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // combine R+G to reconstruct 16-bit value if stored as 2 bytes
            const value16 = (rgba16[i] << 8) | rgba16[i + 1];
            heights[y * width + x] = (value16 / 65535) * maxWorldHeight;
        }
    }

    return { heights, width, height };
}

export function bilerp(
    h00: number,
    h10: number,
    h01: number,
    h11: number,
    fx: number,
    fz: number,
) {
    const h0 = h00 * (1 - fx) + h10 * fx;
    const h1 = h01 * (1 - fx) + h11 * fx;
    return h0 * (1 - fz) + h1 * fz;
}
