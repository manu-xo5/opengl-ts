import { mat4 } from "gl-matrix";
import { generateId } from "../utils";
import type { Mesh2 } from "../mesh/core";

export class Entity {
    id: string = generateId();
    model = mat4.create();

    mesh: Mesh2 | null = null;
    program: WebGLProgram | null = null;

    render(delta: number) {
        if (!this.mesh) return;
        if (!this.program) return;

        void delta;

        this.mesh.draw(this.model, this.program);
    }
}
