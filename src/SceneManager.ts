import * as THREE from "three";

class SceneManager {
    clock: THREE.Clock;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;

    constructor() {
        this.clock = new THREE.Clock();
        this.scene = this.setupScene();
        this.renderer = this.setupRenderer();
        this.camera = this.setupCamera();
    }

    private setupScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");
        return scene;
    }

    private setupRenderer(): THREE.WebGLRenderer {
        let options = { antialias: true, alpha: false };
        const renderer = new THREE.WebGLRenderer(options);
        //renderer.setPixelRatio(window.devicePixelRatio);
        //renderer.setPixelRatio(1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    private setupCamera(): THREE.PerspectiveCamera {
        const aspectRatio = window.innerWidth/window.innerHeight;
        const fieldOfView = 45;
        const nearPlane = 0.1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView,
            aspectRatio, nearPlane, farPlane);
        return camera;
    }

    public update(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public onWindowResize(): void {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.camera.aspect = w/h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

export { SceneManager };
