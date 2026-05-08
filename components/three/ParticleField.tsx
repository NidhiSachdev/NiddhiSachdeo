"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 800;

export type ParticleMouseRef = React.MutableRefObject<{ x: number; y: number }>;

function MorphingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.rotation.x = t * 0.07;
    mesh.rotation.y = t * 0.11;
    mesh.rotation.z = Math.sin(t * 0.15) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.35, 56, 56]} />
      <MeshDistortMaterial
        color="#2d7dff"
        emissive="#7c3aed"
        emissiveIntensity={0.35}
        transparent
        opacity={0.22}
        roughness={0.15}
        metalness={0.35}
        distort={0.38}
        speed={1.8}
      />
    </mesh>
  );
}

function ParticlePoints({ mouseRef }: { mouseRef: ParticleMouseRef }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colors, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT * 3);

    const blue = new THREE.Color("#0a84ff");
    const purple = new THREE.Color("#bf5af2");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 5 + Math.random() * 14;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi) * 0.85 + (Math.random() - 0.5) * 4;

      const mixPurple = Math.random();
      const c = blue.clone().lerp(purple, mixPurple);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      phases[i3] = Math.random() * Math.PI * 2;
      phases[i3 + 1] = Math.random() * Math.PI * 2;
      phases[i3 + 2] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, phases };
  }, []);

  const basePositions = useMemo(() => positions.slice(), [positions]);

  useFrame((state, delta) => {
    const geom = geomRef.current;
    const attr = geom?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!geom || !attr?.array) return;

    const posArr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const viewport = state.viewport;

    const mx = mouseRef.current.x * (viewport.width / 2);
    const my = mouseRef.current.y * (viewport.height / 2);

    const damp = Math.min(delta * 60, 2);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const bx = basePositions[i3]!;
      const by = basePositions[i3 + 1]!;
      const bz = basePositions[i3 + 2]!;

      const driftX =
        Math.sin(t * 0.35 + phases[i3]!) * 0.12 +
        Math.cos(t * 0.22 + phases[i3 + 1]! * 2) * 0.06;
      const driftY =
        Math.cos(t * 0.28 + phases[i3 + 1]!) * 0.12 +
        Math.sin(t * 0.31 + phases[i3 + 2]!) * 0.06;
      const driftZ =
        Math.sin(t * 0.2 + phases[i3 + 2]!) * 0.05 +
        Math.cos(t * 0.18 + phases[i3]!) * 0.04;

      let x = bx + driftX;
      let y = by + driftY;
      let z = bz + driftZ;

      const dx = x - mx * 1.15;
      const dy = y - my * 1.15;
      const distSq = dx * dx + dy * dy + 2.5;
      const len = Math.sqrt(distSq);
      const repel = (3.2 / distSq) * damp * 0.018;

      x += (dx / len) * repel * 40;
      y += (dy / len) * repel * 40;

      posArr[i3] = THREE.MathUtils.lerp(posArr[i3]!, x, 0.12 * damp);
      posArr[i3 + 1] = THREE.MathUtils.lerp(posArr[i3 + 1]!, y, 0.12 * damp);
      posArr[i3 + 2] = THREE.MathUtils.lerp(posArr[i3 + 2]!, z, 0.08 * damp);
    }

    attr.needsUpdate = true;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.92}
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ mouseRef }: { mouseRef: ParticleMouseRef }) {
  return (
    <>
      <fog attach="fog" args={["#030308", 12, 38]} />
      <ambientLight intensity={0.35} />
      <ParticlePoints mouseRef={mouseRef} />
      <MorphingOrb />
    </>
  );
}

type ParticleFieldProps = {
  /** Normalized pointer (-1..1); update from parent for GPU particles + non-blocking UI */
  mouseRef?: ParticleMouseRef;
};

export default function ParticleField({ mouseRef: mouseProp }: ParticleFieldProps) {
  const internalMouse = useRef({ x: 0, y: 0 });
  const mouseRef = mouseProp ?? internalMouse;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 h-full min-h-[100vh] w-full select-none"
      aria-hidden
    >
      <Suspense fallback={null}>
        <Canvas
          className="absolute inset-0 [&_*]:pointer-events-none"
          camera={{ position: [0, 0, 14], fov: 55 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
          }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Scene mouseRef={mouseRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
