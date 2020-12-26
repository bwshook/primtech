
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
        //let grid = new THREE.GridHelper(1000, 1000);
        //this.scene.add(grid);

        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // Lighting
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Sun
        const light = new THREE.HemisphereLight(0xffffff, 0x74C365, 0.8);
        light.rotateX(-Math.PI/4);
        this.scene.add(light);

        // Skybox
        let skyGeo = new THREE.BoxBufferGeometry(1000, 1000, 1000);
        let skyMat = new THREE.MeshBasicMaterial({color: 0x87CEEB, side: THREE.BackSide});
        let skyMesh = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(skyMesh);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
        groundGeo.rotateX(-0.5*Math.PI);
        const groundMat = new THREE.MeshBasicMaterial({color: 0x74C365});
        const plane = new THREE.Mesh(groundGeo, groundMat);
        this.scene.add(plane);

        // POV point light
        //let pointLight = new THREE.PointLight(0xffffff, 0.8);
        //this.camera.add(pointLight);
        //this.scene.add(this.camera);

        // Add trees and bushes
        let treeH = 15;
        let treeGeo = new THREE.CylinderBufferGeometry(0.2, 0.5, treeH, 5, 1, true);
        let treeMat = new THREE.MeshStandardMaterial({color: 0xa0522d});

        let treeTopGeo = new THREE.IcosahedronBufferGeometry(5, 0);
        let treeTopMat = new THREE.MeshStandardMaterial({color: 0x1F3D0C});

        let bushGeo = new THREE.IcosahedronBufferGeometry(0.5, 0);
        let bushMat = new THREE.MeshStandardMaterial({color: 0x1F3D0C});
        const maxBushes = 5;

        for(let i = 0; i < 50; i++) {
            let treeMesh = new THREE.Mesh(treeGeo, treeMat);
            let treeTopMesh = new THREE.Mesh(treeTopGeo, treeTopMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            treeMesh.position.set(rx, treeH/2, rz);
            treeTopMesh.position.set(rx, 0.9*treeH, rz);
            this.scene.add(treeMesh);
            this.scene.add(treeTopMesh);
            for(let b = 0; b < Math.random()*maxBushes; b++) {
                let bushMesh = new THREE.Mesh(bushGeo, bushMat);
                let bx = (9*Math.random()+1)-5;
                let bz = (9*Math.random()+1)-5;
                bushMesh.position.set(rx+bx, 0.4, rz+bz);
                bushMesh.scale.set(1, Math.random()+1, 1);
                this.scene.add(bushMesh);
            }
        }

        // Add rocks
        let rockGeo = new THREE.IcosahedronBufferGeometry(0.5, 0);
        let rockMat = new THREE.MeshStandardMaterial({color: 0x555555});

        for(let i = 0; i < 200; i++) {
            let rockMesh = new THREE.Mesh(rockGeo, rockMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            rockMesh.position.set(rx, 0, rz);
            let s = Math.random()+1
            rockMesh.scale.set(s, s, s);
            this.scene.add(rockMesh);
        }

        // Add sticks
        let stickGeo = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.5, 3, 1, false);
        let stickMat = new THREE.MeshStandardMaterial({color: 0xa0522d});

        for(let i = 0; i < 500; i++) {
            let stickMesh = new THREE.Mesh(stickGeo, stickMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            stickMesh.position.set(rx, 0, rz);
            stickMesh.rotateX(-Math.PI/2);
            stickMesh.rotateZ(Math.random()*2*Math.PI);
            this.scene.add(stickMesh);
        }

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
