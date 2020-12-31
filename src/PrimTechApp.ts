
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

    // Objects
    sun: THREE.Mesh;
    sky: THREE.Mesh;

    constructor() {
        super();

        // World Related Items
        this.setupLights();
        this.setupSky();

        for(let xi = -2; xi <= 2; xi++) {
            for(let zi = -2; zi <= 2; zi++) {
                this.setupChunk(xi, zi);
            }
        }

        this.camera.position.set(0, 2, 10);

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

        this.setupCursor();
    }

    private setupCursor() {
        // Cursor
        let cursorDiv = document.createElement("div");
        cursorDiv.style.width = "2px";
        cursorDiv.style.height = "20px";
        cursorDiv.style.backgroundColor = "white";
        cursorDiv.style.position = "fixed";
        cursorDiv.style.top = "50%";
        cursorDiv.style.left = "50%";
        cursorDiv.style.marginLeft = "-1px";
        cursorDiv.style.marginTop = "-10px";
        document.body.appendChild(cursorDiv);

        let cursorDiv2 = document.createElement("div");
        cursorDiv2.style.width = "20px";
        cursorDiv2.style.height = "2px";
        cursorDiv2.style.backgroundColor = "white";
        cursorDiv2.style.position = "fixed";
        cursorDiv2.style.top = "50%";
        cursorDiv2.style.left = "50%";
        cursorDiv2.style.marginLeft = "-10px";
        cursorDiv2.style.marginTop = "-1px";
        document.body.appendChild(cursorDiv2);
    }

    private setupLights() {
        // Scatter
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Sun
        const light = new THREE.HemisphereLight(0xffffff, 0x74C365, 0.8);
        light.rotateX(-Math.PI/4);
        this.scene.add(light);

        // POV point light
        let pointLight = new THREE.PointLight(0xffffff, 0.8);
        this.camera.add(pointLight);
        this.scene.add(this.camera);
    }

    private setupSky() {
        // Sky box
        let skyGeo = new THREE.BoxBufferGeometry(1000, 1000, 1000);
        let skyMat = new THREE.MeshBasicMaterial({color: 0x87CEEB, side: THREE.BackSide});
        this.sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.sky);
        // Sun
        let sunGeo = new THREE.IcosahedronBufferGeometry(20, 0);
        let sunMat = new THREE.MeshBasicMaterial({color: 0xfff47d});
        this.sun = new THREE.Mesh(sunGeo, sunMat);
        this.sun.translateY(400);
        this.scene.add(this.sun);
        // Fog
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 1000;
        this.scene.fog = new THREE.Fog(color, near, far);
    }

    private setupChunk(x: number, z: number) {
        this.setupGround(x, z);
        if(x == 0 && z == 0) {
            this.setupVegetation();
            this.setupRocks();
            this.setupSticks();
        }
    }

    private setupGround(x: number, z: number) {
        const groundGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
        groundGeo.rotateX(-0.5*Math.PI);
        const groundMat = new THREE.MeshBasicMaterial({color: 0x74C365});
        const plane = new THREE.Mesh(groundGeo, groundMat);
        plane.translateX(x*100);
        plane.translateZ(z*100);
        this.scene.add(plane);
    }

    private setupVegetation() {
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
    }

    private setupRocks() {
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
    }

    private setupSticks() {
        // Add sticks
        let stickGeo = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.5, 3, 1, false);
        let stickMat = new THREE.MeshStandardMaterial({color: 0xa0522d});

        for(let i = 0; i < 500; i++) {
            let stickMesh = new THREE.Mesh(stickGeo, stickMat);
            let rx = 100*Math.random()-50;
            let rz = 100*Math.random()-50;
            let sy = 5*Math.random()+1;
            stickMesh.scale.setY(sy);
            stickMesh.position.set(rx, 0, rz);
            stickMesh.rotateX(-Math.PI/2);
            stickMesh.rotateZ(Math.random()*2*Math.PI);
            this.scene.add(stickMesh);
        }
    }

    public update: FrameRequestCallback = (time: number) => {
        requestAnimationFrame(this.update);

        // Move sun and sky to camera position
        this.sun.position.copy(this.camera.position);
        this.sun.translateY(400);
        this.sky.position.copy(this.camera.position);

        let delta = time - this.lastTime;
        this.lastTime = time;
        this.stats.update();
        this.controls.update(delta);
        let info = this.getCameraPositionStr();
        if(this.controls.flyMode)
            info += " Fly Mode"
        else
            info += " Walk Mode"
        this.infoText.data = info;
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
