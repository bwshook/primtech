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
let infoDiv = document.createElement("div");
let infoText = document.createTextNode("Hi there and greetings!");

init();
animate();
function init() {
    let container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(stats.dom);

    infoDiv.style.color = "white";
    infoDiv.style.position = "fixed";
    infoDiv.style.top = "0px";
    infoDiv.style.right = "10%";
    infoDiv.appendChild(infoText);
    container.appendChild(infoDiv);

    camera.position.set(0, 0, 1);

    scene.add(mesh);
    scene.add(gridHelper);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', OnWindowResize, false);
    controls.handleResize();
    controls.lookSpeed = 0.05;
}

function OnWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(clock.getDelta());
    infoText.data = controls.viewHalfX;
    renderer.render(scene, camera);
    stats.update();
}
