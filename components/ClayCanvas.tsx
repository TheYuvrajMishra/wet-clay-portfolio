"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const DENT_COUNT = 5;
const DENT_RADIUS = 0.55;
const DENT_DEPTH = 0.34;

type Dent = { center: THREE.Vector3; strength: number; target: number };

/** Clay material with cursor-driven vertex dents injected into the vertex shader. */
function useClayMaterial() {
  return useMemo(() => {
    const uniforms = {
      uDents: {
        value: Array.from(
          { length: DENT_COUNT },
          () => new THREE.Vector4(0, 0, 0, 0)
        ),
      },
      uRadius: { value: DENT_RADIUS },
    };

    const material = new THREE.MeshStandardMaterial({
      color: "#d9cfbf",
      roughness: 0.88,
      metalness: 0.02,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDents = uniforms.uDents;
      shader.uniforms.uRadius = uniforms.uRadius;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>\nuniform vec4 uDents[${DENT_COUNT}];\nuniform float uRadius;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          for (int i = 0; i < ${DENT_COUNT}; i++) {
            vec4 dent = uDents[i];
            float dist = distance(position, dent.xyz);
            float fall = smoothstep(uRadius, 0.0, dist);
            transformed -= normal * (fall * fall * dent.w);
          }`
        );
    };
    material.customProgramCacheKey = () => "clay-dent-v1";

    return { material, uniforms };
  }, []);
}

function ClayMesh() {
  const group = useRef<THREE.Group>(null);
  const proxy = useRef<THREE.Mesh>(null);
  const { material, uniforms } = useClayMaterial();
  const { gl, camera } = useThree();
  const reduceMotion = useReducedMotion();

  const state = useRef({
    dents: Array.from({ length: DENT_COUNT }, (): Dent => ({
      center: new THREE.Vector3(),
      strength: 0,
      target: 0,
    })),
    rotX: 0.12,
    rotY: 0.5,
    targetRotX: 0.12,
    targetRotY: 0.5,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointer: new THREE.Vector2(-10, -10),
    pointerActive: false,
  });

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;

    const setPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.pointer.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
    };

    const onMove = (e: PointerEvent) => {
      if (s.dragging) {
        const dx = e.clientX - s.lastX;
        const dy = e.clientY - s.lastY;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        s.targetRotY += dx * 0.006;
        s.targetRotX = THREE.MathUtils.clamp(s.targetRotX + dy * 0.006, -0.7, 0.7);
        return;
      }
      setPointer(e);
      s.pointerActive = true;
    };
    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      s.dragging = false;
    };
    const onLeave = () => {
      s.dragging = false;
      s.pointerActive = false;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("lostpointercapture", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("lostpointercapture", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const g = group.current;
    const p = proxy.current;
    if (!g || !p) return;

    // Idle spin + eased drag rotation
    if (!s.dragging && !reduceMotion) s.targetRotY += dt * 0.14;
    const rk = 1 - Math.exp(-dt * 7);
    s.rotX += (s.targetRotX - s.rotX) * rk;
    s.rotY += (s.targetRotY - s.rotY) * rk;
    g.rotation.set(s.rotX, s.rotY, 0);

    // Cursor dents the clay (skipped while drag-rotating).
    // Raycast against a cheap invisible proxy so the 23k-vert mesh stays smooth.
    if (s.pointerActive && !s.dragging && !reduceMotion) {
      raycaster.setFromCamera(s.pointer, camera);
      const hit = raycaster.intersectObject(p, false)[0];
      if (hit) {
        const local = p.worldToLocal(hit.point.clone());
        if (local.distanceTo(s.dents[0].center) > 0.09) {
          for (let i = DENT_COUNT - 1; i > 0; i--) {
            s.dents[i].center.copy(s.dents[i - 1].center);
            s.dents[i].target = s.dents[i - 1].target;
          }
          s.dents[0].center.copy(local);
          s.dents[0].target = DENT_DEPTH;
        }
      }
    }

    // Memory-foam rebound: dents relax slowly, strengths ease toward targets
    for (let i = 0; i < DENT_COUNT; i++) {
      const d = s.dents[i];
      d.target *= Math.exp(-dt * 0.45);
      const kk = 1 - Math.exp(-dt * (d.target > d.strength ? 12 : 2.4));
      d.strength += (d.target - d.strength) * kk;
      if (d.strength < 0.0005) d.strength = 0;
      uniforms.uDents.value[i].set(
        d.center.x,
        d.center.y,
        d.center.z,
        d.strength
      );
    }
  });

  return (
    <group ref={group} scale={[1, 0.94, 1]}>
      <mesh material={material}>
        <icosahedronGeometry args={[1.55, 48]} />
      </mesh>
      {/* invisible low-poly proxy: raycasting the 23k-vert mesh every frame would jank */}
      <mesh ref={proxy} visible={false}>
        <icosahedronGeometry args={[1.55, 12]} />
      </mesh>
    </group>
  );
}

export function ClayCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.35, 5.2], fov: 33 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.9} color="#fff4e6" />
      <directionalLight position={[-6, 3, -4]} intensity={2.6} color="#e59a4f" />
      <directionalLight position={[0, -5, 2]} intensity={0.45} color="#8a93ff" />
      <ClayMesh />
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.62}
        scale={9}
        blur={2.8}
        far={3.2}
        color="#000000"
      />
    </Canvas>
  );
}
