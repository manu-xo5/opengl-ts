
export function createAndLinkProgram(
    gl: WebGL2RenderingContext,
    shaders: WebGLShader[],
    name?: string,
) {
    const program = gl.createProgram();
    for (const sh of shaders) {
        gl.attachShader(program, sh);
    }

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const err = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Program link error (${name ?? "unknown"}):` + err);
    }

    return program;
}

export function createVBO(
    loc: GLint,
    srcData: AllowSharedBufferSource | null,
    size: number,
    usage: GLenum = gl.STATIC_DRAW,
) {
    const vbo = gl.createBuffer();
    if (!vbo) {
        throw new Error("Could not create VBO");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, srcData, usage);

    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(loc);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

export function createEBO(
    srcData: AllowSharedBufferSource | null,
    usage: GLenum = gl.STATIC_DRAW,
) {
    const ebo = gl.createBuffer();
    if (!ebo) {
        throw new Error("Could not create VBO");
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, srcData, usage);

    return ebo;
}
