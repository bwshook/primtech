
// Third-Party modules
import * as THREE from "three";
import { MersenneTwister19937 } from "random-js"
import { real } from "random-js"
import { integer } from "random-js";

import { FractalPlaneGeometry } from "./FractalPlaneGeometry";


export class ChunkManager {
    scene: THREE.Scene;
    rng: MersenneTwister19937;

    constructor(scene: THREE.Scene, rng: MersenneTwister19937) {
        this.scene = scene;
        this.rng = rng;

        this.setupVegetation();
        // this.setupRocks();
        // this.setupSticks();

        for ( let iX = -2; iX <= 2; iX++ ) {
            for ( let iY = -2; iY <= 2; iY++ ) {
                this.loadChunk(iX, iY);
            }
        }
    }

    private loadChunk(x: number, z: number) {
        const CHUNK_SIZE = 200.0;
        let groundGeo = new FractalPlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 100, 100, x*CHUNK_SIZE, z*CHUNK_SIZE);
        const groundMat = new THREE.MeshStandardMaterial( { color: 0x95ec7d } );
        const groundMesh = new THREE.Mesh(groundGeo, groundMat);
        this.scene.add(groundMesh);
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
}
