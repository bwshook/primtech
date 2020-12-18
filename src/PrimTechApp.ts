// Third-Party modules
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

// Local modules
import { SceneManager } from "./SceneManager";
import { MovementControls } from "./MovementControls";

class PrimTechApp extends SceneManager {
    stats: Stats;
    infoText: Text;
    controls: MovementControls;

    constructor() {
        super();

        let grid = new THREE.GridHelper(10, 10);
        this.scene.add(grid);

        let box = new THREE.BoxGeometry();
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Mesh(box, material);
        this.scene.add(cube);

        // Add controls
        this.controls = new MovementControls(this.camera, document.body);

        // Add stats
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // Make info div
        let infoDiv = document.createElement("div");
        this.infoText = document.createTextNode("Primitive Technology Game");
        infoDiv.style.color = "white";
        infoDiv.style.position = "fixed";
        infoDiv.style.top = "0px";
        infoDiv.style.right = "10%";
        infoDiv.appendChild(this.infoText);
        document.body.appendChild(infoDiv);
        this.camera.position.set(0, 2, 10);
    }

    public update: FrameRequestCallback = (time: number) => {
        requestAnimationFrame(this.update);
        this.stats.update();
        this.controls.update(0.016);
        super.render();
    }
}

export { PrimTechApp };
