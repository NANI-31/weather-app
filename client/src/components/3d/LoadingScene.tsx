import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sphere,
  MeshDistortMaterial,
  Environment,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

// Generate static random data once to avoid impure render calls
const baseCloudsData = Array.from({ length: 8 }, () => ({
  position: [
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 4 - 1,
    (Math.random() - 0.5) * 4 - 2,
  ] as [number, number, number],
  scale: 0.3 + Math.random() * 0.4,
  speed: 0.5 + Math.random() * 1,
}));

const baseRainData = new Float32Array(300 * 3);
for (let i = 0; i < 300; i++) {
  baseRainData[i * 3] = (Math.random() - 0.5) * 10;
  baseRainData[i * 3 + 1] = Math.random() * 10 - 5;
  baseRainData[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0.5, 0]}>
        <MeshDistortMaterial
          color="#FF8C00"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.3}
        />
      </Sphere>
    </Float>
  );
};

const Clouds = () => {
  // Memoize clouds so geometries/materials aren't recreated each render
  const cloudSpheres = useMemo(() => {
    return baseCloudsData.map((cloud, i) => (
      <Float key={i} speed={cloud.speed} floatIntensity={0.5}>
        <Sphere args={[cloud.scale, 16, 16]} position={cloud.position}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={1}
          />
        </Sphere>
      </Float>
    ));
  }, []);
  return <>{cloudSpheres}</>;
};

const RainDrops = () => {
  const dropsRef = useRef<THREE.Points>(null);

  // Clone the base data so we have a fresh mutable array for this instance
  const particles = useMemo(() => new Float32Array(baseRainData), []);

  useFrame(() => {
    if (dropsRef.current) {
      const positions = dropsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < 200; i++) {
        positions[i * 3 + 1] -= 0.1;
        if (positions[i * 3 + 1] < -5) positions[i * 3 + 1] = 5;
      }
      dropsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={dropsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6BA3D6" size={0.03} transparent opacity={0.6} />
    </points>
  );
};

const WeatherScene3D = () => {
  // Optional: listen for WebGL context lost/restored
  // useEffect(() => {
  //   const canvas = document.querySelector("canvas");
  //   if (!canvas) return;

  //   const onLost = (e: Event) => {
  //     e.preventDefault();
  //     console.warn("WebGL context lost");
  //   };
  //   const onRestored = () => console.log("WebGL context restored");

  //   canvas.addEventListener("webglcontextlost", onLost);
  //   canvas.addEventListener("webglcontextrestored", onRestored);

  //   return () => {
  //     canvas.removeEventListener("webglcontextlost", onLost);
  //     canvas.removeEventListener("webglcontextrestored", onRestored);
  //   };
  // }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ powerPreference: "default", preserveDrawingBuffer: false }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FF8C00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFD700" />

      <Sun />
      <Clouds />
      <RainDrops />
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Environment preset="sunset" />
    </Canvas>
  );
};

interface LoadingScreenProps {
  progress?: number;
  onComplete?: () => void;
  isEmbedded?: boolean;
}

const LoadingScreen = ({
  progress = 0,
  isEmbedded = false,
}: LoadingScreenProps) => {
  if (isEmbedded) {
    return (
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-linear-to-br from-orange-500 via-red-500 to-yellow-500 overflow-hidden">
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <WeatherScene3D />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-orange-500 via-red-500 to-yellow-500">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <WeatherScene3D />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo/Title */}
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl tracking-tight">
            Weather
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mt-2 font-light tracking-widest">
            FORECAST
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 md:w-80 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-white/80 text-sm font-medium tracking-wider animate-pulse">
          {progress < 30 && "Fetching weather data..."}
          {progress >= 30 && progress < 60 && "Analyzing atmosphere..."}
          {progress >= 60 && progress < 90 && "Preparing your forecast..."}
          {progress >= 90 && "Almost ready..."}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
