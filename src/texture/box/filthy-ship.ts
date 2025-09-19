import { loadImage } from "../../lib/utils";

export class Texture {
    ID: WebGLTexture | null = null;
    url: string;
    private src: ImageBitmap | null = null;

    constructor(url: string) {
        this.url = url;
    }

    async load(format: GLenum, internalFormat: GLenum, type: GLenum) {
        this.src = await loadImage(this.url);
        this.ID = gl.createTexture();

        if (!this.ID) {
            throw new Error("Could not create texture");
        }

        if (!this.ID) {
            throw new Error("Texture not created");
        }

        gl.bindTexture(gl.TEXTURE_2D, this.ID);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, this.src);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.bindTexture(gl.TEXTURE_2D, this.ID);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, this.src);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.ID);
    }
}

export const filthyShipTex = new Texture(
    "/filthy-space-panels-bl/filthy-space-panels_albedo.png",
);
