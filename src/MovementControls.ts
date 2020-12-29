import { Camera, Vector3 } from 'three';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class MovementControls extends PointerLockControls {

    forward: number;
    forwardSpeed: number;
    strafe: number;
    strafeSpeed: number;
    flyMode: boolean;
    flySpeed: number;

    camera: Camera;
    dirVec: Vector3;

    constructor(camera: Camera, domElement: HTMLElement) {
        super(camera, domElement);
        this.camera = camera;
        this.dirVec = new Vector3();

        // Movement States
        this.forward = 0;
        this.strafe = 0;
        this.flyMode = false;

        // Movement Speeds
        // km/S
        this.forwardSpeed = 6*0.001;
        this.strafeSpeed = 4*0.001;
        this.flySpeed = 8*0.001;

        this.bindEventListeners();
    }

    private bindEventListeners() {
        document.body.addEventListener('click', this.onClick);
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    public update(delta: number) {
        // delta: time in milliseconds
        if(this.flyMode) {
            this.fly(this.flySpeed*delta*this.forward);
            this.moveRight(this.strafeSpeed*delta*this.strafe);
        } else {
            this.moveForward(this.forwardSpeed*delta*this.forward);
            this.moveRight(this.strafeSpeed*delta*this.strafe);
        }
    }

    private onClick: EventListener = (event: MouseEvent) => {
        this.lock();
    }

    private onKeyDown: EventListener = (event: KeyboardEvent) => {
        switch ( event.keyCode ) {
            // **** Move Forward
            case 38: // up
            case 87: // w
                this.forward = 1;
            break;
            // **** Move Backward
            case 40: // down
            case 83: // s
                this.forward = -1;
            break;
            // **** Move Left
            case 37: // left
            case 65: // a
                this.strafe = -1;
            break;
            // **** Move Right
            case 39: // right
            case 68: // d
                this.strafe = 1;
            break;
        }
    }

    private onKeyUp: EventListener = (event: KeyboardEvent) => {
        switch ( event.keyCode ) {
            // **** Move Forward
            case 38: // up
            case 87: // w
                this.forward = 0;
            break;
            // **** Move Backward
            case 40: // down
            case 83: // s
                this.forward = 0;
            break;
            // **** Move Left
            case 37: // left
            case 65: // a
                this.strafe = 0;
            break;
            // **** Move Right
            case 39: // right
            case 68: // d
                this.strafe = 0;
            break;
            case 70:
                this.flyMode = !this.flyMode;
            break;
        }
    }

    public fly(distance: number) {
        //this.vec.setFromMatrixColumn(this.camera.matrix, 0);
        this.camera.getWorldDirection(this.dirVec);
        //this.vec.crossVectors(this.camera.up, this.vec);
        this.camera.position.addScaledVector(this.dirVec, distance);
    }
}

export { MovementControls };
