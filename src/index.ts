import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10);
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
let geometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
let material = new THREE.MeshNormalMaterial();
let mesh = new THREE.Mesh(geometry, material);
let gridHelper = new THREE.GridHelper(10.0, 10);
let clock = new THREE.Clock();

let controls = new FirstPersonControls(camera, renderer.domElement);
let stats = Stats();

init();
animate();
function init() {
    let container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(stats.dom);

    camera.position.set(0, 0, 1);

    scene.add(mesh);
    scene.add(gridHelper);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', OnWindowResize, false);
}

function OnWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
    stats.update();
}
