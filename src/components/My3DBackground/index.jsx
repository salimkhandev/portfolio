import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Group,
  Vector3,
  AdditiveBlending,
  MathUtils,
  DoubleSide,
} from "three";

function PointsField({ isDark }) {
  const particlesCount = 15000;
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

function FilmFrames({ isDark }) {
  const count = 20; // Increased for more interesting scene
  const groupRef = useRef(null);
  const frames = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      position: new Vector3(
        (Math.random() - 0.5) * 60, // Wider distribution
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60,
      ),
      scale: 0.8 + Math.random() * 2.5, // Variable sizes
      rotation: new Vector3(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.001,
        y: (Math.random() - 0.5) * 0.001,
        z: (Math.random() - 0.5) * 0.0008,
      },
      orbitRadius: 20 + Math.random() * 30,
      orbitSpeed: 0.05 + Math.random() * 0.1,
      orbitOffset: Math.random() * Math.PI * 2,
      isAccent: i % 5 === 0, // Every 5th is accent
      isGlow: i % 7 === 0, // Some have glow effect
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

function Timeline() {
  const groupRef = useRef(null);
  const count = 10; // Increased for more visual interest

  const lines = useMemo(() => {
    return new Array(count).fill(0).map((_, lineIndex) => {
      const isMainLine = lineIndex < 3; // First few are main lines
      const segmentCount = isMainLine ? 25 : 15;
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

  // Enhanced mouse parallax with depth effect
  useEffect(() => {
    let mouseX = 0,
      mouseY = 0,
      targetX = 0,
      targetY = 0;
    let scrollY = 0;
    let raf;
    let prevX = 0,
      prevY = 0;

    // Less sensitive mouse tracking
    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Track scrolling for vertical parallax with damping
    const onScroll = () => {
      const newScrollY =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      // Apply damping to scroll movement
      scrollY = scrollY * 0.9 + newScrollY * 0.1;
    };

    const onFrame = () => {
      // Gentler mouse movement
      targetX = mouseX * 1.5; // Reduced effect
      targetY = mouseY * 1.2; // Reduced effect

      // Apply exponential smoothing for camera movement (much smoother)
      prevX = prevX * 0.92 + (targetX - camera.position.x) * 0.08;
      prevY = prevY * 0.92 + (targetY - camera.position.y) * 0.08;

      camera.position.x += prevX * 0.5;
      camera.position.y += prevY * 0.5;

      // Add very slight tilt based on mouse position
      camera.rotation.x = -mouseY * 0.02; // Reduced effect
      camera.rotation.y = mouseX * 0.02; // Reduced effect

      // Add slight scroll-based movement with damping
      camera.position.y = -scrollY * 3 + targetY * 0.8;

      raf = requestAnimationFrame(onFrame);
    };

    // More aggressive throttling for mouse events
    let lastMove = 0;
    const smoothMouseMove = (e) => {
      const now = performance.now();
      if (now - lastMove > 32) {
        // 30fps throttle instead of 60fps
        onMove(e);
        lastMove = now;
      }
    };

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

  useEffect(() => {
    setMounted(true);

    // Check for user's preferred color scheme
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);

    // Listen for changes to the user's color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
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
      style={{ backgroundColor: isDarkMode ? "#0a0a0a" : "#f5f5f5" }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        performance={{ min: 0.4, max: 0.7 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
          stencil: false,
          depth: true,
        }}
        style={{ backgroundColor: isDarkMode ? "#050507" : "#f8f8fa" }}
        shadows
      >
        <ThemeEffects isDark={isDarkMode} />
        <PointsField isDark={isDarkMode} />
        <FilmFrames isDark={isDarkMode} />
        <Timeline />
      </Canvas>
    </div>
  );
}
