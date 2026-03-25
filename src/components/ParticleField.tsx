"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, originalPositions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      sz[i] = Math.random() * 2 + 0.5;
    }

    return [pos, origPos, sz];
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;

    mouse.current.x = pointer.x * viewport.width * 0.5;
    mouse.current.y = pointer.y * viewport.height * 0.5;

    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Gentle floating motion
      arr[i3] = ox + Math.sin(t * 0.3 + i * 0.01) * 0.15;
      arr[i3 + 1] = oy + Math.cos(t * 0.2 + i * 0.015) * 0.15;
      arr[i3 + 2] = oz + Math.sin(t * 0.1 + i * 0.02) * 0.1;

      // Mouse repulsion
      const dx = arr[i3] - mouse.current.x;
      const dy = arr[i3 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2.5) {
        const force = (2.5 - dist) / 2.5;
        arr[i3] += dx * force * 0.3;
        arr[i3 + 1] += dy * force * 0.3;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.rotation.x = Math.sin(t * 0.2) * 0.3 + pointer.y * 0.2;
    mesh.current.rotation.y = t * 0.15 + pointer.x * 0.3;
    mesh.current.rotation.z = Math.cos(t * 0.1) * 0.1;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -3]}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0" style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Particles />
        <FloatingMesh />
      </Canvas>
    </div>
  );
}
