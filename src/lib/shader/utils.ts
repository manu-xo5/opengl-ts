export function compileShader(type: number, src: string) {
    const sh = gl.createShader(type);
    if (!sh) {
        throw new Error("Could not create shader");
    }
    gl.shaderSource(sh, src);
    gl.compileShader(sh);

    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error("Shader compile error: " + err);
    }

    return sh;
}
