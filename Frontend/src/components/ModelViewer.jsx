import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/model.glb");
  const ref = useRef();

  // Gentle auto-rotation
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.8}
      position={[0, -1.6, 0]}
      castShadow
    />
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#7c5cfc" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ height = 420 }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(124,92,252,0.25)",
        background: "radial-gradient(ellipse at 50% 60%, rgba(124,92,252,0.12) 0%, #0d0f1a 70%)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,92,252,0.15)",
        cursor: "grab",
        position: "relative",
      }}
    >
      {/* Drag hint */}
      <div style={{
        position: "absolute",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 11,
        color: "rgba(167,139,250,0.6)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 600,
        zIndex: 10,
        pointerEvents: "none",
        fontFamily: "Inter, sans-serif",
      }}>
        ↻ Drag to rotate
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 4, -4]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[4, -2, 4]}  intensity={0.3} color="#38bdf8" />

        {/* Environment */}
        <Environment preset="city" />

        {/* Model */}
        <Suspense fallback={<Loader />}>
          <Model />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={8}
            blur={2}
            far={4}
            color="#7c5cfc"
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// Preload for performance
useGLTF.preload("/model.glb");
