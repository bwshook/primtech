
// Third-Party modules
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { Sky } from "three/examples/jsm/objects/Sky";
import { MersenneTwister19937 } from "random-js"
import { real } from "random-js"
import { integer } from "random-js";

// Local modules
import { SceneManager } from "./SceneManager";
import { MovementControls } from "./MovementControls";

class PrimTechApp extends SceneManager {
    stats: Stats;
    infoText: Text;
    controls: MovementControls;
    lastTime: number;
    groundPlane: THREE.Mesh;
    rng: MersenneTwister19937;

    // Objects
    sun: THREE.Vector3;
    sky: Sky;

    constructor() {
        super();

        // Seed RNG
        this.rng = MersenneTwister19937.seed(100);

        // World Related Items
        this.setupSky();

        //this.setupLandscapePrimitives();
        this.setupGround();
        this.setupVegetation();
        this.setupRocks();
        this.setupSticks();

        const chunkRadius = 2;
        for(let xi = -chunkRadius; xi <= chunkRadius; xi++) {
            for(let zi = -chunkRadius; zi <= chunkRadius; zi++) {
                this.loadChunk(xi, zi);
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

        // Make fire
        const light = new THREE.PointLight(0xFF8100, 1, 40);
        light.position.set(5, 1, 5);
        this.scene.add(light);
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

    private setupSky() {
        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);
        let theta = -90.0*(Math.PI/180.0);
        this.sun = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
        const uniforms = this.sky.material.uniforms;
        uniforms["turbidity"].value = 1.0;
        uniforms["rayleigh"].value = 1.0;
        uniforms["mieCoefficient"].value = 0.005;
        uniforms["mieDirectionalG"].value = 0.7;
        uniforms[ "sunPosition" ].value.copy(this.sun);

        // Sun Light
        let currentBright = 1.25*Math.max(0, 2.0*theta/Math.PI) + 0.05;
        const light = new THREE.HemisphereLight(0xffffff, 0x74C365, currentBright);
        //const light = new THREE.HemisphereLight(0xfdb353, 0x74C365, 0.3);
        light.position.copy(this.sun);
        this.scene.add(light);
    }

    private loadChunk(x: number, z: number) {
        const chunkGround = this.groundPlane.clone();
        //chunkGround.material.color.setRGB(Math.random(), Math.random(), Math.random());
        chunkGround.translateX(100*x);
        chunkGround.translateZ(100*z);
        this.scene.add(chunkGround);
    }

    private setupGround() {
        const groundGeo = new THREE.PlaneGeometry(100, 100, 2, 2);
        groundGeo.rotateX(-0.5*Math.PI);
        const groundMat = new THREE.MeshStandardMaterial();
        groundMat.color.setHex(0x74C365);
        //groundMat.wireframe = true;
        this.groundPlane = new THREE.Mesh(groundGeo, groundMat);
    }

    private setupVegetation() {
        // Add trees and bushes
        let treeH = 15;
        let treeGeo = new THREE.CylinderBufferGeometry(0.2, 0.5, treeH, 8, 4, true);
        let treeMat = new THREE.MeshStandardMaterial({color: 0xa0522d});

        let treeTopGeo = new THREE.IcosahedronBufferGeometry(5, 0);
        let treeTopMat = new THREE.MeshStandardMaterial({color: 0x1F3D0C});

        let bushGeo = new THREE.IcosahedronBufferGeometry(0.5, 0);
        let bushMat = new THREE.MeshStandardMaterial({color: 0x1F3D0C});
        const numBushDist = integer(0, 5);
        const bushDist = real(-4, 5);
        const bushScaleDist = real(1, 2);

        //rand(-50, 50)
        const treeDist = real(-50, 50);
        for(let i = 0; i < 50; i++) {
            let treeMesh = new THREE.Mesh(treeGeo, treeMat);
            let treeTopMesh = new THREE.Mesh(treeTopGeo, treeTopMat);
            let rx = treeDist(this.rng);
            let rz = treeDist(this.rng);
            treeMesh.position.set(rx, treeH/2, rz);
            treeTopMesh.position.set(rx, 0.9*treeH, rz);
            this.scene.add(treeMesh);
            this.scene.add(treeTopMesh);
            for(let b = 0; b < numBushDist(this.rng); b++) {
                let bushMesh = new THREE.Mesh(bushGeo, bushMat);
                let bx = bushDist(this.rng);
                let bz = bushDist(this.rng);
                bushMesh.position.set(rx+bx, 0.4, rz+bz);
                bushMesh.scale.set(1, bushScaleDist(this.rng), 1);
                this.scene.add(bushMesh);
            }
        }
    }

    private setupRocks() {
        // Add rocks
        let rockGeo = new THREE.IcosahedronBufferGeometry(0.5, 0);
        let rockMat = new THREE.MeshStandardMaterial({color: 0x555555});
        const rockDist = real(-50, 50);
        const rockScaleDist = real(1, 2);

        for(let i = 0; i < 200; i++) {
            let rockMesh = new THREE.Mesh(rockGeo, rockMat);
            let rx = rockDist(this.rng);
            let rz = rockDist(this.rng);
            rockMesh.position.set(rx, 0, rz);
            let s = rockScaleDist(this.rng);
            rockMesh.scale.set(s, s, s);
            this.scene.add(rockMesh);
        }
    }

    private setupSticks() {
        // Add sticks
        let stickGeo = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.5, 3, 1, false);
        let stickMat = new THREE.MeshStandardMaterial({color: 0xa0522d});
        const stickDist = real(-50, 50);
        const stickLengthDist = real(1, 5);
        const stickRotDist = real(0, 2*Math.PI);

        for(let i = 0; i < 500; i++) {
            let stickMesh = new THREE.Mesh(stickGeo, stickMat);
            let rx = stickDist(this.rng);
            let rz = stickDist(this.rng);
            let sy = stickLengthDist(this.rng);
            stickMesh.scale.setY(sy);
            stickMesh.position.set(rx, 0, rz);
            stickMesh.rotateX(-Math.PI/2);
            stickMesh.rotateZ(stickRotDist(this.rng));
            this.scene.add(stickMesh);
        }
    }

    public update: FrameRequestCallback = (time: number) => {
        requestAnimationFrame(this.update);

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
