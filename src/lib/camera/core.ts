import { mat4, vec3 } from "gl-matrix";
import { CameraRigidBody } from "./rigid";

export class Camera {
    view: mat4 = mat4.create();
    projection: mat4 = mat4.create();

    speed = 100;
    SENS_FACTOR = 0.001;
    sensitivity = 1.5 * this.SENS_FACTOR;

    yaw = 0;
    pitch = 0;

    rigid = new CameraRigidBody();

    constructor() {
        mat4.perspectiveNO(
            this.projection,
            45,
            innerWidth / innerHeight,
            0.1,
            10000,
        );
    }

    onMouseMove(dX: number, dY: number) {
        this.yaw += dX * this.sensitivity;
        this.pitch -= dY * this.sensitivity;

        const limit = Math.PI / 2 - 0.01;

        this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
    }

    update({ dt }: { dt: number }) {
        this.rigid.onUpdate({ dt });

        const position = this.rigid.position;
        const dir = this.rigid.dir;

        mat4.lookAt(this.view, position, dir, [0, 1, 0]);
    }
}
