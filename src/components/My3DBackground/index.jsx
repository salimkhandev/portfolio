import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { throttle, getDevicePerformance } from "../../utils/throttle";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Vector3,
  AdditiveBlending,
  MathUtils,
  DoubleSide,
} from "three";

function PointsField({ isDark, performanceLevel }) {
  // Adjust particles based on performance level
  const baseParticleCount = 5000;
  const particlesCount = Math.floor(
    baseParticleCount * performanceLevel.particleMultiplier,
  );
  const pointsRef = useRef(null);
  const geometry = useMemo(() => new BufferGeometry(), []);
  const positions = useMemo(
    () => new Float32Array(particlesCount * 3),
    [particlesCount],
  );
  const sizes = useMemo(
    () => new Float32Array(particlesCount),
    [particlesCount],
  );
  const colors = useMemo(
    () => new Float32Array(particlesCount * 3),
    [particlesCount],
  );

  const colorOptions = useMemo(
    () => [
      new Color(isDark ? "#3a2020" : "#ffcaca").toArray(),
      new Color(isDark ? "#352432" : "#f8c8e0").toArray(),
      new Color(isDark ? "#2a2a42" : "#c8c8ff").toArray(),
      new Color(isDark ? "#1f2e2e" : "#c5e8e8").toArray(),
    ],
    [isDark],
  );

  useMemo(() => {
    for (let i = 0; i < particlesCount; i++) {
      // Create three layers of particles with different distributions
      const i3 = i * 3;
      const layer = Math.random();

      if (layer < 0.7) {
        // Main galaxy-like spiral distribution
        const radius = 15 + Math.random() * 25;
        const theta = MathUtils.randFloatSpread(Math.PI * 2);
        const phi =
          MathUtils.randFloatSpread(Math.PI * 0.5) + Math.random() * 0.2;
        const spiral = 2 * Math.PI * Math.random() * 3;

        positions[i3] = radius * Math.cos(theta + spiral) * Math.cos(phi);
        positions[i3 + 1] = radius * Math.sin(phi) * 0.5;
        positions[i3 + 2] = radius * Math.sin(theta + spiral) * Math.cos(phi);
      } else if (layer < 0.9) {
        // Distant stars (uniform random)
        positions[i3] = MathUtils.randFloatSpread(100);
        positions[i3 + 1] = MathUtils.randFloatSpread(100);
        positions[i3 + 2] = MathUtils.randFloatSpread(100);
      } else {
        // Near dust particles (concentrated around camera)
        positions[i3] = MathUtils.randFloatSpread(30);
        positions[i3 + 1] = MathUtils.randFloatSpread(30);
        positions[i3 + 2] = MathUtils.randFloatSpread(30) + 15;
      }

      // Randomize sizes for more realistic star field
      sizes[i] = Math.random() * 1.5;

      // Randomize colors from options
      const colorChoice = Math.floor(Math.random() * colorOptions.length);
      colors[i3] = colorOptions[colorChoice][0];
      colors[i3 + 1] = colorOptions[colorChoice][1];
      colors[i3 + 2] = colorOptions[colorChoice][2];

      // Occasional brighter stars
      if (Math.random() > 0.99) {
        sizes[i] *= 2;
        colors[i3] = colors[i3 + 1] = colors[i3 + 2] = 0.9;
      }
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("size", new BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
  }, [geometry, positions, sizes, colors, colorOptions, particlesCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      // Slower rotation for smoother movement
      pointsRef.current.rotation.y = t * 0.01;
      pointsRef.current.rotation.x = Math.sin(t * 0.003) * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={AdditiveBlending}
        alphaMap={null}
      />
    </points>
  );
}

function FilmFrames({ isDark, performanceLevel }) {
  const baseCount = 10;
  const count = Math.max(
    3,
    Math.floor(baseCount * performanceLevel.particleMultiplier),
  ); // Adjust based on performance
  const groupRef = useRef(null);
  const frames = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      position: new Vector3(
        (Math.random() - 0.5) * 50, // Slightly reduced distribution
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50,
      ),
      scale: 0.8 + Math.random() * 2, // Slightly reduced sizes
      rotation: new Vector3(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.0005, // Slower rotation for less CPU usage
        y: (Math.random() - 0.5) * 0.0005,
        z: (Math.random() - 0.5) * 0.0004,
      },
      orbitRadius: 20 + Math.random() * 20, // Reduced orbit range
      orbitSpeed: 0.03 + Math.random() * 0.05, // Slower orbits
      orbitOffset: Math.random() * Math.PI * 2,
      isAccent: i % 5 === 0, // Every 5th is accent
      isGlow: i % 10 === 0, // Fewer glow effects (1 in 10 instead of 1 in 7)
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const f = frames[index];

      // Base rotation
      child.rotation.x += f.rotationSpeed.x;
      child.rotation.y += f.rotationSpeed.y;
      child.rotation.z += f.rotationSpeed.z;

      // Orbital motion
      if (index % 3 === 0) {
        // Only some frames orbit with slower movement
        child.position.x =
          Math.sin(t * f.orbitSpeed * 0.3 + f.orbitOffset) * f.orbitRadius;
        child.position.z =
          Math.cos(t * f.orbitSpeed * 0.3 + f.orbitOffset) * f.orbitRadius;
      }

      // Material effects
      const material = child.material;
      if (f.isAccent) {
        material.opacity = 0.25 + Math.sin(t * 0.8 + index) * 0.15;
      } else if (f.isGlow) {
        material.emissiveIntensity =
          0.5 + Math.sin(t * 0.4 + index * 0.5) * 0.4;
      }
    });
  });

  const materialColor = (isAccent, isGlow) => {
    if (isGlow) {
      return isDark ? "#ff6e6e" : "#ff9e9e";
    }
    return isDark
      ? isAccent
        ? "#ff4d4d"
        : "#2a2a2a"
      : isAccent
        ? "#ff4d4d"
        : "#e0e0e0";
  };

  return (
    <group ref={groupRef}>
      {frames.map((f, i) => {
        const size = f.scale;
        return (
          <mesh
            key={i}
            position={[f.position.x, f.position.y, f.position.z]}
            rotation={[f.rotation.x, f.rotation.y, f.rotation.z]}
          >
            <boxGeometry args={[1.5 * size, 1 * size, 0.05 * size]} />
            {f.isGlow ? (
              <meshPhongMaterial
                color={materialColor(f.isAccent, f.isGlow)}
                wireframe
                transparent
                opacity={0.3}
                emissive={isDark ? "#ff2222" : "#ff7777"}
                emissiveIntensity={0.5}
                side={DoubleSide}
                shininess={100}
              />
            ) : (
              <meshBasicMaterial
                wireframe
                opacity={0.2}
                transparent
                color={materialColor(f.isAccent, f.isGlow)}
              />
            )}
          </mesh>
        );
      })}
    </group>
  );
}

function Timeline({ performanceLevel }) {
  const groupRef = useRef(null);
  const baseCount = 5;
  const count = Math.max(
    2,
    Math.floor(baseCount * performanceLevel.particleMultiplier),
  ); // Adjust based on performance

  const lines = useMemo(() => {
    return new Array(count).fill(0).map((_, lineIndex) => {
      const isMainLine = lineIndex < 2; // First few are main lines
      const segmentCount = isMainLine ? 15 : 10;
      const points = [];

      if (isMainLine) {
        // Create flowing data stream lines
        const amplitude = 3 + Math.random() * 2;
        const frequency = 0.3 + Math.random() * 0.2;
        const phase = Math.random() * Math.PI * 2;

        for (let j = 0; j < segmentCount; j++) {
          const xPos = (j - segmentCount / 2) * 3;
          points.push([
            xPos,
            Math.sin(j * frequency + phase) * amplitude,
            (Math.random() - 0.5) * 8,
          ]);
        }
      } else {
        // Create more chaotic patterns for background lines
        let lastX = -segmentCount;
        let lastY = 0;
        let lastZ = (Math.random() - 0.5) * 20;

        for (let j = 0; j < segmentCount; j++) {
          lastX += 1 + Math.random();
          lastY += (Math.random() - 0.5) * 2;
          lastZ += (Math.random() - 0.5) * 2;
          points.push([lastX, lastY, lastZ]);
        }
      }

      // Position and styling
      const y = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 40;
      const color = isMainLine
        ? lineIndex === 0
          ? "#ff4d4d"
          : lineIndex === 1
            ? "#4d8aff"
            : "#9e4dff"
        : "#ff4d4d";
      const width = isMainLine ? 1.2 : 0.6;
      const opacity = isMainLine ? 0.25 : 0.12;

      return {
        points,
        y,
        z,
        color,
        width,
        opacity,
        speed: 0.1 + Math.random() * 0.2,
        isMainLine,
      };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const line = lines[index];

      // Animation based on line type
      if (line.isMainLine) {
        // Flowing motion for main lines
        child.rotation.z = Math.sin(t * 0.2 + index) * 0.1;
        child.position.x = Math.sin(t * 0.15 + index * 0.5) * 2;

        // Pulse effect for main lines
        if (child.material) {
          child.material.opacity =
            line.opacity * (0.8 + Math.sin(t * line.speed + index) * 0.2);
        }
      } else {
        // Subtle movement for background lines
        child.rotation.z = Math.sin(t * 0.1 + index) * 0.03;
        child.rotation.y = Math.cos(t * 0.07 + index) * 0.02;
        child.position.z = Math.sin(t * 0.05 + index * 0.2) * 5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((l, i) => (
        <Line
          key={i}
          points={l.points}
          position={[0, l.y, l.z]}
          color={l.color}
          lineWidth={l.width}
          transparent
          opacity={l.opacity}
          dashed={!l.isMainLine && i % 3 === 0}
          dashSize={1}
          dashOffset={0}
          gapSize={0.5}
        />
      ))}
    </group>
  );
}

function ThemeEffects({ isDark }) {
  const { gl, scene, camera } = useThree();

  // Set background immediately on mount and theme change
  useEffect(() => {
    const backgroundColor = new Color(isDark ? "#050507" : "#f8f8fa");
    scene.background = backgroundColor;
    // Deeper fog for more atmospheric effect
    scene.fog = new Fog(backgroundColor, 15, 60);
    gl.setClearColor(backgroundColor);

    // Force immediate update
    gl.clear();
  }, [gl, scene, isDark, camera]);

  // Add lighting to the scene
  useEffect(() => {
    // Remove any existing lights
    scene.children = scene.children.filter(
      (child) =>
        !(child.type === "AmbientLight" || child.type === "DirectionalLight"),
    );

    // Add ambient light
    const ambientLight = new Color(isDark ? 0x222233 : 0xccccdd);
    scene.add({
      type: "AmbientLight",
      color: ambientLight,
      intensity: isDark ? 0.8 : 1.2,
    });

    // Add directional light
    const directionalLight = new Color(isDark ? 0x6666ff : 0xffffcc);
    scene.add({
      type: "DirectionalLight",
      color: directionalLight,
      intensity: isDark ? 0.5 : 0.8,
      position: { x: 5, y: 10, z: 7 },
    });
  }, [scene, isDark]);

  // Simplified mouse parallax with reduced computation
  useEffect(() => {
    let mouseX = 0,
      mouseY = 0,
      targetX = 0,
      targetY = 0;
    let scrollY = 0;
    let raf;
    let prevX = 0,
      prevY = 0;

    // Less sensitive mouse tracking with more throttling
    const onMove = throttle((e) => {
      // Skip calculations if touch event (mobile)
      if (e.touches) return;

      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, 100); // 100ms throttle (10fps)

    // Reduced scroll tracking with throttling
    const onScroll = throttle(() => {
      scrollY =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }, 150); // 150ms throttle (~7fps)

    const onFrame = () => {
      // Gentler mouse movement with reduced calculations
      targetX = mouseX * 0.8; // Further reduced effect
      targetY = mouseY * 0.6; // Further reduced effect

      // Simplified smoothing
      prevX = prevX * 0.95 + (targetX - camera.position.x) * 0.05;
      prevY = prevY * 0.95 + (targetY - camera.position.y) * 0.05;

      camera.position.x += prevX * 0.3;
      camera.position.y += prevY * 0.3;

      // Minimal rotation
      camera.rotation.x = -mouseY * 0.01;
      camera.rotation.y = mouseX * 0.01;

      // Simplified scroll effect
      camera.position.y = -scrollY * 2 + targetY * 0.5;

      raf = requestAnimationFrame(onFrame);
    };

    // Use our throttled function directly
    const smoothMouseMove = onMove;

    window.addEventListener("mousemove", smoothMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(onFrame);

    return () => {
      window.removeEventListener("mousemove", smoothMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [camera]);

  return null;
}

export default function My3DBackground() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [performanceLevel, setPerformanceLevel] = useState({
    particleMultiplier: 0.5,
    shouldDisable3D: false,
    isMobile: false,
    reducedMotion: false,
  });

  useEffect(() => {
    setMounted(true);

    // Check for user's preferred color scheme
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);

    // Use our utility to detect device performance
    const detectDeviceCapabilities = () => {
      const performance = getDevicePerformance();
      setPerformanceLevel(performance);
    };

    detectDeviceCapabilities();
    // Throttle resize event
    window.addEventListener("resize", throttle(detectDeviceCapabilities, 500));

    // Listen for changes to the user's color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("resize", detectDeviceCapabilities);
    };
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the final background
    return (
      <div className="fixed inset-0 -z-10 bg-white dark:bg-gradient-to-b dark:from-[#0b1020] dark:to-[#0e1326]" />
    );
  }

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundColor: isDarkMode ? "#0a0a0a" : "#f5f5f5",
        backgroundImage: performanceLevel.shouldDisable3D
          ? `radial-gradient(circle at 50% 50%, ${isDarkMode ? "#1a1a3a" : "#e0e0ff"} 0%, ${isDarkMode ? "#050510" : "#f5f5f5"} 100%)`
          : "none",
      }}
    >
      {!performanceLevel.shouldDisable3D ? (
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60 }}
          dpr={Math.min(
            window.devicePixelRatio,
            performanceLevel.particleMultiplier,
          )} // Adjust DPR based on performance
          performance={{
            min: performanceLevel.particleMultiplier * 0.2,
            max: performanceLevel.particleMultiplier * 0.5,
          }} // Adjust targets based on performance
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
            depth: performanceLevel.particleMultiplier > 0.4, // Only enable depth testing on better devices
          }}
          style={{ backgroundColor: isDarkMode ? "#050507" : "#f8f8fa" }}
          shadows={false} // Disabled shadows for better performance
        >
          <ThemeEffects isDark={isDarkMode} />
          <PointsField
            isDark={isDarkMode}
            performanceLevel={performanceLevel}
          />
          <FilmFrames isDark={isDarkMode} performanceLevel={performanceLevel} />
          <Timeline performanceLevel={performanceLevel} />
        </Canvas>
      ) : (
        <div className="w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  );
}
