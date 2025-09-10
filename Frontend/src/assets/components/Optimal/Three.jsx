// AtlasXHeader3D.jsx
import React, { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// ---------- Planet ----------
function Planet({ position = [0, 0, 0], radius = 1.2 }) {
  const mesh = useRef();
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.08;
      mesh.current.rotation.x += delta * 0.007;
    }
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          roughness={0.6}
          metalness={0.1}
          clearcoat={0.1}
          envMapIntensity={0.6}
          color={"#6fb3ff"}
        />
      </mesh>

      {/* Glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          transparent
          opacity={0.15}
          toneMapped={false}
          color={"#9fd4ff"}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[1.2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[radius * 1.5, 0.075, 8, 120]} />
        <meshStandardMaterial
          color={"#c7d9ff"}
          metalness={0.8}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// ---------- Satellite ----------
function Satellite({ distance = 3.2 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.x = Math.cos(t * 0.6) * distance;
      ref.current.position.z = Math.sin(t * 0.6) * distance;
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.26, 0.14, 0.12]} />
        <meshStandardMaterial
          color={"#dfe7ff"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.12, 0.09, 0]} rotation-z={0.5}>
        <cylinderGeometry args={[0.01, 0.01, 0.28, 6]} />
        <meshStandardMaterial color={"#a6b8ff"} />
      </mesh>
    </group>
  );
}

// ---------- Asteroid Field ----------
function AsteroidField({ count = 60, radius = 6 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = (Math.random() - 0.5) * Math.PI;
      const r = radius * (0.6 + Math.random() * 0.8);
      const x = Math.cos(phi) * Math.cos(theta) * r;
      const y = Math.sin(theta) * r * 0.3;
      const z = Math.sin(phi) * Math.cos(theta) * r;
      arr.push({
        x,
        y,
        z,
        s: 0.05 + Math.random() * 0.25,
        rx: Math.random(),
        ry: Math.random(),
        rz: Math.random(),
      });
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    rocks.forEach((r, i) => {
      const t = state.clock.getElapsedTime() * (0.02 + (i % 5) * 0.002);
      dummy.position.set(
        r.x + Math.sin(t + i) * 0.02,
        r.y + Math.cos(t * 0.9 + i) * 0.02,
        r.z + Math.sin(t * 0.7 + i) * 0.02
      );
      dummy.rotation.set(r.rx * t, r.ry * t * 0.8, r.rz * t * 0.6);
      dummy.scale.setScalar(r.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.9} metalness={0.1} color={"#cfc6c1"} />
    </instancedMesh>
  );
}

// ---------- Main Header ----------
export default function AtlasXHeader3D({ height = 520 }) {
  return (
    <div className="w-full" style={{ height: height }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} shadows>
        <color attach="background" args={["#03040a"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />

        <Suspense fallback={null}>
          <Float floatIntensity={0.8} rotationIntensity={0.3}>
            <Planet position={[-1.6, -0.2, 0]} radius={1.3} />
          </Float>

          <Float floatIntensity={0.6} rotationIntensity={0.2}>
            <Planet position={[2.0, 0.2, -1.2]} radius={0.7} />
          </Float>

          <Satellite distance={3.2} />

          <AsteroidField count={70} radius={7} />

          <Stars
            radius={100}
            depth={50}
            count={8000}
            factor={4}
            saturation={0}
            fade
          />
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3.8}
          rotateSpeed={0.4}
        />

        <Html center fullscreen style={{ pointerEvents: "none" }}>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
              ATLASX
            </h1>
            <p className="mt-2 text-sm md:text-lg text-gray-300">
              Explore · Design · Launch
            </p>
          </div>
        </Html>
      </Canvas>
    </div>
  );
}
