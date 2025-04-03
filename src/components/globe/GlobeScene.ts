
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  globeVertexShader, 
  globeFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader
} from './GlobeShaders';

export interface GlobeSceneReturn {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  globe: THREE.Mesh;
  globeRadius: number;
}

export const createGlobeScene = (
  container: HTMLDivElement, 
  setLoading: (isLoading: boolean) => void
): GlobeSceneReturn => {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;
  
  // Create renderer with proper settings to avoid context loss
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to avoid performance issues
  container.appendChild(renderer.domElement);
  
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.minDistance = 120;
  controls.maxDistance = 400;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  // Globe
  const globeRadius = 100;
  const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
  
  // Earth texture
  const textureLoader = new THREE.TextureLoader();
  
  // Material with custom shader for glowing effect
  const globeMaterial = new THREE.ShaderMaterial({
    vertexShader: globeVertexShader,
    fragmentShader: globeFragmentShader,
    uniforms: {
      globeTexture: { value: null },
      glowIntensity: { value: 0.4 },
      glowColor: { value: new THREE.Color(0x3a85ff) }
    },
    transparent: true
  });
  
  // Add earth texture to the material with error handling
  textureLoader.load(
    '/earth-blue-marble.jpg', 
    (texture) => {
      globeMaterial.uniforms.globeTexture.value = texture;
      setLoading(false);
    },
    undefined, // onProgress callback
    (error) => {
      console.error('Error loading earth texture:', error);
      // Set a default color as fallback
      globeMaterial.uniforms.globeTexture.value = new THREE.Texture();
      setLoading(false);
    }
  );
  
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);
  
  // Add atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(globeRadius + 2, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);
  
  // Stars background
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8
  });
  
  const starsCount = 3000; // Reduced to improve performance
  const starsPositions = new Float32Array(starsCount * 3);
  
  for (let i = 0; i < starsCount * 3; i += 3) {
    starsPositions[i] = (Math.random() - 0.5) * 2000;
    starsPositions[i + 1] = (Math.random() - 0.5) * 2000;
    starsPositions[i + 2] = (Math.random() - 0.5) * 2000;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  
  return {
    scene,
    camera,
    renderer,
    controls,
    globe,
    globeRadius
  };
};
