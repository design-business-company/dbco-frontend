<template>
  <div
    ref="el"
    style="
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 0;
    "
  ></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from "vue";
import PageSetup from "~/composables/PageSetup";
import pageTransitionDefault from "~/assets/scripts/pages/transitionDefault";

// Run common mount/unmount scripts. Seup SEO, etc.
PageSetup({
  seoMeta: { title: "Three" },
});

// Define page transitions or other page meta
definePageMeta({
  pageTransition: pageTransitionDefault(),
});

const el = ref(null);

// contextual elements
let scene, camera, renderer, controls, light, frameId;
// composition elements
let geometry, material, cube;

onMounted(() => {
  scene = initScene();
  camera = initCamera(el.value.offsetWidth / el.value.offsetHeight);
  renderer = initRenderer();
  controls = initControls();
  light = initLights();

  drawCube();
  animate();

  window.addEventListener("windowResized", onWindowResize);
});

function animate() {
  frameId = requestAnimationFrame(animate);
  controls.update();
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;

  renderer.render(scene, camera);
}

function drawCube() {
  geometry = new THREE.BoxGeometry();
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function initScene() {
  const scene = new THREE.Scene();
  return scene;
}

function initRenderer() {
  const renderInstance = new THREE.WebGLRenderer({ antialias: true });
  renderInstance.setSize(window.innerWidth, window.innerHeight);
  el.value.appendChild(renderInstance.domElement);
  return renderInstance;
}

function initCamera(aspectRatio) {
  const fov = 20 / aspectRatio;
  const camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 1000);
  camera.position.z = 0;
  return camera;
}

function initControls() {
  const controlInstance = new OrbitControls(camera, renderer.domElement);
  controlInstance.minDistance = 8;
  controlInstance.maxDistance = 30;
  controlInstance.enableDamping = true;
  controlInstance.dampingFactor = 0.05;
  return controlInstance;
}

function initLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(ambientLight);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onUnmounted(() => {
  window.removeEventListener("windowResized", onWindowResize);

  // destroy animation loop
  if (frameId != null) cancelAnimationFrame(frameId);
});
</script>
