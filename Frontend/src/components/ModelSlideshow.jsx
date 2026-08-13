import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";

/* ── Preload all models upfront ── */
useGLTF.preload("/model1.glb");
useGLTF.preload("/model2.glb");
useGLTF.preload("/model3.glb");

const MODELS = [
  { path: "/model1.glb", label: "Look 1" },
  { path: "/model2.glb", label: "Look 2" },
  { path: "/model3.glb", label: "Look 3" },
];

/* Individual model — auto-rotates, fades in/out via opacity */
function ClothingModel({ path, visible }) {
  const { scene } = useGLTF(path);
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current && visible) {
      ref.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene.clone(true)}
      scale={1.6}
      position={[0, 0.2, 0]}
      visible={visible}
    />
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#7c5cfc" wireframe />
    </mesh>
  );
}

export default function ModelSlideshow({ height = 440 }) {
  const [active, setActive]     = useState(0);
  const [fading, setFading]     = useState(false);
  const [displayIdx, setDisplay] = useState(0); // drives which model actually shows

  /* Crossfade logic */
  const goTo = (next) => {
    if (fading || next === active) return;
    setFading(true);
    setTimeout(() => {
      setDisplay(next);
      setActive(next);
      setFading(false);
    }, 500);
  };

  const prev = () => goTo((active + MODELS.length - 1) % MODELS.length);
  const next = () => goTo((active + 1) % MODELS.length);

  /* Auto-advance every 10 s */
  useEffect(() => {
    const id = setInterval(() => next(), 10000);
    return () => clearInterval(id);
  }, [active, fading]);

  return (
    <div className="model-slideshow" style={{ height }}>

      {/* 3D Canvas */}
      <div
        className="model-canvas-wrap"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Canvas camera={{ position: [0, 0.8, 6], fov: 42 }} shadows gl={{ antialias: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <pointLight position={[-4, 4, -4]} intensity={0.5} color="#a78bfa" />
          <pointLight position={[4, -2, 4]}  intensity={0.3} color="#38bdf8" />
          <Environment preset="city" />

          <Suspense fallback={<Loader />}>
            {MODELS.map((m, i) => (
              <ClothingModel key={m.path} path={m.path} visible={i === displayIdx} />
            ))}
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.45}
              scale={8}
              blur={2.5}
              far={4}
              color="#7c5cfc"
            />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
          />
        </Canvas>
      </div>

      {/* Left arrow */}
      <button
        className="slide-arrow slide-arrow-left"
        onClick={prev}
        aria-label="Previous model"
      >
        ‹
      </button>

      {/* Right arrow */}
      <button
        className="slide-arrow slide-arrow-right"
        onClick={next}
        aria-label="Next model"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="slide-dots">
        {MODELS.map((m, i) => (
          <button
            key={i}
            className={`slide-dot${i === active ? " active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={m.label}
          />
        ))}
      </div>

      {/* Label */}
      <div className="slide-label">
        <span>{MODELS[active].label}</span>
        <span className="slide-hint">↻ Drag to rotate</span>
      </div>
    </div>
  );
}
