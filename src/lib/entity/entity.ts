import { mat4 } from "gl-matrix";
import { generateId } from "../utils";
import type { Mesh2 } from "../mesh/core";
import type { Texture } from "../texture";

export class Entity {
    id: string = generateId();
    model = mat4.create();

    mesh: Mesh2 | null = null;
    texture: Texture | null = null;
    program: WebGLProgram | null = null;

    render(delta: number) {
        if (!this.mesh) return;
        if (!this.program) return;

        void delta;

        this.mesh.bind(this.model, this.program);

        const uUseTexture = gl.getUniformLocation(this.program, "uUseTexture");
        if (this.texture) {
            this.texture.active(this.program);

            gl.uniform1i(uUseTexture, 1);
        } else {
            gl.uniform1i(uUseTexture, 0);

            const uColor = gl.getUniformLocation(this.program, "uColor");
            gl.uniform3fv(uColor, new Float32Array([1.0, 0.5, 0.0]));
        }

        this.mesh.draw();
    }
}
