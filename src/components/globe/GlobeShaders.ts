
// Vertex shader for the globe
export const globeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for the globe
export const globeFragmentShader = `
  uniform sampler2D globeTexture;
  uniform float glowIntensity;
  uniform vec3 glowColor;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vec4 diffuseColor = texture2D(globeTexture, vUv);
    
    // Add glow based on normal and view direction
    float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5) * glowIntensity;
    vec3 glow = glowColor * intensity;
    
    gl_FragColor = vec4(diffuseColor.rgb + glow, diffuseColor.a);
  }
`;

// Vertex shader for the atmosphere
export const atmosphereVertexShader = `
  varying vec3 vNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for the atmosphere
export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 0.5);
  }
`;

// Vertex shader for markers glow
export const markerGlowVertexShader = `
  varying vec3 vNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for markers glow
export const markerGlowFragmentShader = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, intensity * 0.8);
  }
`;

// Vertex shader for beams
export const beamVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for beams
export const beamFragmentShader = `
  uniform vec3 beamColor;
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    float intensity = sin((vUv.y * 10.0) + time) * 0.5 + 0.5;
    gl_FragColor = vec4(beamColor, intensity * (1.0 - vUv.y) * 0.6);
  }
`;
