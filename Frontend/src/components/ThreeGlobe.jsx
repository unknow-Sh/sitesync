import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const PROJECT_PINS = [
  { lat: 19.076, lng: 72.877, color: '#F59E0B', label: 'Mumbai' },
  { lat: 28.679, lng: 77.069, color: '#0EA5E9', label: 'Delhi' },
  { lat: 12.971, lng: 77.594, color: '#10B981', label: 'Bengaluru' },
  { lat: 25.204, lng: 55.270, color: '#F59E0B', label: 'Dubai' },
  { lat: -1.286, lng: 36.817, color: '#8B5CF6', label: 'Nairobi' },
  { lat: 17.385, lng: 78.486, color: '#0EA5E9', label: 'Hyderabad' },
];

function latLngToVec3(lat, lng, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobePin({ lat, lng, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.3);
    }
  });
  const pos = latLngToVec3(lat, lng, 2.06);
  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </mesh>
  );
}

function GlobeMesh() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  const texture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0A0E1A';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = (90 - lat) / 180 * 512;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = (lng + 180) / 360 * 1024;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={meshRef}>
      {/* Globe base */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          transparent
          opacity={0.06}
          wireframe
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshStandardMaterial
          color="#0EA5E9"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Pins */}
      {PROJECT_PINS.map((pin, i) => (
        <GlobePin key={i} {...pin} />
      ))}
    </group>
  );
}

export default function ThreeGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#F59E0B" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#0EA5E9" />

      <Stars
        radius={50}
        depth={30}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      <GlobeMesh />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={2 * Math.PI / 3}
      />
    </Canvas>
  );
}
