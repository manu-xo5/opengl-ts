import { mat4, vec3 } from "gl-matrix";

export class Camera {
    position = vec3.fromValues(0, 2, 30);

    view: mat4 = mat4.create();
    projection: mat4 = mat4.create();

    speed = 10;
    SENS_FACTOR = 0.001;
    sensitivity = 1.5 * this.SENS_FACTOR;

    yaw = 0;
    pitch = 0;

    private keys: Set<string> = new Set();

    constructor() {
        mat4.perspectiveNO(
            this.projection,
            45,
            innerWidth / innerHeight,
            0.1,
            100,
        );

        window.addEventListener("keydown", (e) =>
            this.keys.add(e.key.toLowerCase()),
        );
        window.addEventListener("keyup", (e) =>
            this.keys.delete(e.key.toLowerCase()),
        );
        window.addEventListener("mousemove", (e) =>
            this.onMouseMove(e.movementX, e.movementY),
        );
        window.addEventListener("wheel", (e) => {
            const forward: vec3 = vec3.fromValues(
                Math.cos(this.pitch) * Math.sin(this.yaw),
                Math.sin(this.pitch),
                -Math.cos(this.pitch) * Math.cos(this.yaw),
            );
            vec3.normalize(forward, forward);

            const step = 0.3;
            if (e.deltaY < 0) {
                vec3.scaleAndAdd(this.position, this.position, forward, step);
            } else {
                vec3.scaleAndAdd(this.position, this.position, forward, -step);
            }
        });
    }

    onMouseMove(dX: number, dY: number) {
        this.yaw += dX * this.sensitivity;
        this.pitch -= dY * this.sensitivity;

        const limit = Math.PI / 2 - 0.01;

        this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
    }

    update({ dt }: { dt: number }) {
        const forward: vec3 = vec3.fromValues(
            Math.cos(this.pitch) * Math.sin(this.yaw),
            Math.sin(this.pitch),
            -Math.cos(this.pitch) * Math.cos(this.yaw),
        );

        const right: vec3 = vec3.fromValues(
            Math.cos(this.yaw),
            0,
            Math.sin(this.yaw),
        );

        const move = vec3.create();

        if (this.keys.has("w"))
            vec3.add(
                move,
                move,
                vec3.fromValues(Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
            );

        if (this.keys.has("s"))
            vec3.sub(
                move,
                move,
                vec3.fromValues(Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
            );

        if (this.keys.has("a")) vec3.sub(move, move, right);

        if (this.keys.has("d")) vec3.add(move, move, right);

        if (this.keys.has(" ")) vec3.add(move, move, [0, 1, 0]);
        if (this.keys.has("control")) vec3.sub(move, move, [0, 1, 0]);

        if (vec3.length(move) > 0) {
            vec3.normalize(move, move);
            vec3.scaleAndAdd(
                this.position,
                this.position,
                move,
                this.speed * dt,
            );
        }

        const dir = vec3.create();
        vec3.add(dir, this.position, forward);

        mat4.lookAt(this.view, this.position, dir, [0, 1, 0]);
    }
}
