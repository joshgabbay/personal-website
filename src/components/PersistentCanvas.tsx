"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1800;

// Shared state updated from DOM events (since canvas has pointerEvents: none)
const globalMouse = { x: 0, y: 0 };
let globalScrollSpeed = 0;

function generateTargets(count: number) {
  const hero = new Float32Array(count * 3);
  const projects = new Float32Array(count * 3);
  const about = new Float32Array(count * 3);
  const contact = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    hero[i3] = (Math.random() - 0.5) * 20;
    hero[i3 + 1] = (Math.random() - 0.5) * 16;
    hero[i3 + 2] = (Math.random() - 0.5) * 10 - 2;

    const cluster = i % 3;
    const cx = (cluster - 1) * 5;
    projects[i3] = cx + (Math.random() - 0.5) * 3;
    projects[i3 + 1] = (Math.random() - 0.5) * 4;
    projects[i3 + 2] = (Math.random() - 0.5) * 3 - 2;

    const cols = 50;
    const row = Math.floor(i / cols);
    const col = i % cols;
    about[i3] = (col / cols - 0.5) * 18;
    about[i3 + 1] = (row / (count / cols) - 0.5) * 14;
    about[i3 + 2] = (Math.random() - 0.5) * 1 - 3;

    const angle = (i / count) * Math.PI * 12;
    const radius = (1 - i / count) * 8;
    contact[i3] = Math.cos(angle) * radius;
    contact[i3 + 1] = Math.sin(angle) * radius;
    contact[i3 + 2] = (i / count) * -6 - 1;
  }

  return [hero, projects, about, contact];
}

function MorphingParticles({ scene, meshRef }: { scene: number; meshRef: React.RefObject<THREE.Points | null> }) {
  const mesh = meshRef;
  const { viewport, size } = useThree();
  const smoothSpeed = useRef(0);

  const [targets] = useMemo(() => [generateTargets(PARTICLE_COUNT)], []);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = targets[0][i * 3];
      pos[i * 3 + 1] = targets[0][i * 3 + 1];
      pos[i * 3 + 2] = targets[0][i * 3 + 2];
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, [targets]);

  const colors = useMemo(() => [
    [0.39, 0.4, 0.95],
    [0.45, 0.35, 0.95],
    [0.35, 0.5, 0.95],
    [0.55, 0.4, 1.0],
  ], []);

  const currentColorRef = useRef([0.39, 0.4, 0.95]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const target = targets[scene] || targets[0];
    const targetColor = colors[scene] || colors[0];

    smoothSpeed.current += (globalScrollSpeed - smoothSpeed.current) * 0.1;
    const vel = smoothSpeed.current;

    currentColorRef.current[0] += (targetColor[0] - currentColorRef.current[0]) * 0.02;
    currentColorRef.current[1] += (targetColor[1] - currentColorRef.current[1]) * 0.02;
    currentColorRef.current[2] += (targetColor[2] - currentColorRef.current[2]) * 0.02;

    const mat = mesh.current.material as THREE.PointsMaterial;
    mat.color.setRGB(currentColorRef.current[0], currentColorRef.current[1], currentColorRef.current[2]);
    mat.size = 0.025 + vel * 0.04;

    // Convert global mouse (0-1 normalized) to world coordinates
    const mx = (globalMouse.x - 0.5) * viewport.width;
    const my = -(globalMouse.y - 0.5) * viewport.height;

    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      arr[i3] += (target[i3] - arr[i3]) * 0.015;
      arr[i3 + 1] += (target[i3 + 1] - arr[i3 + 1]) * 0.015;
      arr[i3 + 2] += (target[i3 + 2] - arr[i3 + 2]) * 0.015;

      arr[i3] += Math.sin(t * 0.3 + i * 0.01) * 0.003;
      arr[i3 + 1] += Math.cos(t * 0.2 + i * 0.015) * 0.003;

      arr[i3 + 1] += Math.sin(i * 0.5 + t * 2) * vel * 0.3;
      arr[i3] += Math.cos(i * 0.7 + t * 3) * vel * 0.08;

      // Mouse repulsion
      const dx = arr[i3] - mx;
      const dy = arr[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        const force = (2 - dist) / 2;
        arr[i3] += dx * force * 0.15;
        arr[i3 + 1] += dy * force * 0.15;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={PARTICLE_COUNT} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={PARTICLE_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const MAX_CONNECTIONS = 30;
const CONNECTION_DISTANCE = 2.5;

function MouseConnections({ particleMeshRef }: { particleMeshRef: React.RefObject<THREE.Points | null> }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  const linePositions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);

  useFrame(() => {
    if (!lineRef.current || !particleMeshRef.current) return;

    const mx = (globalMouse.x - 0.5) * viewport.width;
    const my = -(globalMouse.y - 0.5) * viewport.height;

    const posAttr = particleMeshRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    let count = 0;
    for (let i = 0; i < PARTICLE_COUNT && count < MAX_CONNECTIONS; i++) {
      const i3 = i * 3;
      const dx = arr[i3] - mx;
      const dy = arr[i3 + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DISTANCE) {
        const c6 = count * 6;
        linePositions[c6] = mx;
        linePositions[c6 + 1] = my;
        linePositions[c6 + 2] = 0;
        linePositions[c6 + 3] = arr[i3];
        linePositions[c6 + 4] = arr[i3 + 1];
        linePositions[c6 + 5] = arr[i3 + 2];
        count++;
      }
    }

    for (let i = count * 6; i < MAX_CONNECTIONS * 6; i++) {
      linePositions[i] = 0;
    }

    const attr = lineRef.current.geometry.attributes.position;
    (attr.array as Float32Array).set(linePositions);
    attr.needsUpdate = true;
    lineRef.current.geometry.setDrawRange(0, count * 2);
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={MAX_CONNECTIONS * 2} />
      </bufferGeometry>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function FloatingWireframe({ scene }: { scene: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const px = (globalMouse.x - 0.5) * 2;
    const py = -(globalMouse.y - 0.5) * 2;
    mesh.current.rotation.x = Math.sin(t * 0.15) * 0.3 + py * 0.15;
    mesh.current.rotation.y = t * 0.1 + px * 0.2;

    const targetOpacity = scene === 0 ? 0.07 : 0.02;
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity += (targetOpacity - mat.opacity) * 0.03;

    const targetScale = scene === 3 ? 1.5 : scene === 0 ? 2.5 : 1.8;
    mesh.current.scale.setScalar(mesh.current.scale.x + (targetScale - mesh.current.scale.x) * 0.02);
  });

  return (
    <mesh ref={mesh} position={[0, 0, -4]} scale={2.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.07} />
    </mesh>
  );
}

function AmbientLight() {
  const light = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (!light.current) return;
    light.current.position.x = (globalMouse.x - 0.5) * viewport.width * 0.8;
    light.current.position.y = -(globalMouse.y - 0.5) * viewport.height * 0.8;
    light.current.position.z = 3;
  });

  return <pointLight ref={light} color="#6366f1" intensity={2} distance={12} />;
}

function SceneAdapter({ scene }: { scene: number }) {
  const particleMeshRef = useRef<THREE.Points>(null);

  return (
    <>
      <MorphingParticles scene={scene} meshRef={particleMeshRef} />
      <MouseConnections particleMeshRef={particleMeshRef} />
      <FloatingWireframe scene={scene} />
      <AmbientLight />
    </>
  );
}

export default function PersistentCanvas({ scene, scrollSpeedRef }: { scene: number; scrollSpeedRef?: React.RefObject<number> }) {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      globalMouse.x = e.clientX / window.innerWidth;
      globalMouse.y = e.clientY / window.innerHeight;
    };
    const handleScroll = () => {
      globalScrollSpeed = scrollSpeedRef?.current ?? 0;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollSpeedRef]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneAdapter scene={scene} />
      </Canvas>
    </div>
  );
}
