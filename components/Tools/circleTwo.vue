<template>
  <div>
    <!-- <div v-for="item in data">
      <pre>{{ JSON.stringify(item, null, 2) }}</pre>
      <BlockMedia :media="item.media[0].media[0]" />
    </div> -->

    <div class="circle-container" ref="containerRef">
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
import observe from "~/composables/Observer";
import Vid from "~/components/Block/Vid.vue";

const { $urlFor } = useNuxtApp();

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const query = groq`*[_type=="tools" && !featured] | order(orderRank) {
  title,
  description,
  orderRank,
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
          url: $urlFor(media.asset).width(320).url(),
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
const MAX_CONCURRENT_VIDEOS = 32; // Limit concurrent videos
const videoPool = [];
let activeVideoCount = 0;

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
const FIXED_TIME_STEP = 1000 / 60; // 60fps

// Update the configuration with separate desktop and mobile settings
const CONFIG = {
  desktop: {
    ringSize: 3,
    pointSize: 124,
    rotation: {
      initial: {
        x: 0,
        y: 0,
        z: 0,
      },
      animation: {
        x: 0,
        y: 0.001,
        z: 0.005,
      },
    },
  },
  mobile: {
    ringSize: 2.75,
    pointSize: 80,
    rotation: {
      initial: {
        x: 1,
        y: 0,
        z: 1,
      },
      animation: {
        x: 0.0,
        y: 0.0,
        z: 0.004,
      },
    },
  },
};

// Add ref for the container
const containerRef = ref(null);

// Update the intersection observer setup
const { isIntersecting } = observe({
  element: containerRef,
  onEnter: () => {
    // Start animation if not already running
    if (!animationFrameId) {
      animate();
    }
    // Resume videos
    videoPool.forEach((video) => {
      if (video && video.play) {
        video.play().catch((e) => console.log("Video play error:", e));
      }
    });
  },
  onLeave: () => {
    // Pause animations
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Pause videos
    videoPool.forEach((video) => {
      if (video && video.pause) {
        video.pause();
      }
    });
  },
  options: {
    threshold: 0.1, // Trigger when at least 10% is visible
  },
});

// Update video element factory
const createVideoElement = (url) => {
  if (activeVideoCount >= MAX_CONCURRENT_VIDEOS) {
    const video = videoPool.find((v) => !v.inUse);
    if (video) {
      video.inUse = true;
      video.playbackId = url;
      return video;
    }
    return null;
  }

  const video = document.createElement("mux-player");
  video.playbackId = url;
  video.autoplay = false;
  video.loop = true;
  video.muted = true;
  video.style.objectFit = "cover";
  video.style.backgroundColor = "white";
  video.controls = false;
  video.playsinline = true;
  video.preload = "metadata";
  video.minResolution = "720p";
  video.classList.add("mux-player--controls-hidden");

  // Add mobile-specific attributes
  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("x5-playsinline", "true");
  video.setAttribute("x5-video-player-type", "h5");
  video.setAttribute("x5-video-player-fullscreen", "false");
  video.setAttribute("controls", "false");
  video.setAttribute(
    "style",
    "--controls: none; --loading-indicator: none; --dialog: none;"
  );

  video.inUse = true;
  activeVideoCount++;
  videoPool.push(video);

  return video;
};

// Update cleanup video element
const cleanupVideo = (video) => {
  if (video) {
    video.pause();
    video.src = "";
    video.inUse = false;
    activeVideoCount--;
  }
};

// Update the constant
const POINT_COUNT = computed(() => mediaUrls.value.length);

// Update init function to use dynamic point count
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
  controls.enableZoom = false;

  // WebGL Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  renderer.setPixelRatio(1);
  renderer.setAnimationLoop(null);

  // CSS2D Renderer setup
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  canvas.value.parentElement.appendChild(labelRenderer.domElement);

  // Get current config based on device
  const isMobile = window.innerWidth <= 1024;
  const config = isMobile ? CONFIG.mobile : CONFIG.desktop;

  // Create ring with correct initial size
  const geometry = new THREE.TorusGeometry(config.ringSize, 0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    visible: false,
  });
  ring = new THREE.Mesh(geometry, material);

  // Set initial rotation
  ring.rotation.set(
    config.rotation.initial.x,
    config.rotation.initial.y,
    config.rotation.initial.z
  );

  scene.add(ring);

  // Create points with correct initial size
  const angleStep = (Math.PI * 2) / POINT_COUNT.value;
  const baseRadius = config.ringSize;

  for (let i = 0; i < POINT_COUNT.value; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    const z = (i % 2) * 0.01;

    const mediaType = mediaUrls.value[i].type;
    const mediaUrl = mediaUrls.value[i].url;

    let mediaElement;
    if (mediaType === "video") {
      mediaElement = createVideoElement(mediaUrl);
      if (!mediaElement) {
        mediaElement = document.createElement("img");
        mediaElement.src = "/placeholder.png";
      }
    } else {
      mediaElement = document.createElement("img");
      mediaElement.loading = "lazy";
      mediaElement.src = mediaUrl;
    }

    // Set initial size based on config
    mediaElement.style.width = `${config.pointSize}px`;
    mediaElement.style.height = `${config.pointSize}px`;
    mediaElement.style.objectFit = "cover";
    mediaElement.style.backgroundColor = "#fff";

    const label = new CSS2DObject(mediaElement);
    label.position.set(x, y, z);
    ring.add(label);
    labels.push(label);
  }

  // Start animations
  animate();
};

// Update animate function
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update controls
  if (controls) controls.update();

  // Add rotation based on device with fixed time step
  if (ring) {
    const isMobile = window.innerWidth <= 1024;
    const config = isMobile ? CONFIG.mobile : CONFIG.desktop;
    const timeScale = deltaTime / FIXED_TIME_STEP;

    ring.rotation.x += config.rotation.animation.x * timeScale;
    ring.rotation.y += config.rotation.animation.y * timeScale;
    ring.rotation.z += config.rotation.animation.z * timeScale;
  }

  // Render scene
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
};

// Update resize handling
onMounted(() => {
  init();
  window.addEventListener("windowResized", handleResize);

  // Force initial resize and settings application
  requestAnimationFrame(() => {
    handleResize();
    // Start animation if initially visible
    if (isIntersecting.value) {
      animate();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("windowResized", handleResize);
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

// Remove transition state tracking
let resizeRAF;

// Update handleResize to use a simpler approach
const handleResize = () => {
  if (resizeRAF) cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(() => {
    const container = canvas.value.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);

    // Update canvas size
    canvas.value.style.width = `${size}px`;
    canvas.value.style.height = `${size}px`;

    // Update camera and renderer
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
    labelRenderer.setSize(size, size);

    // Update ring size and rotation based on device
    if (ring) {
      const isMobile = window.innerWidth <= 1024;
      const config = isMobile ? CONFIG.mobile : CONFIG.desktop;
      const ringSize = config.ringSize;

      // Update ring geometry first
      const newGeometry = new THREE.TorusGeometry(ringSize, 0.1, 32, 32);
      ring.geometry.dispose();
      ring.geometry = newGeometry;

      // Update rotation
      ring.rotation.set(
        config.rotation.initial.x,
        config.rotation.initial.y,
        config.rotation.initial.z
      );

      // Update label positions and sizes in a single pass
      const angleStep = (Math.PI * 2) / labels.length;
      const labelSize = config.pointSize;

      labels.forEach((label, i) => {
        const angle = i * angleStep;
        const z = (i % 2) * 0.01;

        // Update position
        label.position.set(
          Math.cos(angle) * ringSize,
          Math.sin(angle) * ringSize,
          z
        );

        // Update size
        const img = label.element;
        if (img) {
          img.style.width = `${labelSize}px`;
          img.style.height = `${labelSize}px`;
          img.style.objectFit = "cover";
          img.style.transform = "scale(1)";
        }
      });
    }
  });
};

// Add a ResizeObserver for more responsive updates
let resizeObserver;
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

  @include phablet {
    margin-top: calc(-1 * var(--small));
  }

  @include tablet {
    margin-top: calc(-1 * var(--bigger));
  }

  @include desktop {
    aspect-ratio: 5/4;
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

:deep(.mux-player) {
  --controls: none !important;
  --loading-indicator: none !important;
  --dialog: none !important;
  --media-object-fit: cover;
}

:deep(.mux-player--controls-hidden) {
  --controls: none !important;
  --loading-indicator: none !important;
  --dialog: none !important;
}

// .circle-container {
//   :deep(mux-player) {
//     pointer-events: none !important;
//   }
// }
</style>
