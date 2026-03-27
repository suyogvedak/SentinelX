"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔹 ADDITION: keep a ref to globe (does NOT change existing logic)
  const globeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 🌍 Globe
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 64, 64),
      new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("/textures/earth.jpg"),
        roughness: 1,
      })
    );
    scene.add(globe);

    // 🔹 ADDITION: store globe reference (no behavior change)
    globeRef.current = globe;

    // Soft lights (NOT bright)
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const animate = () => {
      globe.rotation.y += 0.0006;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // ✅ ADDITION ONLY — Auth interactions (isolated, safe)
  useEffect(() => {
    const onAuthFocus = () => {
      if (globeRef.current) {
        globeRef.current.rotation.y += 0.4;
      }
    };

    const onScroll = () => {
      if (globeRef.current) {
        globeRef.current.rotation.y = window.scrollY * 0.002;
      }
    };

    window.addEventListener("auth-focus", onAuthFocus);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("auth-focus", onAuthFocus);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div className="globe-container" ref={containerRef} />;
}
