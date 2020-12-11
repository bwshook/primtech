// Third-Party modules
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

// Local modules
import { SceneManager } from "./SceneManager";

class PrimTechApp extends SceneManager {
    stats: Stats;
    infoText: Text;
    controls: FirstPersonControls;

    constructor(container: HTMLDivElement, canvas: HTMLCanvasElement) {
        super(canvas);

        let grid = new THREE.GridHelper(10, 10);
        this.scene.add(grid);

        // Add FPS controls
        this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);

        // Add stats
        this.stats = Stats();
        container.appendChild(this.stats.dom);

        // Make info div
        let infoDiv = document.createElement("div");
        this.infoText = document.createTextNode("Hi there and greetings!");
        infoDiv.style.color = "white";
        infoDiv.style.position = "fixed";
        infoDiv.style.top = "0px";
        infoDiv.style.right = "10%";
        infoDiv.appendChild(this.infoText);
        container.appendChild(infoDiv);

        this.camera.position.set(0, 0, 10);
    }

    public update(): void {
        this.stats.update();
        this.controls.update(this.clock.getDelta());
        super.update()
    }
}

export { PrimTechApp };
