"use client";

import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

function latLonToCamera(lat: number, lon: number, radius = 6) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = lon * (Math.PI / 180);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta)
  );
}

export default function CameraController({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const { camera } = useThree();
  const current = useRef(camera.position.clone());

  useFrame(() => {
    const target = latLonToCamera(lat, lon);
    current.current.lerp(target, 0.08);
    camera.position.copy(current.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
