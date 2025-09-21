import { getMeshDims, loadGlbFile } from "../mesh/utils";
import { bilerp, generateHeightMap } from "../utils";
import { Entity } from "../entity/entity";
import { Mesh2 } from "../mesh/core";
import { getBounds } from "./utils";

export class LevelDemo extends Entity {
    static instance: LevelDemo | null = null;

    width: number = 0;
    depth: number = 0;

    hW = 0;
    hH = 0;
    heights = new Float32Array();

    bounds = {
        minX: 0,
        maxX: 0,
        minZ: 0,
        maxZ: 0,
    };

    static async create(program: WebGLProgram) {
        const level = new LevelDemo();
        level.program = program;

        const { pos, normal, uv, index, tangent } = await loadGlbFile(
            "/terrain01-high2.glb",
        );
        level.mesh = new Mesh2(pos, normal, index, uv, tangent, program);

        const { width, depth } = getMeshDims(pos);
        level.width = width;
        level.depth = depth;

        const heightsTex = await generateHeightMap(
            "/textures/terrain/height.png",
        );
        level.heights = heightsTex.heights;
        level.hW = heightsTex.width;
        level.hH = heightsTex.height;

        const bounds = getBounds(0, 0, width, depth);

        level.bounds = {
            minX: bounds.minX,
            maxX: bounds.maxX,
            minZ: bounds.minZ,
            maxZ: bounds.maxZ,
        };

        LevelDemo.instance = level;
        return level;
    }

    private constructor() {
        super();
    }

    private worldToHeightMap(x: number, z: number) {
        const tx = ((x - this.bounds.minX) / this.width) * (this.hW - 1);
        const tz = ((z - this.bounds.minZ) / this.depth) * (this.hH - 1);
        
        window.l = {
            tx,
            worldWidth: this.width,
            bounds: this.bounds.minX,
            hw: this.hW,
            x,
        }

        return { tx, tz };
    }

    private heightAt(ix: number, iz: number) {
        const cx = Math.max(0, Math.min(this.hW - 1, ix));
        const cz = Math.max(0, Math.min(this.hH - 1, iz));

        return this.heights[cz * this.hW + cx];
    }

    getHeightAt(x: number, z: number) {
        const { tx, tz } = this.worldToHeightMap(x, z);

        const ix = Math.floor(tx);
        const iz = Math.floor(tz);
        const fx = tx - ix;
        const fz = tz - iz;

        // Bilinear interpolation
        const h00 = this.heightAt(ix, iz);
        const h10 = this.heightAt(ix + 1, iz);
        const h01 = this.heightAt(ix, iz + 1);
        const h11 = this.heightAt(ix + 1, iz + 1);

        return bilerp(h00, h10, h01, h11, fx, fz);
    }
}
