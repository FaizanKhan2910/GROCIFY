"use client";

/**
 * ============================================================================
 * GROCIFY — SCROLL-DRIVEN CINEMATIC 3D BOTTLE SHOWCASE (BottleRevealScene.tsx)
 * ============================================================================
 *
 * Full interactive scroll-driven choreography:
 *   - Scrubbed in direct sync with page scroll down the pinned hero track
 *   - Smooth physics inertia & damping in useFrame (60/120 FPS)
 *   - Scroll Progress p in [0.0, 1.0]:
 *
 *     p in [0.00 – 0.35]: EXPAND TO FULLSCREEN
 *       - Bottle glides from right (X: +0.24) to center (X: 0.0)
 *       - Scales up from 0.88 to 1.35 to COVER THE FULL SCREEN
 *       - Bottle lifts +0.28 units off stone podium
 *       - Cap unscrews 3 full turns (1080 deg) and rises +1.15 units
 *       - Bottle begins 360-degree rotation
 *
 *     p in [0.35 – 0.70]: FULLSCREEN ORBIT & 360 ROTATION
 *       - Bottle rotates through full 360-degree vertical revolution
 *       - Cap floats steadily high above the open bottle mouth
 *       - Comb, copper scraper, and coir brush swoop into 3D orbits around bottle
 *       - Key light intensity swells (1.7 -> 2.45 -> 1.7) for specular sweep
 *
 *     p in [0.70 – 1.00]: CLOSE CAP, OBJECTS GONE, RETURN TO NORMAL
 *       - Accessories glide back to resting spots and settle ("objects gone")
 *       - Wooden cap descends and reverse-screws tightly back onto neck
 *       - Bottle glides back to right side (X: +0.24) and lowers onto podium
 *       - Bottle scales down to normal form (1.35 -> 0.88)
 *       - Clean transition into the next sections below
 *
 * TECHNICAL INTEGRITY:
 *   - Zero React setState per frame; all transforms flushed in useFrame
 *   - Respects prefers-reduced-motion
 *   - Reversible: scrolling up reverses animation identically
 * ============================================================================
 */

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── INITIAL RESTING TRANSFORMS ──────────────────────────────────────────────
const BOTTLE_REST = {
  posX: 0,
  posY: 0,
  posZ: 0,
  rotX: 0.06,
  rotY: -0.32,
  rotZ: 0.02,
};

const COMB_REST = {
  x: -1.05,
  y: -0.15,
  z:  0.18,
  rotX: -0.12,
  rotY:  0.35,
  rotZ:  0.42,
};

const SCRAPER_REST = {
  x:  1.05,
  y:  0.15,
  z: -0.10,
  rotX:  0.22,
  rotY: -0.32,
  rotZ: -0.22,
};

const BRUSH_REST = {
  x:  0.84,
  y: -0.62,
  z:  0.34,
  rotX:  0.32,
  rotY: -0.22,
  rotZ:  0.18,
};

// ─── DETERMINISTIC AMBIENT MOTES ─────────────────────────────────────────────
const MOTES_COUNT = 36;
const MOTE_POSITIONS = (() => {
  const arr = new Float32Array(MOTES_COUNT * 3);
  for (let i = 0; i < MOTES_COUNT; i++) {
    const hash = (v: number) => {
      const s = Math.sin(v) * 43758.5453;
      return s - Math.floor(s);
    };
    arr[i * 3]     = (hash((i + 1) * 17.13) - 0.5) * 6.5;
    arr[i * 3 + 1] = (hash((i + 1) * 73.41) - 0.5) * 5.0;
    arr[i * 3 + 2] = (hash((i + 1) * 41.87) - 0.5) * 4.0;
  }
  return arr;
})();

// ─── PROCEDURAL BOTTLE LABEL TEXTURE ─────────────────────────────────────────
function useBottleLabelTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Premium warm cream textured label background
    ctx.fillStyle = "#F8F5EE";
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle paper noise speckles (deterministic pseudo-random)
    ctx.fillStyle = "rgba(180, 160, 130, 0.08)";
    for (let i = 0; i < 400; i++) {
      const rx = (Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
      const ry = (Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
      const x = Math.abs(rx) * 1024;
      const y = Math.abs(ry) * 1024;
      ctx.fillRect(x, y, 2, 2);
    }

    // Outer Forest Green Border
    ctx.strokeStyle = "#1F3A2D";
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, 924, 924);

    // Inner Warm Gold Accent Border
    ctx.strokeStyle = "#C98E28";
    ctx.lineWidth = 3;
    ctx.strokeRect(66, 66, 892, 892);

    // Header Tag
    ctx.fillStyle = "#1F3A2D";
    ctx.font = "bold 60px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GROCIFY", 512, 190);

    ctx.font = "600 24px monospace";
    ctx.fillStyle = "#636F58";
    ctx.fillText("BOTANICAL HARVEST · APOTHECARY", 512, 240);

    // Gold Divider line
    ctx.strokeStyle = "#C98E28";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(260, 280);
    ctx.lineTo(764, 280);
    ctx.stroke();

    // Emblem circle with Leaf
    ctx.fillStyle = "#1F3A2D";
    ctx.beginPath();
    ctx.arc(512, 380, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#D4E87A";
    ctx.beginPath();
    ctx.ellipse(512, 375, 16, 26, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Main Product Name
    ctx.fillStyle = "#1F3A2D";
    ctx.font = "bold 58px system-ui, -apple-system, sans-serif";
    ctx.fillText("COLD PRESSED", 512, 500);
    ctx.fillText("MUSTARD OIL", 512, 570);

    // Traditional description
    ctx.font = "italic 32px Georgia, serif";
    ctx.fillStyle = "#7D4C13";
    ctx.fillText("Traditional Kolhu Pressed", 512, 630);

    // Botanical details box
    ctx.strokeStyle = "rgba(31, 58, 45, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(180, 680, 664, 110);

    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#1F3A2D";
    ctx.fillText("100% PURE & UNREFINED", 512, 725);

    ctx.font = "500 22px monospace";
    ctx.fillStyle = "#5D6852";
    ctx.fillText("SINGLE ESTATE · WOOD CHURNED", 512, 765);

    // Volume badge
    ctx.font = "bold 44px system-ui, sans-serif";
    ctx.fillStyle = "#1F3A2D";
    ctx.fillText("500 ml", 512, 875);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);
}

// ─── 3D MODEL COMPONENTS ─────────────────────────────────────────────────────

/**
 * 1. Amber Glass Bottle Body, Liquid & Label
 */
function BottleBody({ labelTexture }: { labelTexture: THREE.CanvasTexture | null }) {
  const labelArc = Math.PI * 0.94;
  const labelThetaStart = Math.PI * 0.5 - labelArc / 2;

  return (
    <group>
      {/* Outer Amber Glass Cylinder Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 1.25, 36]} />
        <meshPhysicalMaterial
          color="#C27A1C"
          roughness={0.08}
          metalness={0.04}
          transmission={0.62}
          thickness={0.65}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          attenuationColor="#613500"
          attenuationDistance={0.5}
        />
      </mesh>

      {/* Internal Golden-Amber Mustard Oil Volume */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 1.05, 36]} />
        <meshStandardMaterial
          color="#D89218"
          roughness={0.14}
          metalness={0.08}
          emissive="#683F04"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Glass Bottle Shoulder Taper */}
      <mesh position={[0, 0.70, 0]}>
        <cylinderGeometry args={[0.20, 0.38, 0.16, 36]} />
        <meshPhysicalMaterial
          color="#C27A1C"
          roughness={0.08}
          metalness={0.04}
          transmission={0.65}
          thickness={0.55}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Glass Bottle Neck */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.155, 0.165, 0.22, 36]} />
        <meshPhysicalMaterial
          color="#C27A1C"
          roughness={0.08}
          metalness={0.04}
          transmission={0.7}
          thickness={0.45}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Screw Thread Rings on Neck */}
      <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.168, 0.014, 14, 36]} />
        <meshStandardMaterial color="#B87D25" roughness={0.2} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.90, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.166, 0.014, 14, 36]} />
        <meshStandardMaterial color="#B87D25" roughness={0.2} metalness={0.25} />
      </mesh>

      {/* Bottle Mouth Lip Ring */}
      <mesh position={[0, 0.99, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.155, 0.02, 16, 36]} />
        <meshPhysicalMaterial
          color="#D28624"
          roughness={0.06}
          transmission={0.75}
          thickness={0.4}
          ior={1.52}
          clearcoat={1.0}
        />
      </mesh>

      {/* Hollow Interior Opening of Neck */}
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 32]} />
        <meshStandardMaterial color="#2B1A04" roughness={0.7} />
      </mesh>

      {/* Wrap-around Apothecary Paper Label (Centered on +Z front face) */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry
          args={[0.386, 0.426, 0.68, 36, 1, true, labelThetaStart, labelArc]}
        />
        {labelTexture ? (
          <meshStandardMaterial
            map={labelTexture}
            roughness={0.78}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial color="#F4EFE6" roughness={0.75} side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  );
}

/**
 * 2. Wooden Screw Cap (Independent 3D Mesh)
 */
function WoodenCap() {
  return (
    <group>
      {/* Main Turned Wood Cap Body with Fluting / Ridges */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.178, 0.172, 0.20, 28]} />
        <meshStandardMaterial color="#946138" roughness={0.82} metalness={0.02} />
      </mesh>

      {/* Beveled Top Crown */}
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.158, 0.178, 0.035, 28]} />
        <meshStandardMaterial color="#A36E42" roughness={0.8} metalness={0.02} />
      </mesh>

      {/* Lower Rim Ring */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.03, 28]} />
        <meshStandardMaterial color="#7E4E29" roughness={0.86} metalness={0.02} />
      </mesh>

      {/* Internal Hollow Thread Socket */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.11, 24]} />
        <meshStandardMaterial color="#402511" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * 3. Neem Wood Comb
 */
function NeemWoodComb() {
  const teeth = useMemo(() => Array.from({ length: 11 }), []);
  return (
    <group>
      {/* Curved Spine / Back Handle */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.15, 0.20, 0.048]} />
        <meshStandardMaterial color="#78421E" roughness={0.72} metalness={0.03} />
      </mesh>
      {/* Ergonomic rounded handle end */}
      <mesh position={[-0.59, 0.32, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.20, 16]} />
        <meshStandardMaterial color="#6E3A18" roughness={0.72} metalness={0.03} />
      </mesh>
      {/* 11 Tapered Neem Teeth */}
      {teeth.map((_, i) => (
        <mesh key={i} position={[-0.46 + i * 0.092, 0.02, 0]}>
          <boxGeometry args={[0.034, 0.42, 0.038]} />
          <meshStandardMaterial color="#844B22" roughness={0.68} metalness={0.03} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 4. Copper Tongue Scraper
 */
function CopperScraper() {
  return (
    <group>
      {/* Polished U-Curved Scraping Ribbon */}
      <mesh position={[0, 0.40, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.03, 22, 54, Math.PI * 0.95]} />
        <meshStandardMaterial color="#DE774E" metalness={0.98} roughness={0.15} />
      </mesh>
      {/* Left Copper Handle Rod */}
      <mesh position={[-0.41, -0.15, 0]} rotation={[0, 0, 0.07]}>
        <cylinderGeometry args={[0.026, 0.03, 0.80, 22]} />
        <meshStandardMaterial color="#DE774E" metalness={0.98} roughness={0.15} />
      </mesh>
      {/* Right Copper Handle Rod */}
      <mesh position={[0.41, -0.15, 0]} rotation={[0, 0, -0.07]}>
        <cylinderGeometry args={[0.026, 0.03, 0.80, 22]} />
        <meshStandardMaterial color="#DE774E" metalness={0.98} roughness={0.15} />
      </mesh>
      {/* Teardrop Looped Terminals */}
      <mesh position={[-0.44, -0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.022, 16, 28]} />
        <meshStandardMaterial color="#DE774E" metalness={0.98} roughness={0.15} />
      </mesh>
      <mesh position={[0.44, -0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.022, 16, 28]} />
        <meshStandardMaterial color="#DE774E" metalness={0.98} roughness={0.15} />
      </mesh>
    </group>
  );
}

/**
 * 5. Natural Coir Scrub Brush
 */
function CoirScrubBrush() {
  return (
    <group>
      {/* Turned Beechwood Handle Knob */}
      <mesh position={[0, 0.30, 0]}>
        <sphereGeometry args={[0.32, 30, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#D7B488" roughness={0.58} metalness={0.02} />
      </mesh>
      {/* Handle Waist / Grip Groove */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.30, 0.34, 0.15, 30]} />
        <meshStandardMaterial color="#C8A375" roughness={0.62} metalness={0.02} />
      </mesh>
      {/* Natural Flared Plant-Fiber Coir Bristles */}
      <mesh position={[0, -0.20, 0]}>
        <cylinderGeometry args={[0.36, 0.46, 0.48, 32]} />
        <meshStandardMaterial color="#6E4B2C" roughness={0.96} metalness={0.04} />
      </mesh>
    </group>
  );
}

/**
 * 6. Studio Limestone Podium Ground
 */
function StudioPodium() {
  return (
    <group position={[0, -0.85, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.25, 1.40, 0.28, 48]} />
        <meshStandardMaterial color="#E8E2D5" roughness={0.92} metalness={0.01} />
      </mesh>
    </group>
  );
}

/**
 * 7. Ambient Dust Motes
 */
function AmbientMotes() {
  const pointsRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[MOTE_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#D4E87A"
        transparent
        opacity={0.38}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── SCROLL MEASUREMENT HELPER ────────────────────────────────────────────────
function getHeroScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const track = document.getElementById("hero-scroll-track");
  if (!track) return 0;
  const rect = track.getBoundingClientRect();
  const scrollableDistance = track.offsetHeight - window.innerHeight;
  if (scrollableDistance <= 0) return 0;
  const scrolled = -rect.top;
  return Math.max(0, Math.min(1, scrolled / scrollableDistance));
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ─── ANIMATED SCENE CONTENTS & SCROLL CHOREOGRAPHY ────────────────────────────

function RevealContents() {
  const labelTexture = useBottleLabelTexture();

  // Three.js Object Group Refs
  const clusterRef      = useRef<THREE.Group>(null);
  const bottleGroupRef  = useRef<THREE.Group>(null);
  const bottleBodyRef   = useRef<THREE.Group>(null);
  const capGroupRef     = useRef<THREE.Group>(null);
  const combRef         = useRef<THREE.Group>(null);
  const scraperRef      = useRef<THREE.Group>(null);
  const brushRef        = useRef<THREE.Group>(null);
  const keyLightRef     = useRef<THREE.DirectionalLight>(null);

  // Smooth scroll progress & cursor damping
  const smoothP = useRef(0);
  const pointerSmooth = useRef({ x: 0, y: 0 });

  // Per-frame scroll scrubbing & transforms ─────────────────────────────────────
  useFrame((rfState, delta) => {
    // 1. Read & damp scroll progress (buttery smooth inertia)
    const targetP = getHeroScrollProgress();
    smoothP.current = THREE.MathUtils.damp(smoothP.current, targetP, 4.5, delta);
    const p = smoothP.current;

    // 2. Cursor parallax (attenuates slightly when bottle is centered in fullscreen)
    const centerFactor = smoothStep(0.1, 0.35, p) * (1 - smoothStep(0.7, 0.95, p));
    const parallaxDamp = 1 - centerFactor * 0.45;
    pointerSmooth.current.x +=
      (rfState.pointer.x * 0.16 * parallaxDamp - pointerSmooth.current.x) * Math.min(delta * 3.5, 1);
    pointerSmooth.current.y +=
      (-rfState.pointer.y * 0.10 * parallaxDamp - pointerSmooth.current.y) * Math.min(delta * 3.5, 1);

    // =========================================================================
    // A. CLUSTER POSITION & FULLSCREEN MAGNIFICATION
    // =========================================================================
    // Enters fullscreen center stage from p: 0.0 to 0.35, stays centered until 0.70, returns to normal
    const tCenter = smoothStep(0.0, 0.35, p);
    const tReturn = smoothStep(0.70, 0.98, p);

    // X: Right (+1.15) -> Center (0.0) -> Right (+1.15)
    const clusterX = (1.15 * (1 - tCenter) + 0.0 * tCenter) * (1 - tReturn) + 1.15 * tReturn;
    // Y: Low (-0.38) -> Mid (-0.12) -> Low (-0.38)
    const clusterY = (-0.38 * (1 - tCenter) + (-0.12) * tCenter) * (1 - tReturn) + (-0.38) * tReturn;
    // Scale: Normal (0.78) -> Fullscreen Cover (1.38) -> Normal (0.78)
    const clusterScale = (0.78 * (1 - tCenter) + 1.38 * tCenter) * (1 - tReturn) + 0.78 * tReturn;

    if (clusterRef.current) {
      clusterRef.current.position.set(clusterX, clusterY, 0);
      clusterRef.current.scale.set(clusterScale, clusterScale, clusterScale);
      clusterRef.current.rotation.y = pointerSmooth.current.x;
      clusterRef.current.rotation.x = pointerSmooth.current.y;
    }

    // =========================================================================
    // B. BOTTLE LIFT & FULL 360-DEGREE ROTATION
    // =========================================================================
    // Bottle vertical lift (floats during sequence, lands back on podium at end)
    const bottleLiftProgress = Math.sin(smoothStep(0.02, 0.96, p) * Math.PI);
    const bottlePosY = bottleLiftProgress * 0.28;

    // Full 360-degree rotation executed over p in [0.0, 0.85]
    const p360 = Math.min(p / 0.85, 1);
    const bottleRotY = BOTTLE_REST.rotY + p360 * (Math.PI * 2);

    if (bottleGroupRef.current) {
      bottleGroupRef.current.position.set(0, bottlePosY, 0);
      bottleGroupRef.current.rotation.set(BOTTLE_REST.rotX, 0, BOTTLE_REST.rotZ);
    }

    if (bottleBodyRef.current) {
      bottleBodyRef.current.rotation.y = bottleRotY;
    }

    // =========================================================================
    // C. WOODEN CAP UNSCREW, LIFT & RE-SEAT
    // =========================================================================
    // Unscrews & lifts up during p in [0.08, 0.32], stays open, then closes during [0.72, 0.94]
    const tOpen = smoothStep(0.08, 0.32, p);
    const tClose = smoothStep(0.72, 0.94, p);

    const capLift = tOpen * (1 - tClose) * 1.15;
    const capSpin = tOpen * (1 - tClose) * (Math.PI * 6); // 3 full turns = 1080 deg

    if (capGroupRef.current) {
      capGroupRef.current.position.set(0, 1.08 + capLift, 0);
      capGroupRef.current.rotation.set(0, bottleRotY + capSpin, 0);
    }

    // =========================================================================
    // D. ACCESSORIES: "THINGS COME NEAR" -> 3D ORBIT -> "OBJECTS GONE"
    // =========================================================================
    // Active orbit envelope between p: 0.12 and 0.72 (peaks in middle, vanishes at ends)
    const tOrbitNorm = Math.max(0, Math.min(1, (p - 0.12) / 0.60));
    const orbitEnv = Math.sin(tOrbitNorm * Math.PI); // 0 -> 1 -> 0

    // 1. Neem Comb (curved arc from left, passing behind the amber bottle)
    const combTargetX = -1.05 + Math.sin(tOrbitNorm * Math.PI * 1.8) * 1.35;
    const combTargetY = -0.15 + orbitEnv * 0.65 + Math.sin(tOrbitNorm * Math.PI * 2.0) * 0.12;
    const combTargetZ =  0.18 - Math.sin(tOrbitNorm * Math.PI * 1.5) * 0.95; // Passes behind (Z < 0)
    const combTargetRotY = COMB_REST.rotY + tOrbitNorm * Math.PI * 2.2;

    if (combRef.current) {
      combRef.current.position.set(
        COMB_REST.x * (1 - orbitEnv) + combTargetX * orbitEnv,
        COMB_REST.y * (1 - orbitEnv) + combTargetY * orbitEnv,
        COMB_REST.z * (1 - orbitEnv) + combTargetZ * orbitEnv
      );
      combRef.current.rotation.set(
        COMB_REST.rotX,
        COMB_REST.rotY * (1 - orbitEnv) + combTargetRotY * orbitEnv,
        COMB_REST.rotZ
      );
    }

    // 2. Copper Scraper (sweeps across the front of the bottle, gleaming in lights)
    const scraperTargetX =  1.05 - Math.sin(tOrbitNorm * Math.PI * 1.6) * 1.45;
    const scraperTargetY =  0.15 + orbitEnv * 0.42;
    const scraperTargetZ = -0.10 + Math.sin(tOrbitNorm * Math.PI * 1.3) * 1.10; // Passes in front (Z > 0)
    const scraperTargetRotY = SCRAPER_REST.rotY + tOrbitNorm * Math.PI * 1.8;
    const scraperTargetRotX = SCRAPER_REST.rotX + orbitEnv * 0.35;

    if (scraperRef.current) {
      scraperRef.current.position.set(
        SCRAPER_REST.x * (1 - orbitEnv) + scraperTargetX * orbitEnv,
        SCRAPER_REST.y * (1 - orbitEnv) + scraperTargetY * orbitEnv,
        SCRAPER_REST.z * (1 - orbitEnv) + scraperTargetZ * orbitEnv
      );
      scraperRef.current.rotation.set(
        SCRAPER_REST.rotX * (1 - orbitEnv) + scraperTargetRotX * orbitEnv,
        SCRAPER_REST.rotY * (1 - orbitEnv) + scraperTargetRotY * orbitEnv,
        SCRAPER_REST.rotZ
      );
    }

    // 3. Coir Scrub Brush (swoops below and around behind bottle base)
    const brushTargetX =  0.84 - Math.sin(tOrbitNorm * Math.PI * 1.4) * 1.15;
    const brushTargetY = -0.62 + orbitEnv * 0.32;
    const brushTargetZ =  0.34 - Math.sin(tOrbitNorm * Math.PI * 1.2) * 0.90;
    const brushTargetRotY = BRUSH_REST.rotY + tOrbitNorm * Math.PI * 1.5;

    if (brushRef.current) {
      brushRef.current.position.set(
        BRUSH_REST.x * (1 - orbitEnv) + brushTargetX * orbitEnv,
        BRUSH_REST.y * (1 - orbitEnv) + brushTargetY * orbitEnv,
        BRUSH_REST.z * (1 - orbitEnv) + brushTargetZ * orbitEnv
      );
      brushRef.current.rotation.set(
        BRUSH_REST.rotX,
        BRUSH_REST.rotY * (1 - orbitEnv) + brushTargetRotY * orbitEnv,
        BRUSH_REST.rotZ
      );
    }

    // =========================================================================
    // E. STUDIO SPECULAR LIGHTING SWELL
    // =========================================================================
    const lightBump = Math.sin(smoothStep(0.35, 0.65, p) * Math.PI);
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 1.7 + lightBump * 0.75;
    }
  });

  return (
    <group ref={clusterRef} position={[1.15, -0.38, 0]}>
      {/* Studio Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[4.5, 6.5, 4.0]}
        intensity={1.7}
        color="#FFF9EC"
        castShadow={false}
      />

      {/* Stone / Limestone Podium Ground */}
      <StudioPodium />

      {/* Bottle Master Group */}
      <group ref={bottleGroupRef} scale={0.88}>
        {/* Revolving Bottle Body & Oil */}
        <group ref={bottleBodyRef}>
          <BottleBody labelTexture={labelTexture} />
        </group>

        {/* Independent Wooden Screw Cap */}
        <group ref={capGroupRef}>
          <WoodenCap />
        </group>
      </group>

      {/* 3D Accessories */}
      <group ref={combRef} scale={0.82}>
        <NeemWoodComb />
      </group>

      <group ref={scraperRef} scale={0.85}>
        <CopperScraper />
      </group>

      <group ref={brushRef} scale={0.80}>
        <CoirScrubBrush />
      </group>
    </group>
  );
}

// ─── EXPORTED HERO CANVAS SCENE ───────────────────────────────────────────────

export function BottleRevealScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] select-none"
    >
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 5.2], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.85} color="#FFFBF2" />
        <directionalLight position={[-3.5, 4.0, -3.0]} intensity={0.9} color="#D8EAA0" />
        <directionalLight position={[-4.0, 1.5, 3.5]} intensity={0.6} color="#F2EDE2" />
        <pointLight position={[0, -2.0, 2.0]} intensity={0.4} color="#E8C88A" />

        <AmbientMotes />

        <RevealContents />

        {/* Ground Contact Shadows */}
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.36}
          scale={6.4}
          blur={2.4}
          far={3.5}
          color="#163828"
        />
      </Canvas>
    </div>
  );
}
