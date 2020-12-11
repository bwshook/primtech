// Local modules
import { PrimTechApp } from "./PrimTechApp";

const container = document.getElementById("canvasCont") as HTMLDivElement;
const canvas = document.getElementById("canvas3D") as HTMLCanvasElement;
const app = new PrimTechApp(container, canvas);

bindEventListeners();
update();

function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
}

function resizeCanvas() {
    app.onWindowResize();
}

function update() {
    requestAnimationFrame(update);
    app.update();
}
