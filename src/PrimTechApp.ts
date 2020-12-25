
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
    lastTime: number;

    constructor() {
        super();

        // Grid for reference and development
        let grid = new THREE.GridHelper(1000, 1000);
        this.scene.add(grid);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // Lighting
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // POV point light
        let pointLight = new THREE.PointLight(0xffffff, 0.8);
        this.camera.add(pointLight);
        this.scene.add(this.camera);


        // Add trees
        let treeH = 10;
        let treeGeo = new THREE.CylinderBufferGeometry(0.5, 0.5, treeH, 10, 1, true);
        let treeMat = new THREE.MeshBasicMaterial({color: 0xa0522d});

        for(let i = 0; i < 50; i++) {
            let treeMesh = new THREE.Mesh(treeGeo, treeMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            treeMesh.position.set(rx, 5, rz);
            this.scene.add(treeMesh);
        }

        // Add rocks
        let rockGeo = new THREE.IcosahedronBufferGeometry(0.25, 0);
        let rockMat = new THREE.MeshBasicMaterial({color: 0x555555});

        for(let i = 0; i < 50; i++) {
            let rockMesh = new THREE.Mesh(rockGeo, rockMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            rockMesh.position.set(rx, 0, rz);
            this.scene.add(rockMesh);
        }

        // Add bushes

        // Ground
        const groundGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
        groundGeo.rotateX(-0.5*Math.PI);
        const groundMat = new THREE.MeshBasicMaterial({color: 0x74C365});
        const plane = new THREE.Mesh(groundGeo, groundMat);
        this.scene.add(plane);

        // Add controls
        this.controls = new MovementControls(this.camera, document.body);

        // Add stats
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // Last frame time
        this.lastTime = 0;

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
        let delta = time - this.lastTime;
        this.lastTime = time;
        this.stats.update();
        this.controls.update(delta);
        this.infoText.data = this.getCameraPositionStr();
        super.render();
    }

    private getCameraPositionStr(): string {
        let x = this.camera.position.x.toFixed(2);
        let y = this.camera.position.y.toFixed(2);
        let z = this.camera.position.z.toFixed(2);
        let pos = `X:${x} Y:${y} Z:${z}`;
        return pos;
    }

}

export { PrimTechApp };
