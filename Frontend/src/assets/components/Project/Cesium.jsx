import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Sphere, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Earth Atmosphere Shader Material
const EarthAtmosphereMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.3, 0.6, 1.0),
  },
  // vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vPositionNormal), 2.0);
      float pulse = sin(time * 2.0) * 0.1 + 0.9;
      gl_FragColor = vec4(color, 1.0) * intensity * pulse;
    }
  `
);

extend({ EarthAtmosphereMaterial });

// Enhanced Earth Component
function Earth() {
  const earthRef = useRef();
  const atmosphereRef = useRef();
  
  // Create earth texture procedurally
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Create a simple earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#1a472a');
    gradient.addColorStop(0.3, '#2d5a3d');
    gradient.addColorStop(0.5, '#1a472a');
    gradient.addColorStop(0.7, '#0f3460');
    gradient.addColorStop(1, '#1a472a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Add some continent-like shapes
    ctx.fillStyle = '#2d5a3d';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 30 + 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame((state, delta) => {
    earthRef.current.rotation.y += delta * 0.1;
    if (atmosphereRef.current) {
      atmosphereRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <group>
      {/* Main Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[200, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture} 
          metalness={0.1} 
          roughness={0.9}
          emissive={new THREE.Color(0x001122)}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef} scale={1.05}>
        <sphereGeometry args={[200, 32, 32]} />
        <earthAtmosphereMaterial 
          transparent 
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Glowing Atlas Lines with Animation
function AtlasLines({ paths, glowIntensity = 1 }) {
  const lineRefs = useRef([]);
  
  useFrame((state) => {
    lineRefs.current.forEach((lineRef, index) => {
      if (lineRef && lineRef.material) {
        const time = state.clock.elapsedTime;
        const phase = (index * Math.PI * 2) / paths.length;
        const intensity = Math.sin(time * 2 + phase) * 0.3 + 0.7;
        lineRef.material.color.setRGB(0, intensity * glowIntensity, intensity * glowIntensity * 1.5);
        lineRef.material.opacity = intensity * 0.8 + 0.2;
      }
    });
  });
  
  return (
    <group>
      {paths.map((points, index) => (
        <group key={index}>
          {/* Main glowing line */}
          <Line
            ref={(ref) => lineRefs.current[index] = ref}
            points={points.map(p => new THREE.Vector3(...p))}
            color="#00ffff"
            lineWidth={3}
            transparent
            opacity={0.8}
          />
          
          {/* Outer glow effect */}
          <Line
            points={points.map(p => new THREE.Vector3(...p))}
            color="#004455"
            lineWidth={8}
            transparent
            opacity={0.2}
          />
        </group>
      ))}
      
      {/* Convergence point indicator */}
      <mesh position={[120, 260, 450]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial 
          color="#00ffff"
          transparent
          opacity={0.6}
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// Spacecraft with Trail Effect
function Spacecraft({ pathPoints }) {
  const meshRef = useRef();
  const trailRef = useRef([]);
  const progressRef = useRef(0);
  const trailPositions = useRef([]);
  
  // Create simple spacecraft texture
  const spacecraftTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#silver';
    ctx.fillRect(0, 0, 64, 64);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 20, 24, 24);
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(32, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current || pathPoints.length < 2) return;
    
    progressRef.current += delta * 0.05;
    if (progressRef.current > 1) progressRef.current = 0; // Loop the animation
    
    const totalPoints = pathPoints.length - 1;
    const pointIndex = Math.floor(progressRef.current * totalPoints);
    const nextIndex = Math.min(pointIndex + 1, totalPoints);
    const current = pathPoints[pointIndex];
    const next = pathPoints[nextIndex];
    const localProgress = (progressRef.current * totalPoints) % 1;
    
    const currentPos = new THREE.Vector3(...Object.values(current));
    const nextPos = new THREE.Vector3(...Object.values(next));
    
    meshRef.current.position.lerpVectors(currentPos, nextPos, localProgress);
    
    // Look at direction of movement
    const direction = new THREE.Vector3().subVectors(nextPos, currentPos).normalize();
    meshRef.current.lookAt(meshRef.current.position.clone().add(direction));
    
    // Update trail
    trailPositions.current.push(meshRef.current.position.clone());
    if (trailPositions.current.length > 30) {
      trailPositions.current.shift();
    }
  });
  
  return (
    <group>
      {/* Spacecraft */}
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 2, 8]} />
        <meshStandardMaterial 
          map={spacecraftTexture}
          metalness={0.8}
          roughness={0.2}
          emissive="#001155"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Engine glow */}
      <mesh ref={meshRef} position={[0, 0, -6]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial 
          color="#0088ff"
          transparent
          opacity={0.6}
          emissive="#0088ff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

// Enhanced Stars Component
function EnhancedStars() {
  return (
    <>
      <Stars 
        radius={2000} 
        depth={1000} 
        count={15000} 
        factor={6} 
        saturation={0.1} 
        fade 
        speed={0.5}
      />
      <Stars 
        radius={1500} 
        depth={800} 
        count={8000} 
        factor={4} 
        saturation={0.3} 
        fade 
        speed={0.8}
      />
      <Stars 
        radius={1000} 
        depth={500} 
        count={5000} 
        factor={2} 
        saturation={0.5} 
        fade 
        speed={1.2}
      />
    </>
  );
}

// Main Scene Component
export default function AtlasMissionScene() {
  // Enhanced Atlas crossing lines with more realistic orbital mechanics
  const atlasPaths = [
    [
      [0, 200, 0],        // Earth surface
      [100, 400, 200],    // First trajectory point
      [80, 350, 350],     // Approach vector
      [120, 260, 450],    // Atlas docking point
    ],
    [
      [0, 200, 0],
      [-80, 380, 150],
      [40, 320, 300],
      [120, 260, 450],
    ],
    [
      [0, 200, 0],
      [50, 320, 100],
      [150, 280, 250],
      [120, 260, 450],
    ],
    [
      [0, 200, 0],
      [-60, 350, 180],
      [20, 380, 320],
      [120, 260, 450],
    ],
  ];
  
  // Spacecraft follows the first trajectory
  const spacecraftPath = atlasPaths[0].map(point => ({
    x: point[0],
    y: point[1],
    z: point[2]
  }));
  
  return (
    <Canvas 
      camera={{ 
        position: [800, 600, 1000], 
        fov: 45,
        near: 1,
        far: 5000
      }} 
      shadows
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      {/* Lighting Setup */}
      <ambientLight intensity={0.2} color="#001122" />
      <directionalLight 
        position={[500, 800, 400]} 
        intensity={1.2} 
        castShadow
        color="#ffffff"
      />
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        color="#ffaa00"
        distance={1000}
      />
      
      {/* Background */}
      <EnhancedStars />
      
      {/* Scene Content */}
      <Suspense fallback={null}>
        <Earth />
        <AtlasLines paths={atlasPaths} />
        <Spacecraft pathPoints={spacecraftPath} />
      </Suspense>
      
      {/* Camera Controls */}
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate 
        maxDistance={2000}
        minDistance={300}
        autoRotate
        autoRotateSpeed={0.2}
        target={[60, 230, 225]} // Focus between Earth and docking point
      />
    </Canvas>
  );
}