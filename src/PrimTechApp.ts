// Third-Party modules
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
//import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Local modules
import { SceneManager } from "./SceneManager";

class PrimTechApp extends SceneManager {
    stats: Stats;
    infoText: Text;
    controls: OrbitControls;

    constructor() {
        super();
        let grid = new THREE.GridHelper(10, 10);
        this.scene.add(grid);

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Add stats
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // Make info div
        let infoDiv = document.createElement("div");
        this.infoText = document.createTextNode("Hi there and greetings!");
        infoDiv.style.color = "white";
        infoDiv.style.position = "fixed";
        infoDiv.style.top = "0px";
        infoDiv.style.right = "10%";
        infoDiv.appendChild(this.infoText);
        document.body.appendChild(infoDiv);

        this.camera.position.set(0, 0, 10);
        //this.controls.lock();
    }

    public update(): void {
        this.stats.update();
        this.controls.update();
        super.update()
    }
}

export { PrimTechApp };
