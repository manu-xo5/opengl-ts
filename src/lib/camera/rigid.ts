import { vec3 } from "gl-matrix";
import { WinEvent } from "../win-event";
import { LevelDemo } from "../level/level-demo";

export class CameraRigidBody {
    position = vec3.fromValues(0, -10, 0);

    dir = vec3.create();
    yaw = 0;
    pitch = 0;

    moveSpeed = 100;
    SENS_FACTOR = 0.001;
    sensitivity = 1.5 * this.SENS_FACTOR;

    gravity = vec3.fromValues(0, -5, 0);

    constructor() {
        window.addEventListener("mousemove", (e) => {
            const dX = e.movementX;
            const dY = e.movementY;

            this.yaw += dX * this.sensitivity;
            this.pitch -= dY * this.sensitivity;

            const limit = Math.PI / 2 - 0.01;

            this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
        });
    }

    onUpdate({ dt }: { dt: number }) {
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

        if (WinEvent.has("w"))
            vec3.add(
                move,
                move,
                vec3.fromValues(Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
            );

        if (WinEvent.has("s"))
            vec3.sub(
                move,
                move,
                vec3.fromValues(Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
            );

        if (WinEvent.has("a")) vec3.sub(move, move, right);
        if (WinEvent.has("d")) vec3.add(move, move, right);

        if (WinEvent.has(" ")) vec3.add(move, move, vec3.fromValues(0, 10, 0));

        if (WinEvent.has("control"))
            vec3.sub(move, move, vec3.fromValues(0, 10, 0));

        if (vec3.length(move) > 0) {
            vec3.normalize(move, move);
            vec3.scaleAndAdd(
                this.position,
                this.position,
                move,
                this.moveSpeed * dt,
            );
        }

        window.camera = {
            x: this.position[0],
            y: this.position[1],
            z: this.position[2],
        }

        const levelDemo = LevelDemo.instance;
        if (levelDemo) {
            let ly =
                levelDemo.getHeightAt(this.position[0], this.position[2]);
            window.ly = ly;

            ly = ly || 0;
            if (this.position[1] > ly) {
                vec3.add(this.position, this.position, this.gravity);
            } else if (this.position[1] !== ly) {
                // snap to ground
                this.position[1] = ly;
            }
                this.position[1] = ly;
        }

        // if (WinEvent.has(" ")) {
        //     vec3.scaleAndAdd(this.position, this.position, this.gravity, -3);
        // } else if (this.position[1] > 0) {
        //     vec3.add(this.position, this.position, this.gravity);
        // }

        vec3.add(this.dir, this.position, forward);
    }
}
