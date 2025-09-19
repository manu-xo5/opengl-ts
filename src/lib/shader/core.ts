import { createAndLinkProgram } from "../helper";
import { loadFile } from "../utils";
import { compileShader } from "./utils";

export class Shader {
    id: WebGLProgram;

    static async fromUrl(vshUrl: string, fshUrl: string) {
        const vshSrc = await loadFile(vshUrl);
        const fshSrc = await loadFile(fshUrl);

        return new Shader(vshSrc, fshSrc);
    }

    private constructor(vShSrc: string, fShSrc: string) {
        const vSh = compileShader(gl.VERTEX_SHADER, vShSrc);
        const fSh = compileShader(gl.FRAGMENT_SHADER, fShSrc);

        this.id = createAndLinkProgram(gl, [vSh, fSh]);
        gl.useProgram(this.id);
        const uLightPos = gl.getUniformLocation(this.id, "uLightPos");
        gl.uniform3fv(uLightPos, [10, 10, 2]);
        gl.deleteShader(vSh);
        gl.deleteShader(fSh);
    }

    use() {
        gl.useProgram(this.id);
    }

    deactivate() {
        gl.useProgram(null);
    }
}
