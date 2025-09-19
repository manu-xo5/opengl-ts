import { mat4 } from "gl-matrix";
import { Camera } from "./lib/camera/core";
import { Entity } from "./lib/entity/entity";
import { Canvas } from "./lib/canvas/core";
import { Mesh2 } from "./lib/mesh/core";
import { Shader } from "./lib/shader/core";
import "./style.css";
import { filthyShipTex } from "./texture/box/filthy-ship";

declare global {
    interface Window {
        gl: WebGL2RenderingContext;
    }

    const gl: WebGL2RenderingContext;
}

let x: Entity;
let program: Shader;
let objs: Entity[] = [];
let camera = new Camera();
new Canvas("canvas");

async function main() {
    program = await Shader.fromUrl(
        "/shaders/basic.vert",
        "/shaders/basic.frag",
    );

    x = new Entity();
    x.program = program.id;

    x.mesh = await Mesh2.fromGlb("/box01.glb", x.program);
    await filthyShipTex.load(gl.RGB, gl.RGB, gl.UNSIGNED_BYTE);
    x.mesh.texture = filthyShipTex.ID;

    mat4.translate(x.model, x.model, [0, -2, 5]);

    draw(0);
}

let lastTime = 0;
function draw(now: number) {
    gl.clearColor(0.392, 0.584, 0.929, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // convert to seconds
    now *= 0.001;
    const dt = now - lastTime;
    lastTime = now;

    camera.update({ dt });

    program.use();
    const viewLoc = gl.getUniformLocation(program.id, "uView");
    gl.uniformMatrix4fv(viewLoc, false, camera.view);

    const projectionLoc = gl.getUniformLocation(program.id, "uProjection");
    gl.uniformMatrix4fv(projectionLoc, false, camera.projection);

    for (const obj of objs) {
        obj.render(dt);
    }

    x.render(dt);

    requestAnimationFrame(draw);
}

main();
