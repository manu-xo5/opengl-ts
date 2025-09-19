import { createAndLinkProgram } from "./lib/helper";
import { Mesh } from "./lib/mesh/core";
import { getShaders, loadShaders } from "./lib/shader/core";

export const triangles: Mesh[] = [];

export async function helloTriangleLoad() {
    const teapot = await Mesh.fromUrl("/teapot.obj", program);

    // const texCoords = new Float32Array(...);

    triangles.push(teapot);
}
