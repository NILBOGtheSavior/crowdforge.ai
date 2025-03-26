import * as THREE from 'three';

// TODO
/**
 * Create hero class:
 - [x] Initialize renderer, scene, camera, and light
 - [x] Create object spawner
 - [x] Create geometry
 - [ ] Animate and spawn properties
 - [ ] Create background
 - [ ] Shader elements
 - [ ] Sandbox
 */
 import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
 import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
 import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
 import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
 import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
 
 class Hero {
     constructor(elementId) {
         this.particles = [];
 
         this.renderer = new THREE.WebGLRenderer({ alpha: true });
         this.renderer.setSize(window.innerWidth, window.innerHeight);
         document.getElementById(elementId).appendChild(this.renderer.domElement);
 
         this.scene = new THREE.Scene();
         this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
         this.camera.position.z = 1;
 
         this.light = new THREE.DirectionalLight(0xc6c6db, 5);
         this.light.position.set(-1, 2, 4);
         this.scene.add(this.light);
 
         this.spawner();
 
         // Post-processing setup
         this.composer = new EffectComposer(this.renderer);
         this.renderPass = new RenderPass(this.scene, this.camera);
         this.composer.addPass(this.renderPass);
 
         // Add a bloom pass for visual effects
         this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
         this.composer.addPass(this.bloomPass);
 
         // Optional: Add a copy shader to handle final render
         const copyPass = new ShaderPass(CopyShader);
         this.composer.addPass(copyPass);
 
         // Initial render call
         this.render = this.render.bind(this);
         requestAnimationFrame(this.render);
 
         this.dev = false;
     }
 
     buildScene() {
         const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
         const material = new THREE.MeshPhongMaterial({ color: 0x09092a });
         const mesh = new THREE.Mesh(geometry, material);
         mesh.position.setZ(-5);
         this.scene.add(mesh);
     }
 
     render(time) {
         time *= 0.001;
 
         // Update particle positions
         this.particles.forEach((particle) => {
             const velocity = this.brownianMotion(new THREE.Vector3(0, 1 / 4096, 0), 1 / 1024);
             particle.moveParticle(velocity);
         });
 
         // Render using the EffectComposer for post-processing
         this.composer.render();
 
         requestAnimationFrame(this.render);
     }
 
     brownianMotion(drift = new THREE.Vector3(), scale = 0.02) {
         return new THREE.Vector3(
             drift.x + (Math.random() - 0.5) * scale,
             drift.y + (Math.random() - 0.5) * scale,
             drift.z + (Math.random() - 0.5) * scale
         );
     }
 
     spawner() {
         const geometry = new THREE.CircleGeometry(1 / 12, 24);
         for (let i = 0; i < 25; i++) {
             const p = new Particle(
                 geometry,
                 this.randCoord(2, true),
                 this.randCoord(2, true),
                 this.randCoord(2, true)
             );
             this.particles.push(p);
             this.scene.add(p.mesh);
         }
     }
 
     randCoord(max, norm = false) {
         return norm ? Math.random() * max - max / 2 : Math.random() * max;
     }
 
     toggleDev() {
         let devElement = document.getElementById("developerTools");
         const material = new THREE.MeshBasicMaterial({ color: 0xFF3131 });
         const geometry = new THREE.CircleGeometry(1 / 12, 24);
         const pointer = new THREE.Mesh(geometry, material);
         if (this.dev) {
             this.dev = false;
             devElement.style.display = "none";
         } else {
             this.dev = true;
             devElement.style.display = "flex";
             this.scene.add(pointer);
             pointer.position.set(0, 0, 0);
         }
     }
 }
 
 class Particle {
     constructor(geometry, x, y, z, lifetime) {
         this.mesh = this.generateParticle(geometry, x, y, z);
     }
 
     generateParticle(geometry, x, y, z) {
         const material = new THREE.MeshPhongMaterial({ color: 0x363682 });
         const mesh = new THREE.Mesh(geometry, material);
         mesh.position.set(x, y, z);
         return mesh;
     }
 
     moveParticle(velocity) {
         this.mesh.position.add(velocity);
     }
 }
 
 export default Hero;
 