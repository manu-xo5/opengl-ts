import { Texture } from "../box/filthy-ship";

const road1Tex2 = new Texture("/texture1.jpg");

export const road1Tex = {
    async load() {
        await road1Tex2.load(gl.RGB, gl.RGB, gl.UNSIGNED_BYTE);

        return road1Tex2.ID;
    },

    get() {
        return road1Tex2.ID;
    },
};
