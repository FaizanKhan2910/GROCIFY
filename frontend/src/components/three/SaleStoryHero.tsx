"use client";

/**
 * ============================================================================
 * GROCIFY — SALE STORY HERO (SaleStoryHero.tsx)
 * ============================================================================
 * Full scroll-driven 3D product reveal experience based on the creative reference.
 *
 * Features:
 *   - Dedicated stone podium on the right side of the hero (centered on mobile)
 *   - Premium amber glass bottle (Cold-Pressed Mustard Oil, 500 ml) with wooden
 *     screw cap, apothecary paper label, and golden liquid volume
 *   - Continuous ambient rotation + scroll-driven 360° spinning
 *   - 160 swirling golden glitter particles & sparks
 *   - 3 real on-sale Grocify products:
 *       1. Handmade Neem Wood Wide-Tooth Comb (Save 17%)
 *       2. Plant-Fiber Scrub Brushes, Set of 3 (Save 14%)
 *       3. Pure Copper Tongue Scraper (Save 20%)
 *   - Scroll choreography:
 *       - Bottle drops in with intro animation
 *       - Items fly in one at a time from off-screen
 *       - Each item does exactly ONE 360° revolve in front of the bottle
 *       - Item glides to its dedicated slot on the stone podium
 *       - Expanding landing ripple on the podium surface
 *       - 3D-to-screen projected price tags with instant "+" add-to-cart buttons
 *   - Left editorial panels (5 stages):
 *       Stage 0: Brand statement & headline
 *       Stage 1: Neem Wood Comb showcase & add button
 *       Stage 2: Plant-Fiber Scrub Brushes showcase & add button
 *       Stage 3: Pure Copper Tongue Scraper showcase & add button
 *       Stage 4: Daily Ritual Combo panel with savings (Save ₹170) & add combo
 *   - Bottom quick-jump steps buttons: [Bottle, Comb −17%, Brushes −14%, Scraper −20%, Combo]
 *   - Flash sale countdown timer at top center
 *   - Seamlessly integrated with Grocify's CartContext (bump effect on header cart)
 * ============================================================================
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useCart } from "@/context/CartContext";
import { EVERYDAY_FAVOURITES } from "@/lib/catalog";
import { formatRupees } from "@/lib/formatters";
import type { ProductData } from "@/components/marketplace/ProductCard";

// Helpers
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const TAU = Math.PI * 2;
const V3 = THREE.Vector3;
const V = THREE.Vector2;

export function SaleStoryHero() {
  const { addToCart } = useCart();

  // DOM Refs
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tag0Ref = useRef<HTMLDivElement>(null);
  const tag1Ref = useRef<HTMLDivElement>(null);
  const tag2Ref = useRef<HTMLDivElement>(null);
  const p0Ref = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const p4Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Active step state for button highlights
  const [activeStep, setActiveStep] = useState(0);

  // Added state for items
  const [addedItems, setAddedItems] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
  });
  const [comboAdded, setComboAdded] = useState(false);

  // Catalog products for the sale items
  const combProduct = useMemo(
    () => EVERYDAY_FAVOURITES.find((p) => p.id === "prod-comb")!,
    []
  );
  const brushesProduct = useMemo(
    () => EVERYDAY_FAVOURITES.find((p) => p.id === "prod-brushes")!,
    []
  );
  const scraperProduct = useMemo(
    () => EVERYDAY_FAVOURITES.find((p) => p.id === "prod-copper-scraper")!,
    []
  );
  const products = useMemo(
    () => [combProduct, brushesProduct, scraperProduct],
    [combProduct, brushesProduct, scraperProduct]
  );

  // 3D Objects & Fly-To-Cart State
  const itemsRef = useRef<THREE.Group[]>([]);
  const flyStatesRef = useRef<{
    [key: number]: {
      active: boolean;
      done: boolean;
      startTime: number;
      duration: number;
      startPos: THREE.Vector3;
      startScale: number;
      startRot: THREE.Euler;
      arcHeight: number;
    };
  }>({
    0: { active: false, done: false, startTime: 0, duration: 0.85, startPos: new THREE.Vector3(), startScale: 1, startRot: new THREE.Euler(), arcHeight: 1.8 },
    1: { active: false, done: false, startTime: 0, duration: 0.85, startPos: new THREE.Vector3(), startScale: 1, startRot: new THREE.Euler(), arcHeight: 1.8 },
    2: { active: false, done: false, startTime: 0, duration: 0.85, startPos: new THREE.Vector3(), startScale: 1, startRot: new THREE.Euler(), arcHeight: 1.8 },
  });

  // Trigger organic fly-to-cart animation on 3D mesh
  const triggerFlyToCart = (idx: number, delaySec = 0) => {
    const g = itemsRef.current[idx];
    if (!g || flyStatesRef.current[idx].done || flyStatesRef.current[idx].active) return;

    const now = performance.now() * 0.001 + delaySec;
    flyStatesRef.current[idx] = {
      active: true,
      done: false,
      startTime: now,
      duration: 0.85,
      startPos: g.position.clone(),
      startScale: g.scale.x,
      startRot: g.rotation.clone(),
      arcHeight: 1.6 + Math.random() * 0.4,
    };
  };

  // Flash sale countdown timer (defaults to 2h 14m 09s)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 14 * 60 + 9);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 2 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
    const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
    const s = String(timeLeft % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [timeLeft]);

  // Handle single item add
  const handleAddItem = (idx: number) => {
    const item = products[idx];
    if (item) {
      addToCart(item, 1);
      setAddedItems((prev) => ({ ...prev, [idx]: true }));
      triggerFlyToCart(idx, 0);
    }
  };

  // Handle full combo add
  const handleAddCombo = () => {
    products.forEach((prod, i) => {
      if (prod) {
        addToCart(prod, 1);
        triggerFlyToCart(i, i * 0.16); // Staggered flight arc!
      }
    });
    setAddedItems({ 0: true, 1: true, 2: true });
    setComboAdded(true);
    setTimeout(() => setComboAdded(false), 3000);
  };

  // Step targets for smooth scroll jumping
  const stepScrollTargets = [0.04, 0.22, 0.48, 0.74, 0.96];

  const scrollToStep = (stepIndex: number) => {
    const sec = sectionRef.current;
    const st = stickyRef.current;
    if (!sec || !st) return;
    const hh = parseFloat(getComputedStyle(st).top) || 0;
    const targetY =
      sec.offsetTop - hh + stepScrollTargets[stepIndex] * (sec.offsetHeight - st.offsetHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const cv = canvasRef.current;
    const st = stickyRef.current;
    const sec = sectionRef.current;
    if (!cv || !st || !sec) return;

    let disposed = false;
    let animId = 0;

    // Renderer
    const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    R.outputColorSpace = THREE.SRGBColorSpace;
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.08;
    R.shadowMap.enabled = true;
    R.shadowMap.type = THREE.PCFSoftShadowMap;

    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

    // Environment reflection canvas
    const ec = document.createElement("canvas");
    ec.width = 512;
    ec.height = 256;
    const e = ec.getContext("2d");
    if (e) {
      const eg = e.createLinearGradient(0, 0, 0, 256);
      eg.addColorStop(0, "#fff8ea");
      eg.addColorStop(0.55, "#d9cfba");
      eg.addColorStop(1, "#8a7d62");
      e.fillStyle = eg;
      e.fillRect(0, 0, 512, 256);
      e.fillStyle = "#fff";
      [
        [60, 30, 30, 180],
        [210, 10, 16, 200],
        [320, 20, 160, 26],
        [440, 40, 24, 170],
      ].forEach(([x, y, w, h]) => e.fillRect(x, y, w, h));
      e.fillStyle = "#3a2a18";
      e.fillRect(140, 60, 12, 150);
      e.fillRect(390, 60, 10, 150);
    }
    const et = new THREE.CanvasTexture(ec);
    et.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(R);
    sc.environment = pmrem.fromEquirectangular(et).texture;
    pmrem.dispose();

    // Lights
    sc.add(new THREE.AmbientLight(0xfff4e0, 0.55));
    const sun = new THREE.DirectionalLight(0xfff0d8, 1.5);
    sun.position.set(-6, 10, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -9,
      right: 9,
      top: 9,
      bottom: -9,
      near: 1,
      far: 40,
    });
    sun.shadow.bias = -0.0006;
    sc.add(sun);

    const rim = new THREE.DirectionalLight(0xffd9a0, 0.9);
    rim.position.set(5, 4, -6);
    sc.add(rim);

    // Procedural Wood Texture
    function woodTex(base: string, dk: string, lt: string) {
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const x = c.getContext("2d");
      if (x) {
        x.fillStyle = base;
        x.fillRect(0, 0, 512, 512);
        for (let n = 0; n < 280; n++) {
          x.fillStyle = Math.random() < 0.5 ? dk : lt;
          x.globalAlpha = 0.07 + Math.random() * 0.13;
          x.fillRect(Math.random() * 512, 0, 1 + Math.random() * 5, 512);
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    const wood = new THREE.MeshStandardMaterial({
      map: woodTex("#8a5a32", "#3a200e", "#c08a56"),
      roughness: 0.55,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: 0xc4693a,
      metalness: 1,
      roughness: 0.26,
      envMapIntensity: 1.7,
    });
    const coir = new THREE.MeshStandardMaterial({
      color: 0x9b7845,
      roughness: 1,
    });
    const sisal = new THREE.MeshStandardMaterial({
      color: 0xcdb27c,
      roughness: 1,
    });

    const W = new THREE.Group();
    sc.add(W);

    // Stone Podium with organic surface roughness
    function rough(g: THREE.BufferGeometry, a: number, sd: number) {
      const p = g.attributes.position;
      for (let n = 0; n < p.count; n++) {
        const x = p.getX(n);
        const y = p.getY(n);
        const z = p.getZ(n);
        const q =
          Math.sin(x * 5 + sd) * Math.cos(y * 4 + sd) * Math.sin(z * 5 + sd * 2);
        p.setXYZ(n, x + q * a, y + q * a, z + q * a);
      }
      g.computeVertexNormals();
      return g;
    }

    const pod = new THREE.Mesh(
      rough(new THREE.CylinderGeometry(3.4, 4.2, 1.6, 72, 8), 0.05, 2),
      new THREE.MeshStandardMaterial({ color: 0xe2d8c3, roughness: 1 })
    );
    pod.position.y = -0.8;
    pod.receiveShadow = true;
    W.add(pod);

    // Ground Shadow Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.25 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    sc.add(floor);

    // Helper positioning
    const at = (m: THREE.Object3D, x: number, y: number, z: number) => {
      m.position.set(x, y, z);
      return m;
    };

    // Premium Bottle Group
    const BT = new THREE.Group();
    W.add(BT);

    const lathe = (pts: number[][], s = 100) =>
      new THREE.LatheGeometry(
        new THREE.SplineCurve(pts.map((p) => new V(p[0], p[1]))).getPoints(s),
        64
      );

    // Internal golden oil liquid
    const liq = new THREE.Mesh(
      lathe(
        [
          [0, 0.05],
          [0.5, 0.05],
          [0.66, 0.1],
          [0.67, 0.2],
          [0.67, 1.55],
          [0.64, 1.78],
          [0.55, 2],
          [0.36, 2.2],
          [0.2, 2.3],
          [0, 2.3],
        ],
        60
      ),
      new THREE.MeshStandardMaterial({
        color: 0xd98a12,
        emissive: 0x7a3a00,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        envMapIntensity: 1.1,
      })
    );
    liq.renderOrder = 1;
    BT.add(liq);

    // Outer amber glass shell
    const shell = new THREE.Mesh(
      lathe([
        [0, 0],
        [0.55, 0],
        [0.68, 0.04],
        [0.72, 0.16],
        [0.72, 1.55],
        [0.7, 1.78],
        [0.6, 2],
        [0.4, 2.2],
        [0.29, 2.38],
        [0.27, 2.6],
        [0.27, 2.88],
        [0.32, 2.93],
        [0.32, 3.02],
        [0.2, 3.02],
      ]),
      new THREE.MeshPhysicalMaterial({
        color: 0x5a3210,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        transparent: true,
        opacity: 0.55,
        envMapIntensity: 2.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    shell.renderOrder = 2;
    BT.add(shell);

    // Botanical apothecary label
    const lc = document.createElement("canvas");
    lc.width = 300;
    lc.height = 160;
    const l = lc.getContext("2d");
    if (l) {
      l.fillStyle = "#f7f6f2";
      l.fillRect(0, 0, 300, 160);
      l.fillStyle = "#d4e87a";
      l.fillRect(0, 0, 300, 14);
      l.fillStyle = "#1f3a2d";
      l.textAlign = "center";
      l.font = "700 40px Georgia, serif";
      l.fillText("GROCIFY", 150, 70);
      l.font = "italic 20px Georgia, serif";
      l.fillText("Kachi Ghani Mustard Oil", 150, 104);
      l.fillRect(100, 118, 100, 2);
      l.font = "15px Georgia, serif";
      l.fillText("500 ml · Cold pressed", 150, 142);
    }
    const lab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.735, 0.735, 0.85, 48, 1, true, -1.3, 2.6),
      new THREE.MeshStandardMaterial({
        map: new THREE.CanvasTexture(lc),
        roughness: 0.85,
        side: THREE.DoubleSide,
      })
    );
    lab.position.y = 0.95;
    BT.add(lab);

    // Wooden Screw Cap
    BT.add(
      at(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.21, 0.5, 32),
          new THREE.MeshStandardMaterial({ color: 0xb98650, roughness: 0.9 })
        ),
        0,
        3.28,
        0
      )
    );

    // Copper / Brass Spiral Thread
    const cp: THREE.Vector3[] = [];
    for (let k = 0; k <= 120; k++) {
      const t = k / 120;
      const a = t * TAU * 5.5;
      cp.push(new V3(Math.cos(a) * 0.34, 2.42 + t * 0.5, Math.sin(a) * 0.34));
    }
    BT.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cp), 200, 0.02, 6),
        new THREE.MeshStandardMaterial({
          color: 0xd9a441,
          metalness: 1,
          roughness: 0.22,
          envMapIntensity: 2,
        })
      )
    );

    BT.scale.setScalar(1.12);
    BT.position.z = -0.3;

    // Golden core glow light
    const glow = new THREE.PointLight(0xff9a3c, 0.9, 8);
    glow.position.set(0, 1.6, 1);
    W.add(glow);

    // Sale Items Models
    const items: THREE.Group[] = [];

    // 1. Neem Wood Comb
    const comb = new THREE.Group();
    comb.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.34, 0.14), wood), 0, 1.12, 0));
    for (let k = 0; k < 9; k++) {
      comb.add(
        at(
          new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.95, 0.12), wood),
          -0.75 + k * 0.1875,
          0.475,
          0
        )
      );
    }

    // 2. Plant-Fiber Scrub Brushes (Set of 3)
    const brs = new THREE.Group();
    [-1, 0, 1].forEach((k, n) => {
      const b = new THREE.Group();
      b.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.95, 16), wood),
          0,
          0.85 + n * 0.04,
          0
        )
      );
      b.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.42, 24), coir),
          0,
          0.21,
          0
        )
      );
      b.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.1, 24), sisal),
          0,
          0.46,
          0
        )
      );
      b.position.set(k * 0.62, 0, Math.abs(k) * -0.12);
      b.rotation.z = -k * 0.12;
      brs.add(b);
    });

    // 3. Copper Tongue Scraper
    const scr = new THREE.Group();
    const ar = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.06, 14, 48, Math.PI),
      copper
    );
    ar.position.y = 0.04;
    scr.add(ar);
    [-0.78, 0.78].forEach((x) =>
      scr.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), copper), x, 0.04, 0))
    );

    // Coordinates and timing windows
    const S0 = [
      [-2.1, 0, 0.9, 0.5],
      [2.2, 0, 0.9, -0.5],
      [0, 0, 2.2, 0],
    ];
    const ST = [
      [8.5, 4.5, -2],
      [-8.5, 3.6, -2],
      [0, 7, -1],
    ];
    const win = [
      [0.1, 0.34],
      [0.36, 0.6],
      [0.62, 0.86],
    ];

    [comb, brs, scr].forEach((g, k) => {
      W.add(g);
      g.userData = {
        slot: new V3(S0[k][0], S0[k][1], S0[k][2]),
        sr: S0[k][3],
        start: new V3(ST[k][0], ST[k][1], ST[k][2]),
        a: win[k][0],
        b: win[k][1],
      };
      g.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) o.castShadow = true;
      });
      items.push(g);
    });
    itemsRef.current = items;

    BT.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o !== shell) o.castShadow = true;
    });

    // Landing Ripples on podium
    const rings = S0.map((s) => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(0.85, 0.95, 56),
        new THREE.MeshBasicMaterial({
          color: 0x1f3a2d,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(s[0], 0.03, s[2]);
      W.add(m);
      return m;
    });

    // 160 Swirling Golden Glitter Particles / Sparks
    const SN = 160;
    const sg = new THREE.BufferGeometry();
    const sp = new Float32Array(SN * 3);
    const SD = Array.from({ length: SN }, () => ({
      a: Math.random() * TAU,
      r: 1.2 + Math.random() * 3.2,
      h: Math.random() * 5,
      s: 0.3 + Math.random(),
      ph: Math.random() * 9,
    }));
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));

    const dc = document.createElement("canvas");
    dc.width = dc.height = 32;
    const d = dc.getContext("2d");
    if (d) {
      const dg = d.createRadialGradient(16, 16, 0, 16, 16, 16);
      dg.addColorStop(0, "#fff");
      dg.addColorStop(0.5, "#fff");
      dg.addColorStop(1, "rgba(255,255,255,0)");
      d.fillStyle = dg;
      d.fillRect(0, 0, 32, 32);
    }
    const spk = new THREE.Points(
      sg,
      new THREE.PointsMaterial({
        size: 0.08,
        map: new THREE.CanvasTexture(dc),
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        color: 0xb28a1e,
      })
    );
    spk.frustumCulled = false;
    W.add(spk);

    // Resize handler
    const fit = () => {
      if (!st) return;
      const w = st.clientWidth;
      const h = st.clientHeight;
      R.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(st);

    // Pointer move listener
    let mx = 0;
    let my = 0;
    let cmx = 0;
    let cmy = 0;
    const handlePointerMove = (ev: PointerEvent) => {
      mx = (ev.clientX / window.innerWidth) * 2 - 1;
      my = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    // Motion preference check
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Per-frame loop state
    let sP = 0;
    const tmp = new V3();
    const t0 = performance.now() / 1000 + 1.2;
    let lastStep = -1;

    // Main animation frame loop
    const frame = (time: number) => {
      if (disposed) return;
      animId = requestAnimationFrame(frame);
      const t = time * 0.001;

      // Scroll progress computation
      const r = sec.getBoundingClientRect();
      const hh = parseFloat(getComputedStyle(st).top) || 0;
      const scrollable = r.height - st.offsetHeight;
      const p = scrollable > 0 ? clamp((hh - r.top) / scrollable) : 0;

      sP += (p - sP) * (rm ? 1 : 0.075);
      cmx += (mx - cmx) * 0.05;
      cmy += (my - cmy) * 0.05;

      const P = sP;
      const mob = cam.aspect < 0.9;

      // World Group Position: Right side on desktop, center on mobile
      W.position.set(mob ? 0 : 2.4, mob ? 0.4 : -0.2, 0);

      // Bottle: Intro drop + smooth continuous rotation + scroll scrub
      const intro = ss(0, 1.8, t - t0);
      const sa = Math.max(
        ...items.map((g) => {
          const u = clamp((P - g.userData.a) / (g.userData.b - g.userData.a));
          return ss(0, 0.28, u) * (1 - ss(0.72, 1, u));
        })
      );

      BT.position.y = (1 - intro) * 3.2 + Math.sin(t * 1.1) * 0.03;
      BT.rotation.y = (1 - intro) * TAU + t * 0.25 + P * 2.2;
      BT.position.x = -sa * (mob ? 0.4 : 0.9);
      glow.intensity = 0.7 + 0.4 * Math.sin(t * 1.3) + sa * 0.6;

      // Items: fly in -> one full 360° revolve -> glide to podium slot (or fly to cart if purchased)
      const tagEls = [tag0Ref.current, tag1Ref.current, tag2Ref.current];

      items.forEach((g, k) => {
        const flyCart = flyStatesRef.current[k];

        // 1. Permanently removed from scroll feature if already in cart
        if (flyCart && flyCart.done) {
          g.visible = false;
          if (tagEls[k]) {
            tagEls[k].style.opacity = "0";
            tagEls[k].style.pointerEvents = "none";
          }
          rings[k].visible = false;
          return;
        }

        // 2. Active Fly-To-Cart Flight Animation (Lifting, shrinking, and flying to header cart icon)
        if (flyCart && flyCart.active) {
          if (t < flyCart.startTime) {
            // Waiting for stagger start, stay at current position
            return;
          }

          const elapsed = t - flyCart.startTime;
          const progress = clamp(elapsed / flyCart.duration);
          const easeFlight = progress * progress * (3 - 2 * progress);
          const shrinkEase = Math.pow(progress, 1.8);

          // Get live screen position of the header cart button
          const cartEl =
            document.getElementById("header-cart-indicator") ||
            document.getElementById("cart");
          let ndcX = 0.82;
          let ndcY = 0.88;
          if (cartEl && st) {
            const cr = cartEl.getBoundingClientRect();
            const sr = st.getBoundingClientRect();
            const cx = cr.left + cr.width / 2 - sr.left;
            const cy = cr.top + cr.height / 2 - sr.top;
            ndcX = (cx / st.clientWidth) * 2 - 1;
            ndcY = -(cy / st.clientHeight) * 2 + 1;
          }

          // Unproject to 3D world space in front of camera and convert to W local coords
          const targetWorld = new THREE.Vector3(ndcX, ndcY, 0.45).unproject(cam);
          const targetInW = W.worldToLocal(targetWorld.clone());

          // Curved 3D trajectory with upward parabolic arc
          g.position.lerpVectors(flyCart.startPos, targetInW, easeFlight);
          const arc = Math.sin(progress * Math.PI) * flyCart.arcHeight;
          g.position.y += arc;

          // Shrink continuously in size until it enters the cart bag
          const currentScale = THREE.MathUtils.lerp(flyCart.startScale, 0.015, shrinkEase);
          g.scale.setScalar(Math.max(0.001, currentScale));

          // Smooth tumble and rotate while airborne
          g.rotation.x = flyCart.startRot.x + progress * TAU * 1.6;
          g.rotation.y = flyCart.startRot.y + progress * TAU * 2.2;
          g.rotation.z = flyCart.startRot.z + progress * TAU * 1.2;

          // Instantly fade out floating price tag and hide landing ripple
          if (tagEls[k]) {
            tagEls[k].style.opacity = String(Math.max(0, 1 - progress * 3));
            tagEls[k].style.pointerEvents = "none";
          }
          rings[k].visible = false;

          // Sparkling glitter trail behind the flying product
          if (spk) {
            const pa = spk.geometry.attributes.position;
            const sparkOffset = k * 18;
            for (let si = 0; si < 16; si++) {
              const sIndex = (sparkOffset + si) % SN;
              const jitter = (Math.random() - 0.5) * 0.35 * (1 - progress);
              pa.setXYZ(
                sIndex,
                g.position.x + jitter,
                g.position.y + jitter,
                g.position.z + jitter
              );
            }
          }

          // Completion: Arrived into cart!
          if (progress >= 1) {
            flyCart.active = false;
            flyCart.done = true;
            g.visible = false;

            // Trigger bounce spring on the cart icon
            if (cartEl) {
              cartEl.animate(
                [
                  { transform: "scale(1)" },
                  { transform: "scale(1.36) rotate(-8deg)" },
                  { transform: "scale(0.88) rotate(4deg)" },
                  { transform: "scale(1.08)" },
                  { transform: "scale(1)" },
                ],
                { duration: 520, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)" }
              );
            }
          }

          return;
        }

        // 3. Normal Scroll-Driven Showcase Behavior
        const u = clamp((P - g.userData.a) / (g.userData.b - g.userData.a));
        const fly = ss(0, 0.28, u);
        const rev = ss(0.28, 0.72, u);
        const gl = ss(0.72, 1, u);
        const sh = new V3(mob ? 0 : -0.2, 1.25, 3.4);

        g.visible = P > g.userData.a - 0.005;

        const arc = Math.sin(fly * Math.PI) * 1.4;
        g.position.copy(g.userData.start).lerp(sh, fly).lerp(g.userData.slot, gl);
        g.position.y += arc * (1 - gl) + Math.sin(t * 2 + k) * 0.06 * fly * (1 - gl);

        g.scale.setScalar((0.7 + 0.8 * fly) * (1 - gl) + gl * 1.0);
        g.rotation.set(
          -0.22 * fly * (1 - gl),
          TAU * rev + g.userData.sr * gl + (1 - fly) * 2,
          0
        );

        // Landing ripple ring animation
        const rg = rings[k];
        const rt = clamp((u - 0.82) / 0.18);
        (rg.material as THREE.MeshBasicMaterial).opacity =
          u > 0.82 && u < 1 ? (1 - rt) * 0.7 : 0;
        rg.scale.setScalar(0.5 + rt * 2.3);

        // 3D-to-screen projected price tag positioning
        const tg = tagEls[k];
        if (tg) {
          tmp.set(0, 1.75, 0);
          g.localToWorld(tmp);
          tmp.project(cam);
          const w = st.clientWidth;
          const h = st.clientHeight;
          const vis = g.visible && u > 0.12 ? 1 : 0;
          tg.style.opacity = String(vis * (mob ? 0.95 : 1));
          tg.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(
            -tmp.y * 0.5 + 0.5
          ) * h}px) translate(-50%, -100%) scale(${1 + 0.18 * fly * (1 - gl)})`;
        }
      });

      // Swirling golden sparks update
      const pa = spk.geometry.attributes.position;
      SD.forEach((o, n) => {
        const a = o.a + t * o.s * 0.25;
        pa.setXYZ(
          n,
          Math.cos(a) * o.r,
          ((o.h + t * 0.2 * o.s) % 5) - 0.6,
          Math.sin(a) * o.r * 0.7
        );
      });
      pa.needsUpdate = true;

      // Camera view update
      cam.position.set(
        cmx * 0.7,
        2.7 - cmy * 0.3,
        (mob ? 27 : 17.6) - 1.3 * ss(0, 0.1, P) + 0.9 * ss(0.86, 1, P)
      );
      cam.lookAt(0, 1.1, 0);

      // Render Three.js Scene
      R.render(sc, cam);

      // Sync Left Editorial Panels
      const panelEls = [p0Ref.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current];
      panelEls.forEach((el, k) => {
        if (!el) return;
        const c = [0.0, 0.22, 0.48, 0.74, 0.96][k];
        const o =
          k === 0
            ? 1 - ss(0.03, 0.1, P)
            : k === 4
            ? ss(0.87, 0.93, P)
            : clamp(1 - (Math.abs(P - c) - 0.06) / 0.07);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${
          k === 0 ? -ss(0.03, 0.1, P) * 40 : k === 4 ? (1 - o) * 30 : (P - c) * -120
        }px)`;
        el.style.pointerEvents = o > 0.4 ? "auto" : "none";
      });

      // Update active step pill
      const stepIdx = P < 0.1 ? 0 : P < 0.35 ? 1 : P < 0.61 ? 2 : P < 0.87 ? 3 : 4;
      if (stepIdx !== lastStep) {
        lastStep = stepIdx;
        setActiveStep(stepIdx);
      }

      // Scroll hint visibility
      if (hintRef.current) {
        hintRef.current.style.opacity = P < 0.02 ? "1" : "0";
      }
    };

    animId = requestAnimationFrame(frame);

    // Cleanup on unmount
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      ro.disconnect();
      R.dispose();
      sc.clear();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-scroll-track"
      className="relative bg-[#f7f6f2] border-b border-[#e3e1d8]"
      style={{ height: "520vh" }}
    >
      {/* Sticky Viewport Stage */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden select-none"
        style={{
          backgroundColor: "#e0d7c6",
          backgroundImage: `radial-gradient(ellipse at 66% 45%, rgba(255,251,238,0.85), transparent 62%)`,
        }}
      >
        {/* Full Viewport 3D Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Flash Sale Countdown Timer Badge (Top Center) */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center gap-2.5 bg-[#1f3a2d] text-[#f7f6f2] rounded-full px-4 py-2 font-mono text-xs font-bold tracking-wide shadow-card z-20">
          <span className="w-2 h-2 rounded-full bg-[#ff6a5f] animate-ping" />
          <span>FLASH SALE ENDS IN {formattedTime}</span>
        </div>

        {/* 3D-Projected Floating Price Tags */}
        {/* Tag 0: Comb */}
        <div
          ref={tag0Ref}
          className="absolute left-0 top-0 opacity-0 flex items-center gap-2 bg-[#f7f6f2]/85 backdrop-blur-md border border-white/75 rounded-2xl px-2.5 py-1.5 shadow-[0_18px_34px_-18px_rgba(31,58,45,0.55)] whitespace-nowrap z-20 transition-opacity pointer-events-auto"
        >
          <span className="bg-[#d2524b] text-white font-mono text-xs font-bold rounded-lg px-2 py-0.5">
            −17%
          </span>
          <span className="font-display font-bold text-base text-[#1b2a22]">
            ₹249 <s className="text-xs font-normal text-[#5d665f]">₹299</s>
          </span>
          <button
            onClick={() => handleAddItem(0)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
              addedItems[0] ? "bg-[#d4e87a] text-[#1f3a2d]" : "bg-[#1f3a2d] text-white hover:bg-[#1f3a2d]/90"
            }`}
            aria-label="Add comb to cart"
          >
            {addedItems[0] ? "✓" : "+"}
          </button>
        </div>

        {/* Tag 1: Brushes */}
        <div
          ref={tag1Ref}
          className="absolute left-0 top-0 opacity-0 flex items-center gap-2 bg-[#f7f6f2]/85 backdrop-blur-md border border-white/75 rounded-2xl px-2.5 py-1.5 shadow-[0_18px_34px_-18px_rgba(31,58,45,0.55)] whitespace-nowrap z-20 transition-opacity pointer-events-auto"
        >
          <span className="bg-[#d2524b] text-white font-mono text-xs font-bold rounded-lg px-2 py-0.5">
            −14%
          </span>
          <span className="font-display font-bold text-base text-[#1b2a22]">
            ₹429 <s className="text-xs font-normal text-[#5d665f]">₹499</s>
          </span>
          <button
            onClick={() => handleAddItem(1)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
              addedItems[1] ? "bg-[#d4e87a] text-[#1f3a2d]" : "bg-[#1f3a2d] text-white hover:bg-[#1f3a2d]/90"
            }`}
            aria-label="Add brushes to cart"
          >
            {addedItems[1] ? "✓" : "+"}
          </button>
        </div>

        {/* Tag 2: Tongue Scraper */}
        <div
          ref={tag2Ref}
          className="absolute left-0 top-0 opacity-0 flex items-center gap-2 bg-[#f7f6f2]/85 backdrop-blur-md border border-white/75 rounded-2xl px-2.5 py-1.5 shadow-[0_18px_34px_-18px_rgba(31,58,45,0.55)] whitespace-nowrap z-20 transition-opacity pointer-events-auto"
        >
          <span className="bg-[#d2524b] text-white font-mono text-xs font-bold rounded-lg px-2 py-0.5">
            −20%
          </span>
          <span className="font-display font-bold text-base text-[#1b2a22]">
            ₹199 <s className="text-xs font-normal text-[#5d665f]">₹249</s>
          </span>
          <button
            onClick={() => handleAddItem(2)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
              addedItems[2] ? "bg-[#d4e87a] text-[#1f3a2d]" : "bg-[#1f3a2d] text-white hover:bg-[#1f3a2d]/90"
            }`}
            aria-label="Add tongue scraper to cart"
          >
            {addedItems[2] ? "✓" : "+"}
          </button>
        </div>

        {/* Left Side Editorial Content Column */}
        <div className="absolute left-[7.5vw] top-0 bottom-0 w-[min(520px,44vw)] flex items-center pointer-events-none z-10 max-md:left-5 max-md:right-5 max-md:w-auto max-md:items-end max-md:pb-[14vh]">
          {/* Panel 0: Intro Brand Statement */}
          <div ref={p0Ref} className="absolute left-0 right-0 opacity-0 will-change-transform">
            <span className="inline-flex items-center gap-2 bg-[#d4e87a] text-[#1f3a2d] border border-[#c5dc62] rounded-full px-3.5 py-1.5 mb-5 font-mono text-xs font-bold uppercase">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 19C5 9 11 5 20 4c0 9-4 15-14 15zM5 19l8-8" />
              </svg>
              Zero plastic packaging
            </span>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1b2a22] leading-none mb-4">
              Better everyday.<br />
              <em className="italic text-[#1f3a2d] font-serif">Thoughtfully chosen.</em>
            </h1>
            <p className="text-[#4d564f] text-base sm:text-lg max-w-[480px] leading-relaxed mb-7 max-md:hidden">
              Everyday essentials for your home, rituals and routines, selected with care and priced under ₹1,000. Scroll to meet this week’s sale picks.
            </p>
            <button
              onClick={() => scrollToStep(1)}
              className="inline-flex items-center gap-2.5 bg-[#1f3a2d] text-[#f7f6f2] px-6 h-14 rounded-2xl font-medium text-base hover:bg-[#1f3a2d]/90 shadow-card transition-colors pointer-events-auto"
            >
              See the sale ↓
            </button>
          </div>

          {/* Panel 1: Comb */}
          <div ref={p1Ref} className="absolute left-0 right-0 opacity-0 will-change-transform">
            <span className="font-mono text-xs font-bold text-[#d2524b] tracking-wider uppercase">
              FLASH SALE · 1 / 3
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1b2a22] leading-tight my-2">
              Handmade Neem Wood Wide-Tooth Comb
            </h2>
            <small className="text-[#5d665f] text-sm block max-w-sm max-md:hidden">
              Personal care · single artisan piece, 100% seasoned neem. Zero plastic.
            </small>
            <div className="flex items-baseline gap-3 my-4 font-display font-bold text-3xl sm:text-5xl text-[#1b2a22]">
              ₹249 <s className="font-normal text-lg sm:text-xl text-[#5d665f]">₹299</s>
              <em className="font-mono text-xs not-italic bg-[#d2524b] text-white rounded-md px-2 py-1 self-center">
                SAVE 17%
              </em>
            </div>
            <button
              onClick={() => handleAddItem(0)}
              className="inline-flex items-center gap-2 bg-[#1f3a2d] text-[#f7f6f2] px-6 h-12 sm:h-14 rounded-2xl font-medium text-base hover:bg-[#1f3a2d]/90 shadow-card transition-colors pointer-events-auto"
            >
              {addedItems[0] ? "✓ Added to cart" : "+ Add to cart"}
            </button>
          </div>

          {/* Panel 2: Brushes */}
          <div ref={p2Ref} className="absolute left-0 right-0 opacity-0 will-change-transform">
            <span className="font-mono text-xs font-bold text-[#d2524b] tracking-wider uppercase">
              FLASH SALE · 2 / 3
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1b2a22] leading-tight my-2">
              Plant-Fiber Scrub Brushes, Set of 3
            </h2>
            <small className="text-[#5d665f] text-sm block max-w-sm max-md:hidden">
              Home &amp; clean · coconut coir and sisal bristles, ergonomic, compostable.
            </small>
            <div className="flex items-baseline gap-3 my-4 font-display font-bold text-3xl sm:text-5xl text-[#1b2a22]">
              ₹429 <s className="font-normal text-lg sm:text-xl text-[#5d665f]">₹499</s>
              <em className="font-mono text-xs not-italic bg-[#d2524b] text-white rounded-md px-2 py-1 self-center">
                SAVE 14%
              </em>
            </div>
            <button
              onClick={() => handleAddItem(1)}
              className="inline-flex items-center gap-2 bg-[#1f3a2d] text-[#f7f6f2] px-6 h-12 sm:h-14 rounded-2xl font-medium text-base hover:bg-[#1f3a2d]/90 shadow-card transition-colors pointer-events-auto"
            >
              {addedItems[1] ? "✓ Added to cart" : "+ Add to cart"}
            </button>
          </div>

          {/* Panel 3: Scraper */}
          <div ref={p3Ref} className="absolute left-0 right-0 opacity-0 will-change-transform">
            <span className="font-mono text-xs font-bold text-[#d2524b] tracking-wider uppercase">
              FLASH SALE · 3 / 3
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1b2a22] leading-tight my-2">
              Pure Copper Tongue Scraper
            </h2>
            <small className="text-[#5d665f] text-sm block max-w-sm max-md:hidden">
              Personal care · 100% pure antimicrobial copper, Ayurvedic grade.
            </small>
            <div className="flex items-baseline gap-3 my-4 font-display font-bold text-3xl sm:text-5xl text-[#1b2a22]">
              ₹199 <s className="font-normal text-lg sm:text-xl text-[#5d665f]">₹249</s>
              <em className="font-mono text-xs not-italic bg-[#d2524b] text-white rounded-md px-2 py-1 self-center">
                SAVE 20%
              </em>
            </div>
            <button
              onClick={() => handleAddItem(2)}
              className="inline-flex items-center gap-2 bg-[#1f3a2d] text-[#f7f6f2] px-6 h-12 sm:h-14 rounded-2xl font-medium text-base hover:bg-[#1f3a2d]/90 shadow-card transition-colors pointer-events-auto"
            >
              {addedItems[2] ? "✓ Added to cart" : "+ Add to cart"}
            </button>
          </div>

          {/* Panel 4: Daily Ritual Combo */}
          <div ref={p4Ref} className="absolute left-0 right-0 opacity-0 will-change-transform">
            <span className="inline-block bg-[#d2524b] text-white rounded-lg px-3 py-1.5 font-mono text-xs font-bold mb-2">
              SAVE ₹170
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1b2a22] leading-tight mb-2">
              The Daily Ritual Combo
            </h2>
            <div className="my-3 border-t border-[#c9bfab]">
              <div className="flex justify-between py-2 border-b border-[#c9bfab] text-sm font-medium">
                <span>Neem Wood Comb</span>
                <span>
                  <s className="text-[#5d665f] mr-2">₹299</s>₹249
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#c9bfab] text-sm font-medium">
                <span>Plant-Fiber Scrub Brushes</span>
                <span>
                  <s className="text-[#5d665f] mr-2">₹499</s>₹429
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#c9bfab] text-sm font-medium">
                <span>Copper Tongue Scraper</span>
                <span>
                  <s className="text-[#5d665f] mr-2">₹249</s>₹199
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-3 my-3 font-display font-bold text-3xl sm:text-5xl text-[#1b2a22]">
              ₹877 <s className="font-normal text-lg sm:text-xl text-[#5d665f]">₹1,047</s>
            </div>
            <button
              onClick={handleAddCombo}
              className="inline-flex items-center gap-2 bg-[#1f3a2d] text-[#f7f6f2] px-6 h-12 sm:h-14 rounded-2xl font-medium text-base hover:bg-[#1f3a2d]/90 shadow-card transition-colors pointer-events-auto"
            >
              {comboAdded ? "✓ Combo added to cart!" : "Add combo to cart"}
            </button>
          </div>
        </div>

        {/* Steps Navigation Bar (Bottom Center) */}
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex items-center gap-2 z-20 max-md:bottom-3 max-md:gap-1.5">
          {[
            { label: "Bottle", step: 0 },
            { label: "Comb −17%", step: 1 },
            { label: "Brushes −14%", step: 2 },
            { label: "Scraper −20%", step: 3 },
            { label: "Combo", step: 4 },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => scrollToStep(item.step)}
              className={`rounded-full px-4 py-2 font-mono text-xs font-bold transition-all backdrop-blur-md border ${
                activeStep === item.step
                  ? "bg-[#1f3a2d] text-[#f7f6f2] border-[#1f3a2d]"
                  : "bg-[#f7f6f2]/80 text-[#5d665f] border-[#1f3a2d]/25 hover:border-[#1f3a2d]/50"
              } max-md:px-2.5 max-md:py-1 max-md:text-[10px]`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scroll Hint (Bottom Right) */}
        <div
          ref={hintRef}
          className="absolute right-8 bottom-6 font-mono text-xs font-medium text-[#4d4636] transition-opacity duration-500 max-md:hidden"
        >
          Scroll ↓
        </div>
      </div>
    </section>
  );
}
