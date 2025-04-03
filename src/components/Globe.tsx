
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrderMarker } from '../types/order';
import { createGlobeScene } from './globe/GlobeScene';
import { createMarkers } from './globe/GlobeMarkers';

interface GlobeProps {
  markers: OrderMarker[];
}

const Globe = ({ markers }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: any;
    markersGroup: THREE.Group;
    globeRadius: number;
    clock: THREE.Clock;
    animationFrameId?: number;
  }>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Setup scene only once
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;
    
    // Create globe scene
    const { 
      scene, 
      camera, 
      renderer, 
      controls, 
      globeRadius 
    } = createGlobeScene(containerRef.current, setIsLoading);
    
    // Create markers group
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    
    // Setup animation
    const clock = new THREE.Clock();
    
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      markersGroup,
      globeRadius,
      clock
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        const { animationFrameId, renderer, controls, scene } = sceneRef.current;
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        if (scene.children.length > 0) {
          // Remove all objects from the scene
          while(scene.children.length > 0) { 
            const object = scene.children[0];
            scene.remove(object);
          }
        }
        
        controls.dispose();
        renderer.dispose();
        
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        
        sceneRef.current = null;
      }
    };
  }, []);
  
  // Update markers and animate scene
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const {
      scene,
      camera,
      renderer,
      controls,
      markersGroup,
      globeRadius,
      clock
    } = sceneRef.current;
    
    // Create or update markers
    createMarkers(markers, globeRadius, markersGroup);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Update beam animations
      markersGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && 
            child.material instanceof THREE.ShaderMaterial && 
            child.material.uniforms && 
            child.material.uniforms.time) {
          child.material.uniforms.time.value = clock.getElapsedTime();
        }
      });
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
    };
  }, [markers]);
  
  return (
    <div className="absolute inset-0" ref={containerRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-xl text-primary pulse">Loading globe...</div>
        </div>
      )}
    </div>
  );
};

export default Globe;
