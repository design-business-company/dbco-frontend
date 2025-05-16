<template>
  <div>
    <!-- <div v-for="item in data">
      <pre>{{ JSON.stringify(item, null, 2) }}</pre>
      <BlockMedia :media="item.media[0].media[0]" />
    </div> -->

    <div class="circle-container">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useNuxtApp } from "#app";
import { mediaBlockQuery } from "@/queries/blocks";

const { $urlFor } = useNuxtApp();

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const query = groq`*[_type=="tools"]{
  title,
  description,
  media[] {
    media[] {
      ...,
      _type,
      _key,
      alt,
      caption,
      settings,
      _type == "picture" => {
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      _type == "video" => {
        "playbackId": file.asset->playbackId,
        "aspectRatio": file.asset->data.aspect_ratio,
        poster {
          ...,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
        }
      }
    }
  }
}`;

const { data, error } = await useSanityQuery(query);
if (error.value) {
  console.error("Sanity query error:", error.value);
  await navigateTo("/error");
}

// Process Sanity data into mediaUrls format
const mediaUrls = computed(() => {
  if (!data.value) return [];

  return data.value
    .map((tool) => {
      const media = tool.media?.[0]?.media?.[0];
      if (!media) return null;

      if (media._type === "picture") {
        return {
          type: "image",
          url: $urlFor(media.asset).width(640).url(),
        };
      } else if (media._type === "video") {
        return {
          type: "video",
          url: media.playbackId,
        };
      }
      return null;
    })
    .filter(Boolean);
});

const canvas = ref(null);
let scene,
  camera,
  renderer,
  labelRenderer,
  ring,
  labels = [],
  controls;
let animationFrameId;

// Video pool management
const MAX_CONCURRENT_VIDEOS = 24; // Limit concurrent videos
const videoPool = [];
let activeVideoCount = 0;

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

// Video element factory
const createVideoElement = (url) => {
  if (activeVideoCount >= MAX_CONCURRENT_VIDEOS) {
    // Reuse an existing video element
    const video = videoPool.find((v) => !v.inUse);
    if (video) {
      video.inUse = true;
      video.playbackId = url;
      return video;
    }
    return null; // No available video elements
  }

  const video = document.createElement("mux-player");
  video.playbackId = url;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.style.width = "100px";
  video.style.height = "100px";
  video.style.objectFit = "cover";
  video.style.backgroundColor = "white";
  video.controls = false;

  video.inUse = true;
  activeVideoCount++;
  videoPool.push(video);

  return video;
};

// Cleanup video element
const cleanupVideo = (video) => {
  if (video) {
    video.pause();
    video.src = "";
    video.inUse = false;
    activeVideoCount--;
  }
};

const init = () => {
  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  // Add OrbitControls
  controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false; // Disable zoom

  // WebGL Renderer setup with performance optimizations
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  renderer.setPixelRatio(1);
  renderer.setAnimationLoop(null);

  // CSS2D Renderer setup with optimizations
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  canvas.value.parentElement.appendChild(labelRenderer.domElement);

  // Create invisible ring with fewer vertices
  const geometry = new THREE.TorusGeometry(1, 0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    visible: false,
  });
  ring = new THREE.Mesh(geometry, material);
  scene.add(ring);

  // Create a fixed number of points around the ring
  const angleStep = (Math.PI * 2) / 32;
  const baseRadius = 1; // Base radius for label positioning

  for (let i = 0; i < 32; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    const z = 0;

    const mediaType = mediaUrls.value[i % mediaUrls.value.length].type;
    const mediaUrl = mediaUrls.value[i % mediaUrls.value.length].url;

    let mediaElement;
    if (mediaType === "video") {
      mediaElement = createVideoElement(mediaUrl);
      if (!mediaElement) {
        mediaElement = document.createElement("img");
        mediaElement.src = "/images/placeholder.jpg";
        mediaElement.style.width = "100px";
        mediaElement.style.height = "100px";
        mediaElement.style.objectFit = "cover";
        mediaElement.style.backgroundColor = "#fff";
      }
    } else {
      mediaElement = document.createElement("img");
      mediaElement.loading = "lazy";
      mediaElement.src = mediaUrl;
      mediaElement.style.width = "100px";
      mediaElement.style.height = "100px";
      mediaElement.style.objectFit = "cover";
      mediaElement.style.backgroundColor = "#fff";

      mediaElement.onload = () => {
        mediaElement.style.backgroundColor = "transparent";
      };

      mediaElement.onerror = (e) => {
        console.error("Failed to load image:", mediaUrl, e);
        mediaElement.style.backgroundColor = "#ff0000";
      };
    }

    // Create CSS2D label
    const label = new CSS2DObject(mediaElement);
    label.position.set(x, y, z);
    ring.add(label);
    labels.push(label);
  }

  // Start animations
  animate();
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  // Update performance stats
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;
  }

  // Update controls
  if (controls) controls.update();

  // Add summersault rotation
  if (ring) {
    ring.rotation.z += 0.005; // Fixed summersault speed
  }

  // Render scene
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeRAF) cancelAnimationFrame(resizeRAF);
  if (resizeObserver) resizeObserver.disconnect();
  cancelAnimationFrame(animationFrameId);

  // Cleanup controls
  if (controls) controls.dispose();

  // Cleanup all video elements
  videoPool.forEach((video) => {
    cleanupVideo(video);
  });
  videoPool.length = 0;
  activeVideoCount = 0;

  // Cleanup Three.js resources
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });

  // Cleanup labels
  labels.forEach((label) => {
    if (label.element instanceof HTMLVideoElement) {
      label.element.pause();
      label.element.src = "";
    }
  });

  // Properly cleanup renderers
  renderer.dispose();
  if (
    labelRenderer &&
    labelRenderer.domElement &&
    labelRenderer.domElement.parentNode
  ) {
    labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
  }
});

// Optimize resize handler with RAF
let resizeRAF;
const handleResize = () => {
  if (resizeRAF) cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(() => {
    const container = canvas.value.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);

    // Update canvas size
    canvas.value.style.width = `${size}px`;
    canvas.value.style.height = `${size}px`;

    // Update camera and renderer
    camera.aspect = 1; // Keep it square
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
    labelRenderer.setSize(size, size);

    // Update ring size based on breakpoints
    if (ring) {
      let ringSize;
      // if (size <= 640) {
      //   ringSize = 3.0;
      // } else if (size <= 720) {
      //   ringSize = 3.0;
      // } else if (size <= 1024) {
      //   ringSize = 3.0;
      // } else if (size <= 1280) {
      //   ringSize = 3.0;
      // } else if (size <= 1440) {
      //   ringSize = 3.0;
      // } else if (size > 1440) {
      //   ringSize = 3.0;
      // }
      ringSize = 3.0;

      const newGeometry = new THREE.TorusGeometry(ringSize, 0.1, 32, 32);
      ring.geometry.dispose();
      ring.geometry = newGeometry;

      // Update label positions
      const angleStep = (Math.PI * 2) / labels.length;
      labels.forEach((label, i) => {
        const angle = i * angleStep;
        label.position.set(
          Math.cos(angle) * ringSize,
          Math.sin(angle) * ringSize,
          0
        );
      });
    }

    // Update label sizes
    const labelSize = Math.min(Math.max(size * 0.08, 96), size * 0.1);
    labels.forEach((label) => {
      const img = label.element;
      if (img) {
        img.style.width = `${labelSize}px`;
        img.style.height = `${labelSize}px`;
      }
    });
  });
};

// Add a ResizeObserver for more responsive updates
let resizeObserver;
onMounted(() => {
  init();
  window.addEventListener("resize", handleResize);
  // Initial size update
  handleResize();
});
</script>

<style lang="scss" scoped>
.circle-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;

  @include desktop {
    aspect-ratio: 6/4;
  }

  // @include ultrawide {
  //   aspect-ratio: /4;
  // }
}

canvas {
  width: 100vmin;
  height: 100vmin;
  display: block;
  cursor: grab;
  touch-action: none;
}

canvas:active {
  cursor: grabbing;
}
</style>
