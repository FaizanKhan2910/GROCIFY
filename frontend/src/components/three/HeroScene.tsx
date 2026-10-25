"use client";

/**
 * ============================================================================
 * GROCIFY 3D HERO PRODUCT CLUSTER SCENE
 * ============================================================================
 * High-end cinematic centerpiece using React Three Fiber, Drei, and procedural materials.
 * Displays a curated floating cluster of real Grocify essentials:
 * - Glass Mustard Oil Bottle with pure cold-pressed oil & cork stopper
 * - Pure Copper Tongue Scraper (Ayurvedic grade, high metalness)
 * - Seasoned Neem Wood Wide-Tooth Comb
 * - Coconut Coir Scrub Brush
 *
 * TUNABLE PARAMETERS:
 * - ROTATION_SENSITIVITY: 0.22 (Parallax tilt responsiveness to cursor)
 * - FLOAT_AMPLITUDE: 0.08 (Sine wave vertical hover distance)
 * - FLOAT_SPEED: 0.9 (Hover oscillation frequency)
 * - DAMPING_FACTOR: 3.5 (Smoothing factor for cursor tracking)
 * ============================================================================
 */

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

export const HERO_3D_TUNABLES = {
  rotationSensitivity: 0.22,
  floatAmplitude: 0.08,
  floatSpeed: 0.9,
  dampingFactor: 3.5,
  cameraFov: 38,
  dprRange: [1, 1.5] as [number, number],
} as const;

// Deterministic coordinates computed once at module level for React 19 purity
const MOTES_COUNT = 45;
const STATIC_MOTES_POSITIONS = (() => {
  const coords = new Float32Array(MOTES_COUNT * 3);
  for (let i = 0; i < MOTES_COUNT; i++) {
    const s1 = Math.sin((i + 1) * 12.9898) * 43758.5453;
    const s2 = Math.sin((i + 1) * 78.233) * 43758.5453;
    const s3 = Math.sin((i + 1) * 37.719) * 43758.5453;
    coords[i * 3] = (s1 - Math.floor(s1) - 0.5) * 6;
    coords[i * 3 + 1] = (s2 - Math.floor(s2) - 0.5) * 4;
    coords[i * 3 + 2] = (s3 - Math.floor(s3) - 0.5) * 3;
  }
  return coords;
})();

// 1. Procedural Glass Mustard Oil Bottle with Cork Stopper
function MustardOilBottle(props: React.JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      {/* Outer Glass Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 1.4, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={256}
          transmission={0.96}
          roughness={0.08}
          thickness={0.5}
          ior={1.52}
          chromaticAberration={0.04}
          color="#FFFDF5"
        />
      </mesh>

      {/* Golden Mustard Oil Core Inside */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 1.15, 32]} />
        <meshStandardMaterial
          color="#D49018"
          roughness={0.12}
          metalness={0.1}
          emissive="#613B00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.35, 32]} />
        <MeshTransmissionMaterial
          samples={6}
          resolution={128}
          transmission={0.95}
          roughness={0.06}
          thickness={0.4}
          ior={1.52}
          color="#FFFDF5"
        />
      </mesh>

      {/* Cork Stopper */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 0.22, 24]} />
        <meshStandardMaterial color="#A87A4F" roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Minimalist Kraft Label */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.385, 0.425, 0.65, 32, 1, true, 0, Math.PI * 1.3]} />
        <meshStandardMaterial color="#F4EFE6" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 2. Pure Copper Tongue Scraper (Curved Ayurvedic Metallic Arch)
function CopperScraper(props: React.JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      {/* Curved Tongue Cleaning Arch */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.032, 20, 48, Math.PI * 0.95]} />
        <meshStandardMaterial
          color="#D97A52"
          metalness={0.98}
          roughness={0.16}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Left Handle */}
      <mesh position={[-0.41, -0.15, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.03, 0.032, 0.75, 20]} />
        <meshStandardMaterial color="#D97A52" metalness={0.98} roughness={0.16} />
      </mesh>

      {/* Right Handle */}
      <mesh position={[0.41, -0.15, 0]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.03, 0.032, 0.75, 20]} />
        <meshStandardMaterial color="#D97A52" metalness={0.98} roughness={0.16} />
      </mesh>
    </group>
  );
}

// 3. Seasoned Neem Wood Comb (Ergonomic Spine + Wide Teeth)
function NeemWoodComb(props: React.JSX.IntrinsicElements["group"]) {
  const teeth = useMemo(() => Array.from({ length: 9 }), []);

  return (
    <group {...props}>
      {/* Comb Spine */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.1, 0.2, 0.05]} />
        <meshStandardMaterial color="#7D431F" roughness={0.68} metalness={0.04} />
      </mesh>

      {/* Wide Neem Teeth */}
      {teeth.map((_, i) => (
        <mesh key={i} position={[-0.44 + i * 0.11, 0.02, 0]}>
          <boxGeometry args={[0.038, 0.44, 0.04]} />
          <meshStandardMaterial color="#864A24" roughness={0.65} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// 4. Plant-Fiber Coir Scrub Brush
function CoirScrubBrush(props: React.JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      {/* Ergonomic Beechwood Grip */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.32, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#D6B287" roughness={0.6} metalness={0.02} />
      </mesh>

      {/* Wooden Base Collar */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.35, 0.14, 28]} />
        <meshStandardMaterial color="#C7A175" roughness={0.62} metalness={0.02} />
      </mesh>

      {/* Coir / Coconut Fiber Bristles */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.36, 0.42, 0.46, 28]} />
        <meshStandardMaterial
          color="#67472A"
          roughness={0.95}
          bumpScale={0.05}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

// Floating Ambient Dust / Leaf Motes
function AmbientMotes() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_MOTES_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#D4E87A"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Interactive Product Cluster with Cursor Parallax
function ProductCluster() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Scroll factor between hero and catalog
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollFactor = Math.min(scrollY / 700, 1);

    // Scroll-linked rotation & scale-down
    const scrollRotY = scrollFactor * 1.6;
    const scrollRotX = scrollFactor * 0.25;
    const targetScale = 1.0 - scrollFactor * 0.26;
    const targetPosY = -scrollFactor * 0.32;

    // Smooth cursor parallax tilt combined with scroll choreography
    const targetRotY = state.pointer.x * HERO_3D_TUNABLES.rotationSensitivity + scrollRotY;
    const targetRotX = -state.pointer.y * (HERO_3D_TUNABLES.rotationSensitivity * 0.7) + scrollRotX;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      HERO_3D_TUNABLES.dampingFactor,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      HERO_3D_TUNABLES.dampingFactor,
      delta
    );

    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.damp(currentScale, targetScale, 3.5, delta);
    groupRef.current.scale.set(newScale, newScale, newScale);

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosY,
      3.5,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      {/* 1. Mustard Oil Bottle (Center Primary Focus) */}
      <Float
        speed={HERO_3D_TUNABLES.floatSpeed}
        rotationIntensity={0.2}
        floatIntensity={0.4}
        floatingRange={[-0.05, 0.05]}
      >
        <MustardOilBottle
          position={[-0.1, -0.05, 0.2]}
          rotation={[0.08, -0.25, 0.04]}
          scale={1.22}
        />
      </Float>

      {/* 2. Copper Tongue Scraper (Right Diagonal) */}
      <Float
        speed={HERO_3D_TUNABLES.floatSpeed * 1.1}
        rotationIntensity={0.3}
        floatIntensity={0.5}
        floatingRange={[-0.08, 0.08]}
      >
        <CopperScraper
          position={[1.2, 0.35, -0.2]}
          rotation={[0.3, 0.4, -0.25]}
          scale={0.95}
        />
      </Float>

      {/* 3. Neem Wood Comb (Left Foreground Accent) */}
      <Float
        speed={HERO_3D_TUNABLES.floatSpeed * 0.9}
        rotationIntensity={0.25}
        floatIntensity={0.45}
        floatingRange={[-0.06, 0.06]}
      >
        <NeemWoodComb
          position={[-1.25, 0.2, 0.1]}
          rotation={[-0.2, 0.35, 0.45]}
          scale={0.92}
        />
      </Float>

      {/* 4. Coir Scrub Brush (Bottom Right Accent) */}
      <Float
        speed={HERO_3D_TUNABLES.floatSpeed * 1.05}
        rotationIntensity={0.3}
        floatIntensity={0.35}
        floatingRange={[-0.05, 0.05]}
      >
        <CoirScrubBrush
          position={[0.9, -0.75, 0.35]}
          rotation={[0.4, -0.3, 0.2]}
          scale={0.9}
        />
      </Float>
    </group>
  );
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    const currentEl = containerRef.current;
    observer.observe(currentEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] select-none"
    >
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 4.3], fov: HERO_3D_TUNABLES.cameraFov }}
        dpr={HERO_3D_TUNABLES.dprRange}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Soft Studio Lighting */}
        <ambientLight intensity={0.75} color="#FFFBF0" />
        <directionalLight
          position={[4.5, 6.5, 4]}
          intensity={1.8}
          color="#FFF8E7"
          castShadow
        />
        <pointLight position={[-4, 3, -2]} intensity={0.8} color="#D4E87A" />

        {/* Ambient Floating Dust Motes */}
        <AmbientMotes />

        {/* Floating Product Ensemble */}
        <ProductCluster />

        {/* Subtle Ground Contact Shadow on Warm Ivory */}
        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.38}
          scale={6.5}
          blur={2.4}
          far={3.8}
          color="#173D2D"
        />

        {/* Programmatic studio-style lighting — no external HDR fetch */}
        <ambientLight intensity={0.55} color="#f0ede6" />
        <directionalLight position={[4, 8, 5]} intensity={1.4} color="#ffffff" castShadow={false} />
        <directionalLight position={[-3, 2, -4]} intensity={0.5} color="#c8d8c0" />
        <pointLight position={[0, 6, 0]} intensity={0.3} color="#d4e87a" />
      </Canvas>
    </div>
  );
}
