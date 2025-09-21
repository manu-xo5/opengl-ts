import {
    GLTFLoader,
    type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Mesh, BufferGeometry, TypedArray } from "three";

const loader = new GLTFLoader();

export async function loadGlbFile(url: string) {
    const promise = new Promise<GLTF>((res, rej) => {
        loader.load(url, (gltf) => res(gltf), undefined, rej);
    });

    const gltf = await promise;

    const mesh = gltf.scene.children[0];
    console.log(gltf);

    const geometry = (mesh as Mesh).geometry as BufferGeometry;
    const pos = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    const uv = geometry.getAttribute("uv");
    const tangent = geometry.getAttribute("tangent");
    const index = geometry.index;

    console.log(
        index?.array instanceof Uint16Array
            ? "SHORT"
            : index?.array instanceof Uint32Array
              ? "INT"
              : "",
    );

    return {
        pos: pos.array,
        normal: normal.array,
        uv: uv.array,
        index: index ? index.array : null,
        tangent: tangent?.array ?? new Float32Array(),
    };
}

export function getMeshDims(vertices: TypedArray) {
    let minX = vertices[0];
    let maxX = vertices[0];
    let minY = vertices[1];
    let maxY = vertices[1];
    let minZ = vertices[2];
    let maxZ = vertices[2];

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    }

    return {
        width: maxX - minX,
        height: maxY - minY,
        depth: maxZ - minZ,
    };
}
