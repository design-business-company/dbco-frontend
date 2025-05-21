<template>
  <div>
    <!-- <div v-for="item in data">
      <pre>{{ JSON.stringify(item, null, 2) }}</pre>
      <BlockMedia :media="item.media[0].media[0]" />
    </div> -->

    <div ref="container" class="circle-container">
      <canvas ref="canvas"></canvas>
      <div v-if="PERFORMANCE_MONITORING" class="performance-monitor">
        <div>FPS: {{ fps }}</div>
        <div>Memory: {{ memoryUsage }}MB</div>
        <div>Videos: {{ activeVideos }}/{{ videoCount }}</div>
      </div>
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
import Hls from "hls.js";
import { useIntersectionObserver } from "@vueuse/core";

const { $urlFor } = useNuxtApp();

/* ----------------------------------------------------------------------------
 * Fetch data from sanity
 * --------------------------------------------------------------------------*/
const query = groq`*[_type=="tools" && !featured]{
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

  // Add mobile detection
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  console.log("Device type:", isMobile ? "Mobile" : "Desktop");

  return data.value
    .map((tool) => {
      const media = tool.media?.[0]?.media?.[0];
      if (!media) return null;

      if (media._type === "picture" && media.asset) {
        // Use smaller image size for mobile
        const width = isMobile ? 320 : 640;
        const url = $urlFor(media.asset).width(width).url();
        const fallbackUrl = $urlFor(media.asset).width(160).url();

        console.log("Image URLs:", { url, fallbackUrl });

        return {
          type: "image",
          url,
          fallbackUrl,
        };
      } else if (media._type === "video" && media.playbackId) {
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
const PERFORMANCE_MONITORING = true;
let lastTime = performance.now();
let frameCount = 0;
let fps = ref(0);
let memoryUsage = ref(0);
let videoCount = ref(0);
let activeVideos = ref(0);

// Add these variables at the top with other state variables
let isFirstRender = true;
let loadedCount = 0;
const MIN_ITEMS_TO_RENDER = 4; // Start rendering after this many items are loaded

// Add cache objects at the top with other state variables
const videoCache = new Map();
const textureCache = new Map();

// Size configuration
const baseRadius = 1.5;
const POINT_SIZE = 0.8;
const Z_OFFSET_RANGE = 0.05;
const CAMERA_FOV = 15;

// Add refs for the container and animation state
const container = ref(null);
const isVisible = ref(false);
const isAnimating = ref(false);

// Add back the missing intersection observer and animation code
const { stop } = useIntersectionObserver(
  container,
  ([{ isIntersecting }]) => {
    console.log("Visibility changed:", isIntersecting);
    isVisible.value = isIntersecting;
    if (isIntersecting) {
      // Resume animation and videos
      isAnimating.value = true;
      videoPool.forEach((video) => {
        if (video && !video.paused) {
          video.play();
        }
      });
      // Start animation if not already running
      if (!animationFrameId) {
        animate();
      }
      logVideoStates();
    } else {
      // Pause animation and videos
      isAnimating.value = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      videoPool.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
      logVideoStates();
    }
  },
  { threshold: 0.1 }
);

// Add back the animation function
const animate = () => {
  if (!isAnimating.value) {
    animationFrameId = null;
    return;
  }

  animationFrameId = requestAnimationFrame(animate);
  updatePerformanceStats();

  // Update controls
  if (controls) controls.update();

  // Add summersault rotation
  if (ring) {
    ring.rotation.z += 0.005;
    ring.rotation.y += 0.005;
  }

  // Update all meshes to face the camera
  labels.forEach((mesh) => {
    if (mesh instanceof THREE.Mesh) {
      mesh.lookAt(camera.position);
    }
  });

  // Render scene
  renderer.render(scene, camera);
};

// Add back the performance monitoring function
const updatePerformanceStats = () => {
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;

    if (PERFORMANCE_MONITORING) {
      // Update video counts - count both pool and cache
      const totalVideos = new Set([...videoPool, ...videoCache.values()]).size;
      const activeVideosCount = [...videoPool, ...videoCache.values()].filter(
        (video) => video && !video.paused
      ).length;

      videoCount.value = totalVideos;
      activeVideos.value = activeVideosCount;

      // Update memory usage
      if (window.performance && window.performance.memory) {
        memoryUsage.value = Math.round(
          window.performance.memory.usedJSHeapSize / 1024 / 1024
        );
      }

      // Log detailed stats
      console.log(`Performance Stats:
        FPS: ${fps.value}
        Memory: ${memoryUsage.value}MB
        Total Videos: ${videoCount.value} (Pool: ${videoPool.length}, Cache: ${
        videoCache.size
      })
        Active Videos: ${activeVideos.value}
        Canvas Size: ${canvas.value?.width}x${canvas.value?.height}
        Pixel Ratio: ${renderer?.getPixelRatio()}
      `);
    }
  }
};

// Add back the video state logging function
const logVideoStates = () => {
  const playing = videoPool.filter((video) => video && !video.paused).length;
  const paused = videoPool.filter((video) => video && video.paused).length;
  console.log(`Videos: ${playing} playing, ${paused} paused`);
};

// Update init function to add back OrbitControls
const init = async () => {
  // Clean up any existing videos and meshes
  if (labels.length > 0) {
    labels.forEach((mesh) => {
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    labels = [];
  }

  // Clean up video pool
  videoPool.forEach((video) => {
    cleanupVideo(video);
  });
  videoPool.length = 0;
  activeVideoCount = 0;

  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Add OrbitControls
  controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false; // Disable zoom

  // WebGL Renderer setup with color management
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    precision: "highp",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Set size and pixel ratio with mobile optimizations
  const container = canvas.value.parentElement;
  const size = Math.min(container.clientWidth, container.clientHeight);
  canvas.value.style.width = `${size}px`;
  canvas.value.style.height = `${size}px`;

  // Lower pixel ratio on mobile
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setSize(size * pixelRatio, size * pixelRatio, false);
  renderer.setPixelRatio(pixelRatio);
  renderer.setAnimationLoop(null);

  // Create invisible ring with fewer vertices on mobile
  const geometry = new THREE.TorusGeometry(baseRadius, 0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    visible: false,
  });
  ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI * 0.1;
  scene.add(ring);

  // Create a fixed number of points around the ring
  const angleStep = (Math.PI * 2) / 32;

  // Start animation loop immediately
  isAnimating.value = true;
  animate();

  // Load items progressively
  const loadItem = async (index) => {
    const angle = index * angleStep;
    const x = Math.cos(angle) * baseRadius;
    const y = Math.sin(angle) * baseRadius;
    const z = (Math.random() - 0.5) * Z_OFFSET_RANGE;

    const mediaType = mediaUrls.value[index % mediaUrls.value.length].type;
    const mediaUrl = mediaUrls.value[index % mediaUrls.value.length].url;
    const fallbackUrl =
      mediaUrls.value[index % mediaUrls.value.length].fallbackUrl;

    console.log(`Loading item ${index}:`, { mediaType, mediaUrl, fallbackUrl });

    try {
      if (mediaType === "video") {
        console.log("Processing video:", mediaUrl);
        const mediaElement = await createVideoElement(mediaUrl);
        if (!mediaElement) {
          console.log("Using placeholder for video");
          let texture;
          if (textureCache.has("placeholder")) {
            texture = textureCache.get("placeholder");
          } else {
            texture = new THREE.TextureLoader().load("/placeholder.png");
            texture.colorSpace = THREE.SRGBColorSpace;
            textureCache.set("placeholder", texture);
          }
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const geometry = new THREE.PlaneGeometry(1, 1);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, z);
          mesh.scale.set(POINT_SIZE, POINT_SIZE, 1);
          mesh.lookAt(camera.position);
          if (ring) {
            ring.add(mesh);
            labels.push(mesh);
          }
        } else {
          console.log("Creating video texture");
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext("2d");

          const texture = new THREE.CanvasTexture(canvas);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
          });
          const geometry = new THREE.PlaneGeometry(1, 1);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, z);
          mesh.scale.set(POINT_SIZE, POINT_SIZE, 1);
          mesh.lookAt(camera.position);
          if (ring) {
            ring.add(mesh);
            labels.push(mesh);
          }

          const updateCanvas = () => {
            if (mediaElement.readyState >= 2) {
              ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
              texture.needsUpdate = true;
            }
            requestAnimationFrame(updateCanvas);
          };
          updateCanvas();
        }
      } else {
        // Load placeholder first
        let texture = textureCache.get("placeholder");
        if (!texture) {
          texture = new THREE.TextureLoader().load("/placeholder.png");
          texture.colorSpace = THREE.SRGBColorSpace;
          textureCache.set("placeholder", texture);
        }

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          toneMapped: true,
          transparent: true,
          color: new THREE.Color(1, 1, 1), // Ensure full white
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.scale.set(POINT_SIZE, POINT_SIZE, 1);
        mesh.lookAt(camera.position);

        if (ring) {
          ring.add(mesh);
          labels.push(mesh);
        }

        // Load actual image in background
        const loadImage = () => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";

            // Try fallback first
            console.log(`Loading fallback for item ${index}:`, fallbackUrl);
            img.src = fallbackUrl;

            img.onload = () => {
              console.log(`Fallback loaded for item ${index}`);
              // Once fallback is loaded, try full resolution
              const fullImg = new Image();
              fullImg.crossOrigin = "anonymous";
              fullImg.src = mediaUrl;

              fullImg.onload = () => {
                console.log(`Full image loaded for item ${index}`);
                const newTexture = new THREE.TextureLoader().load(
                  mediaUrl,
                  // Success callback
                  (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    material.map = texture;
                    material.needsUpdate = true;
                    textureCache.set(mediaUrl, texture);
                    resolve();
                  },
                  // Progress callback
                  undefined,
                  // Error callback
                  (error) => {
                    console.error(
                      `Error loading full image for item ${index}:`,
                      error
                    );
                    // Fall back to the fallback image
                    const fallbackTexture = new THREE.TextureLoader().load(
                      fallbackUrl
                    );
                    fallbackTexture.colorSpace = THREE.SRGBColorSpace;
                    material.map = fallbackTexture;
                    material.needsUpdate = true;
                    textureCache.set(mediaUrl, fallbackTexture);
                    resolve();
                  }
                );
              };

              fullImg.onerror = (error) => {
                console.error(
                  `Error loading full image for item ${index}:`,
                  error
                );
                // If full resolution fails, keep the fallback
                const fallbackTexture = new THREE.TextureLoader().load(
                  fallbackUrl
                );
                fallbackTexture.colorSpace = THREE.SRGBColorSpace;
                material.map = fallbackTexture;
                material.needsUpdate = true;
                textureCache.set(mediaUrl, fallbackTexture);
                resolve();
              };
            };

            img.onerror = (error) => {
              console.error(`Error loading fallback for item ${index}:`, error);
              reject(error);
            };
          });
        };

        // Load image with retry logic
        let retries = 3;
        const attemptLoad = async () => {
          try {
            await loadImage();
          } catch (error) {
            console.error(
              `Failed to load image (${retries} retries left):`,
              error
            );
            if (retries > 0) {
              retries--;
              setTimeout(attemptLoad, 1000); // Wait 1 second before retry
            }
          }
        };

        attemptLoad();
      }
    } catch (error) {
      console.error("Error creating media element:", error);
      let texture;
      if (textureCache.has("placeholder")) {
        texture = textureCache.get("placeholder");
      } else {
        texture = new THREE.TextureLoader().load("/placeholder.png");
        texture.colorSpace = THREE.SRGBColorSpace;
        textureCache.set("placeholder", texture);
      }
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: true,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(POINT_SIZE, POINT_SIZE, 1);
      mesh.lookAt(camera.position);
      if (ring) {
        ring.add(mesh);
        labels.push(mesh);
      }
    }

    loadedCount++;

    if (isFirstRender && loadedCount >= MIN_ITEMS_TO_RENDER) {
      isFirstRender = false;
      console.log("Initial render complete");
    }

    if (index < 31) {
      loadItem(index + 1);
    }
  };

  // Start loading items
  loadItem(0);
};

// Update createVideoElement with mobile optimizations
const createVideoElement = (url) => {
  console.log("Creating video element for:", url);

  // Check cache first
  if (videoCache.has(url)) {
    console.log("Using cached video element");
    const cachedVideo = videoCache.get(url);
    if (cachedVideo.inUse) {
      return createNewVideoElement(url);
    }
    cachedVideo.inUse = true;
    videoPool.push(cachedVideo);
    logVideoStates();
    return cachedVideo;
  }

  if (activeVideoCount >= MAX_CONCURRENT_VIDEOS) {
    const video = videoPool.find((v) => !v.inUse);
    if (video) {
      video.inUse = true;
      video.loop = true;
      const streamUrl = `https://stream.mux.com/${url}.m3u8`;
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          enableWorker: true,
          lowLatencyMode: true,
          // Mobile-specific HLS settings
          abrEwmaDefaultEstimate: 1000000,
          maxBufferSize: 60 * 1000 * 1000,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      }
      console.log("Reusing video element");
      logVideoStates();
      return video;
    }
    console.log("No available video elements");
    return null;
  }

  return createNewVideoElement(url);
};

// Update createNewVideoElement with mobile optimizations
const createNewVideoElement = (url) => {
  const video = document.createElement("video");
  const streamUrl = `https://stream.mux.com/${url}.m3u8`;
  console.log("Setting video source to:", streamUrl);

  if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      enableWorker: true,
      lowLatencyMode: true,
      // Mobile-specific HLS settings
      abrEwmaDefaultEstimate: 1000000,
      maxBufferSize: 60 * 1000 * 1000,
    });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("HLS manifest parsed");
      video.play();
      logVideoStates();
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS error:", data);
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error("Network error, trying to recover...");
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error("Media error, trying to recover...");
            hls.recoverMediaError();
            break;
          default:
            console.error("Fatal error, cannot recover");
            hls.destroy();
            break;
        }
      }
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
  }

  // Mobile-specific video settings
  video.preload = "metadata";
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.style.display = "none";

  video.addEventListener("ended", () => {
    console.log("Video ended, restarting...");
    video.currentTime = 0;
    video.play().catch((e) => console.error("Error restarting video:", e));
  });

  video.addEventListener("error", (e) => {
    console.error("Video error:", e);
  });

  document.body.appendChild(video);

  videoCache.set(url, video);
  videoPool.push(video);
  activeVideoCount++;
  logVideoStates();

  return video;
};

// Update the cleanupVideo function to handle cache
const cleanupVideo = (video) => {
  if (video) {
    video.pause();
    video.inUse = false;
    // Don't remove from cache, just mark as not in use
  }
};

onBeforeUnmount(() => {
  stop(); // Stop the intersection observer
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

  // Properly cleanup renderers
  renderer.dispose();
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

    // Update camera and renderer with high quality settings
    camera.aspect = 1; // Keep it square
    camera.updateProjectionMatrix();

    // Use device pixel ratio for better quality
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(size * pixelRatio, size * pixelRatio, false);
    renderer.setPixelRatio(pixelRatio);

    // Update ring size based on breakpoints
    if (ring) {
      let ringSize;
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

.performance-monitor {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
  line-height: 1.4;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
</style>
