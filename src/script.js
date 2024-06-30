import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';
import { Pane } from 'tweakpane';


// Scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();


//Controls 
const pane = new Pane();

/**
 * Ambient Light
 */
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight)




/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const baseTexture = textureLoader.load("textures/modern/albedo.png")
const aoTexture = textureLoader.load("/textures/modern/ao.png")
const heightTexture =  textureLoader.load("/textures/modern/height.png")
const metalTexture = textureLoader.load("/textures/modern/metallic.png")
const normalTexture = textureLoader.load("/textures/modern/normal.png")
const roughnessTexture =  textureLoader.load("/textures/modern/roughness.png")

// Geometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.85, 15, 15);

const uv2Sphere = new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2);
sphereGeometry.setAttribute('uv2', uv2Sphere);


// Materials
const cubeMaterial = new THREE.MeshStandardMaterial();


const sphereMaterial = new THREE.MeshStandardMaterial();
sphereMaterial.map = baseTexture
sphereMaterial.aoMap = aoTexture
sphereMaterial.aoMapIntensity = 0.5
sphereMaterial.normalMap = normalTexture
sphereMaterial.displacementMap = heightTexture
sphereMaterial.metalnessMap = metalTexture
sphereMaterial.roughnessMap =  roughnessTexture







// Mesh 
const cubeMesh = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);
cubeMesh.position.x = 3

const sphereMesh = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
)


scene.add(cubeMesh, sphereMesh);












// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);
camera.position.z = 5;

/**
 * Control adding
 */
const group1 = pane.addFolder({
    title : "Cube",
    expanded : true,
})

const lightGroup = pane.addFolder({
    title : "light",
    expanded : true,

})

group1.addBinding(cubeMesh, 'scale', {
    min : 0,
    max : 10,
    step : 0.01
})

lightGroup.addBinding(ambientLight, 'intensity', {
    min:0.2,
    max:10,
    step : 0.01
})

lightGroup.addBinding(ambientLight, 'color').on('change',function(colorValue) {
    ambientLight.color.set(colorValue);
});







// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const clock = new THREE.Clock();

const renderLoop = () => {
   

    cubeMesh.rotation.x += 0.001;
    cubeMesh.rotation.y += 0.001;

    window.requestAnimationFrame(renderLoop);
    renderer.render(scene, camera);

    control.update();
};

renderLoop();
