import { loadImage } from "./utils";

export class Texture {
    private static cache: Record<string, Texture> = {};

    static gl: WebGL2RenderingContext | null = null;
    static init(gl: WebGL2RenderingContext) {
        Texture.gl = gl;
    }

    static async fromImgUrl(
        name: string,
        { albedo, normal }: { albedo: string; normal: string },
    ) {
        if (!Texture.gl) {
            throw new Error("Texture.gl not initialized");
        }

        const textureImg = await loadImage(albedo);
        const normalImg = await loadImage(normal);

        const texture = new Texture(Texture.gl, {
            albedo: textureImg,
            normal: normalImg,
        });

        Texture.cache[name] = texture;
    }

    static get(url: string) {
        if (!Texture.cache[url]) {
            throw new Error("Texture not found");
        }

        return Texture.cache[url];
    }

    ID: WebGLTexture;
    normal_id: WebGLTexture | null = null;

    constructor(
        gl: WebGL2RenderingContext,
        { albedo, normal }: { albedo: ImageBitmap; normal: ImageBitmap },
        {
            internalFormat = gl.RGB,
            format = gl.RGB,
            type = gl.UNSIGNED_BYTE,
        }: {
            internalFormat?: GLenum;
            format?: GLenum;
            type?: GLenum;
        } = {},
    ) {
        this.ID = gl.createTexture();

        if (!this.ID) {
            throw new Error("Could not create texture");
        }

        gl.bindTexture(gl.TEXTURE_2D, this.ID);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, albedo);

        gl.generateMipmap(gl.TEXTURE_2D);

        {
            this.normal_id = gl.createTexture();
            if (!this.normal_id) {
                throw new Error("Could not create texture");
            }

            gl.bindTexture(gl.TEXTURE_2D, this.normal_id);

            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGB,
                gl.RGB,
                gl.UNSIGNED_BYTE,
                normal,
            );
        }

        for (const tex_id of [this.ID, this.normal_id]) {
            if (!tex_id) continue;

            gl.bindTexture(gl.TEXTURE_2D, tex_id);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    active(program: WebGLProgram) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.ID);

        const uSampler = gl.getUniformLocation(program, "uSampler");
        gl.uniform1i(uSampler, 0);

        if (this.normal_id) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.normal_id);

            const uNormalMap = gl.getUniformLocation(program, "uNormalMap");
            gl.uniform1i(uNormalMap, 1);
        }
    }
}
