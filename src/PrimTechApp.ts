
// Third-Party modules
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { Sky } from "three/examples/jsm/objects/Sky";
import { MersenneTwister19937 } from "random-js"

// Local modules
import { SceneManager } from "./SceneManager";
import { MovementControls } from "./MovementControls";
import { ChunkManager } from "./ChunkManager";
import { EntityManager } from "./EntityManager";

export class PrimTechApp extends SceneManager {
    stats: Stats;
    infoText: Text;
    controls: MovementControls;
    lastTime: number;
    rng: MersenneTwister19937;

    chunkManager: ChunkManager;

    // Objects
    sunLight: THREE.HemisphereLight;
    sunAngle: number;
    sky: Sky;

    constructor() {
        super();

        // Create PRNG
        this.rng = MersenneTwister19937.seed(100);

        this.chunkManager = new ChunkManager(this.scene, this.rng);

        // World Related Items
        this.setupSky();

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
        //this.scene.add(light);
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

        // Setup Sky Shader Uniforms
        const uniforms = this.sky.material.uniforms;
        uniforms["turbidity"].value = 1.0;
        uniforms["rayleigh"].value = 1.0;
        uniforms["mieCoefficient"].value = 0.005;
        uniforms["mieDirectionalG"].value = 0.7;

        // Create Sun Light
        this.sunLight = new THREE.HemisphereLight(0xffffff, 0x74C365, 0);
        this.scene.add(this.sunLight);

        this.setSunAngle(90.0);

        // Add some fog
        this.scene.fog = new THREE.Fog(0xcce0ff, 50, 200);
    }

    private setSunAngle(thetaDeg: number) {
        const theta = thetaDeg*(Math.PI/180.0);
        const sunPosition = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);

        // Update light intensity
        let sunIntensity = Math.max(0.01, Math.sin(theta));
        this.sunLight.intensity = sunIntensity;
        this.sunLight.position.copy(sunPosition);
        let fogIntensity = 0.8*sunIntensity;
        let fogColor = new THREE.Color(fogIntensity, fogIntensity*1.1, fogIntensity);
        this.scene.fog = new THREE.Fog( fogColor.getHex(), 50, 200 );

        // Update sun position in sky
        const uniforms = this.sky.material.uniforms;
        uniforms["sunPosition"].value.copy(sunPosition);
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

        const tod = 360.0*(time % 60000)/60000;
        this.setSunAngle(tod);
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
