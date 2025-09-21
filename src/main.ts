import { mat4 } from "gl-matrix";
import { Camera } from "./lib/camera/core";
import { Entity } from "./lib/entity/entity";
import { Canvas } from "./lib/canvas/core";
import { Mesh2 } from "./lib/mesh/core";
import { Shader } from "./lib/shader/core";
import "./style.css";
import { Texture } from "./lib/texture";
import { WinEvent } from "./lib/win-event";
import { LevelDemo } from "./lib/level/level-demo";

declare global {
    interface Window {
        gl: WebGL2RenderingContext;
    }

    const gl: WebGL2RenderingContext;
}

let x: Entity;
let y: LevelDemo;
let objs: Entity[] = [];
let camera = new Camera();
new Canvas("canvas");

async function main() {
    Shader.init(gl);
    Texture.init(gl);
    WinEvent.init();

    await Promise.all([
        Texture.fromImgUrl("space-panels", {
            albedo: "/textures/space-panels/albedo.png",
            normal: "/textures/space-panels/normal-ogl.png",
        }),
        Shader.fromUrl("basic", {
            vshUrl: "/shaders/basic.vert",
            fshUrl: "/shaders/basic.frag",
        }),
    ]);

    x = new Entity();
    x.program = Shader.get("basic").ID;
    x.mesh = await Mesh2.fromGlb("/terrain01-high2.glb", x.program);
    // x.texture = Texture.get("space-panels");
    //mat4.scale(x.model, x.model, [0.1, 0.1, 0.1]);
    // mat4.translate(x.model, x.model, [0, 0, 0]);

    y = await LevelDemo.create(x.program);
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

    const program = Shader.get("basic");
    program.use();
    program.renderLight();

    const viewLoc = gl.getUniformLocation(program.ID, "uView");
    gl.uniformMatrix4fv(viewLoc, false, camera.view);

    const projectionLoc = gl.getUniformLocation(program.ID, "uProjection");
    gl.uniformMatrix4fv(projectionLoc, false, camera.projection);

    for (const obj of objs) {
        obj.render(dt);
    }

    // x.render(dt);
    y.render(dt);

    requestAnimationFrame(draw);
}

main();
