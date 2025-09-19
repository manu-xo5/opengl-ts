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
