"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobalGlobeBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ref.current.appendChild(renderer.domElement);

    // 🌍 Globe
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 64, 64),
      new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("/textures/earth.jpg"),
        roughness: 1,
        metalness: 0
      })
    );
    scene.add(globe);

    // Soft lights (LOW intensity)
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(4, 2, 5);
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
      ref.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="globe-bg" ref={ref} />;
}
