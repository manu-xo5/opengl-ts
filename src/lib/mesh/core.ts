import { mat4 } from "gl-matrix";
import { createEBO, createVBO } from "../helper";
import type { TypedArray } from "three";
import { loadGlbFile } from "./utils";

export class Mesh2 {
    static async fromGlb(url: string, program: WebGLProgram) {
        const {
            pos: vertex,
            normal,
            index,
            uv,
            tangent,
        } = await loadGlbFile(url);
        return new Mesh2(vertex, normal, index, uv, tangent, program);
    }

    ID: WebGLVertexArrayObject;

    drawType: "elements" | "arrays";
    indexCount: number;

    constructor(
        vertex: TypedArray,
        normal: TypedArray,
        index: TypedArray | null,
        uv: TypedArray,
        tangent: TypedArray,
        program: WebGLProgram,
    ) {
        this.ID = gl.createVertexArray();
        gl.bindVertexArray(this.ID);

        const aPosition = gl.getAttribLocation(program, "aPosition");
        createVBO(aPosition, vertex, 3);

        const aNormal = gl.getAttribLocation(program, "aNormal");
        createVBO(aNormal, normal, 3);

        const aTexCoords = gl.getAttribLocation(program, "aTexCoords");
        createVBO(aTexCoords, uv, 2);

        const aTangent = gl.getAttribLocation(program, "aTangent");
        createVBO(aTangent, tangent, 4);


        if (index) {
            this.drawType = "elements";
            this.indexCount = index.length;
            createEBO(new Uint32Array(index));
        } else {
            this.drawType = "arrays";
            this.indexCount = vertex.length / 3;
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    bind(model: mat4, program: WebGLProgram) {
        gl.bindVertexArray(this.ID);

        const modelLoc = gl.getUniformLocation(program, "uModel");
        gl.uniformMatrix4fv(modelLoc, false, model);
    }

    draw() {
        if (this.drawType === "elements") {
            gl.drawElements(
                gl.TRIANGLES,
                this.indexCount,
                gl.UNSIGNED_INT,
                0,
            );
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.indexCount);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
    }
}
