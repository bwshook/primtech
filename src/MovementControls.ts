import { Camera } from 'three';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class MovementControls extends PointerLockControls {

    forward: number;
    strafe: number;

    constructor(camera: Camera, domElement: HTMLElement) {
        super(camera, domElement);

        // Movement States
        this.forward = 0;
        this.strafe = 0;

        this.bindEventListeners();
    }

    private bindEventListeners() {
        document.body.addEventListener('click', this.onClick);
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    public update(delta: number) {
        this.moveForward(0.1*this.forward);
        this.moveRight(0.1*this.strafe);
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
        }
    }

}

export { MovementControls };
