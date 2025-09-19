export class VAO {
    id: WebGLVertexArrayObject;

    constructor() {
        this.id = gl.createVertexArray();
    }

    bind() {
        gl.bindVertexArray(this.id);
    }
    unbind() {
        gl.bindVertexArray(null);
    }

    bindArrayBuffer(srcData: AllowSharedBufferSource | null, usage: GLenum) {
        this.bind();

        const vbo = gl.createBuffer();
        if (!vbo) {
            throw new Error("Could not create VBO");
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, srcData, usage);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.unbind();

        return vbo;
    }

    bindElementBuffer(srcData: AllowSharedBufferSource | null, usage: GLenum) {
        this.bind();

        const vbo = gl.createBuffer();
        if (!vbo) {
            throw new Error("Could not create VBO");
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, srcData, usage);

        this.unbind();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return vbo;
    }
}
