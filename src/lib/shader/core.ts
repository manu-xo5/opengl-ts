import { mat4, vec3 } from "gl-matrix";
import { createAndLinkProgram, createEBO, createVBO } from "../helper";
import { loadFile } from "../utils";
import { compileShader } from "./utils";

export class Shader {
    private static gl: WebGL2RenderingContext | null = null;
    private static cache: Record<string, Shader> = {};

    static init(gl: WebGL2RenderingContext) {
        Shader.gl = gl;
    }

    static async fromUrl(
        name: string,
        { vshUrl, fshUrl }: { vshUrl: string; fshUrl: string },
    ) {
        if (!Shader.gl) {
            throw new Error("Shader.gl not initialized");
        }

        const vShSrc = await loadFile(vshUrl);
        const fShSrc = await loadFile(fshUrl);

        const shader = new Shader(Shader.gl, { vShSrc, fShSrc });
        Shader.cache[name] = shader;
    }

    static get(name: string) {
        const program = Shader.cache[name];
        if (!program) {
            throw new Error("Shader not found");
        }

        return program;
    }

    lightPos: vec3 = vec3.fromValues(10, 10, 2);
    vao: WebGLVertexArrayObject;

    ID: WebGLProgram;
    private constructor(
        gl: WebGL2RenderingContext,
        { vShSrc, fShSrc }: { vShSrc: string; fShSrc: string },
    ) {
        const vSh = compileShader(gl.VERTEX_SHADER, vShSrc);
        const fSh = compileShader(gl.FRAGMENT_SHADER, fShSrc);

        this.ID = createAndLinkProgram(gl, [vSh, fSh]);
        gl.deleteShader(vSh);
        gl.deleteShader(fSh);

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const aPosition = gl.getAttribLocation(this.ID, "aPosition");
        createVBO(
            aPosition,
            new Float32Array([
                // front face
                -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
                // back face
                -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
                // left face
                -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
                // right face
                1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
                // top face
                -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
                // bottom face
                -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
            ]),
            3,
        );

        createEBO(
            new Uint16Array([
                0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13,
                14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
            ]),
        );
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    use() {
        gl.useProgram(this.ID);
        const uLightPos = gl.getUniformLocation(this.ID, "uLightPos");
        gl.uniform3fv(uLightPos, this.lightPos);
    }

    renderLight() {
        gl.bindVertexArray(this.vao);

        const modelLoc = gl.getUniformLocation(this.ID, "uModel");

        const offset = vec3.create();
        vec3.sub(offset, this.lightPos, [0, 0, 0]);

        const rot = mat4.create();
        mat4.rotate(rot, rot, 0.01, [0, 1, 0]);

        vec3.transformMat4(offset, offset, rot);
        vec3.add(this.lightPos, [0, 0, 0], offset);

        const model = mat4.create();
        mat4.translate(model, model, this.lightPos);
        mat4.scale(model, model, [0.4, 0.4, 0.4]);

        gl.uniformMatrix4fv(modelLoc, false, model);

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    deactivate() {
        gl.useProgram(null);
    }
}
