// Local modules
import { PrimTechApp } from "./PrimTechApp";

const app = new PrimTechApp();

// Move these into the class (SceneManager)
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
