export class Canvas {
    width: number = 1;
    height: number = 1;
    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;

    constructor(htmlId: string) {
        const canvas = document.getElementById(
            htmlId,
        ) as HTMLCanvasElement | null;

        if (!canvas) {
            throw new Error("Could not find canvas element");
        }

        const gl = canvas.getContext("webgl2");
        if (!gl) {
            throw new Error("Could not get WebGL2 context");
        }

        this.canvas = canvas;
        this.gl = gl;

        canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
        });

        window.addEventListener("resize", () => this.onResize());
        this.onResize();

        window.gl = gl;
    }

    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    onResize() {
        this.width = window.innerWidth * 0.99;
        this.height = window.innerHeight * 0.99;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.gl.viewport(0, 0, this.width, this.height);
    }
}
