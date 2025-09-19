import {
    GLTFLoader,
    type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Mesh, BufferGeometry } from "three";

const loader = new GLTFLoader();

export async function loadGlbFile(url: string) {
    const promise = new Promise<GLTF>((res, rej) => {
        loader.load(url, (gltf) => res(gltf), undefined, rej);
    });

    const gltf = await promise;

    const mesh = gltf.scene.children[0];

    const geometry = (mesh as Mesh).geometry as BufferGeometry;
    const pos = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    const uv = geometry.getAttribute("uv");
    const tangent = geometry.getAttribute("tangent");
    const index = geometry.index;

    return {
        pos: pos.array,
        normal: normal.array,
        uv: uv.array,
        index: index ? index.array : null,
        tangent: tangent ? tangent.array : null,
    };
}
