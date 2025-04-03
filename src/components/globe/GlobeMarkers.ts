
import * as THREE from 'three';
import { OrderMarker } from '../../types/order';
import { latLongToVector3 } from '../../utils/globeUtils';
import { 
  markerGlowVertexShader,
  markerGlowFragmentShader,
  beamVertexShader,
  beamFragmentShader 
} from './GlobeShaders';

export const createMarkers = (
  markers: OrderMarker[], 
  globeRadius: number, 
  markersGroup: THREE.Group
): void => {
  // Remove old markers
  while (markersGroup.children.length > 0) {
    const object = markersGroup.children[0];
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    if (object.geometry) {
      object.geometry.dispose();
    }
    markersGroup.remove(object);
  }
  
  // Add new markers
  markers.forEach(marker => {
    const { latitude, longitude, timestamp } = marker;
    
    // Convert latitude and longitude to 3D position
    const position = latLongToVector3(latitude, longitude, globeRadius + 1);
    
    // Create marker
    const markerGeometry = new THREE.SphereGeometry(1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(marker.color || 0xff5722),
      transparent: true,
      opacity: 0.8
    });
    
    const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
    markerMesh.position.set(position.x, position.y, position.z);
    markersGroup.add(markerMesh);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(2, 16, 16);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: markerGlowVertexShader,
      fragmentShader: markerGlowFragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(marker.color || 0xff5722) }
      },
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(position.x, position.y, position.z);
    markersGroup.add(glow);
    
    // Beam effect for new orders
    const now = Date.now();
    const orderAge = now - timestamp;
    
    // Only show beam for orders less than 10 seconds old
    if (orderAge < 10000) {
      const beamGeometry = new THREE.CylinderGeometry(0.5, 0.5, 80, 8, 1, true);
      const beamMaterial = new THREE.ShaderMaterial({
        vertexShader: beamVertexShader,
        fragmentShader: beamFragmentShader,
        uniforms: {
          beamColor: { value: new THREE.Color(marker.color || 0xff5722) },
          time: { value: 0 }
        },
        blending: THREE.AdditiveBlending,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      
      // Position and rotate the beam
      beam.position.set(position.x, position.y, position.z);
      beam.lookAt(0, 0, 0);
      beam.rotateX(Math.PI / 2);
      
      // Move half of the beam inside the globe
      const direction = new THREE.Vector3().subVectors(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(position.x, position.y, position.z)
      ).normalize();
      
      beam.position.add(direction.multiplyScalar(40));
      
      markersGroup.add(beam);
    }
  });
};
