import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface EnchantedGardenCanvasProps {
  isInvitationOpened: boolean;
}

export const EnchantedGardenCanvas: React.FC<EnchantedGardenCanvasProps> = ({ isInvitationOpened }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

    // Scene setup with transparent background so the blurred wedding photo shows through
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 11);

    // Renderer setup with alpha enabled
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.25 : 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSmallScreen;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig (Key light + Hemisphere fill + Soft rim light)
    const keyLight = new THREE.DirectionalLight(0xFFF1D8, 2.2);
    keyLight.position.set(5, 12, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xFFF6E8, 0x641C2C, 1.1);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xC4A46A, 0.85); // Antique gold rim
    rimLight.position.set(-6, 8, -4);
    scene.add(rimLight);

    // Ground plane with subtle contact shadow receiver (transparent so wedding photo shows)
    const groundGeo = new THREE.PlaneGeometry(35, 35);
    const groundMat = new THREE.ShadowMaterial({
      opacity: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.8;
    ground.receiveShadow = !isSmallScreen;
    scene.add(ground);

    // Leaf shape geometry (curved realistic petal/leaf)
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.18, 0.3, 0.28, 0.75, 0, 1.1);
    leafShape.bezierCurveTo(-0.28, 0.75, -0.18, 0.3, 0, 0);

    const leafExtrudeSettings = {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    };
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, leafExtrudeSettings);
    leafGeo.center();
    leafGeo.scale(0.35, 0.35, 0.35);

    // Leaf palette materials
    const leafColors = [
      new THREE.Color(0x641C2C), // Deep maroon
      new THREE.Color(0x7B263A), // Burgundy
      new THREE.Color(0x43121F), // Dark wine
      new THREE.Color(0x8F364B), // Rich berry
      new THREE.Color(0xC27D8C), // Muted rose
      new THREE.Color(0xC4A46A), // Antique gold tip
    ];

    // Continuously Falling Maroon Leaves
    // Pre-allocated falling leaves instanced mesh (160 leaves across viewport)
    const fallCount = isSmallScreen ? 80 : 160;
    const fallingLeafMat = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const fallingLeavesMesh = new THREE.InstancedMesh(leafGeo, fallingLeafMat, fallCount);
    fallingLeavesMesh.castShadow = !isSmallScreen;
    fallingLeavesMesh.frustumCulled = false;

    // Per-leaf dynamic simulation state
    const leafData: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      vRotX: number;
      vRotY: number;
      vRotZ: number;
      scale: number;
      phase: number;
      color: THREE.Color;
    }> = [];

    const scratchMatrix = new THREE.Matrix4();
    const scratchPos = new THREE.Vector3();
    const scratchQuat = new THREE.Quaternion();
    const scratchEuler = new THREE.Euler();
    const scratchScale = new THREE.Vector3();

    for (let i = 0; i < fallCount; i++) {
      const data = {
        x: (Math.random() - 0.5) * 18,
        y: -3.5 + Math.random() * 12,
        z: -2 + Math.random() * 8.5,
        vx: 0.005 + Math.random() * 0.012,
        vy: 0.012 + Math.random() * 0.02,
        vz: (Math.random() - 0.5) * 0.006,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.03,
        vRotY: (Math.random() - 0.5) * 0.025,
        vRotZ: (Math.random() - 0.5) * 0.03,
        scale: 0.6 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      };
      leafData.push(data);
      fallingLeavesMesh.setColorAt(i, data.color);
    }
    if (fallingLeavesMesh.instanceColor) fallingLeavesMesh.instanceColor.needsUpdate = true;
    scene.add(fallingLeavesMesh);

    // Warm atmospheric particle dust (gold sparkles)
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = isSmallScreen ? 36 : 60;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 16;
      sparklePositions[i + 1] = -2 + Math.random() * 9;
      sparklePositions[i + 2] = -1 + Math.random() * 7;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xC4A46A,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    // Scroll parallax tracker
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = window.scrollY / maxScroll;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Animation loop with exponential damping & zero GC
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Respect reduced motion: slow down motions significantly
      const motionScale = prefersReducedMotion ? 0.2 : 1.0;

      // Parallax camera gliding
      const targetCamY = 1.2 - scrollProgress * 1.8;
      const targetCamZ = 11 + scrollProgress * 0.8;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      // Update falling maroon leaves
      for (let i = 0; i < fallCount; i++) {
        const d = leafData[i];

        // Lateral flutter + fall
        const flutter = Math.sin(time * 2.2 + d.phase) * 0.014 * motionScale;
        d.y -= d.vy * motionScale;
        d.x += (d.vx + flutter) * motionScale;
        d.z += d.vz * motionScale;

        d.rotX += d.vRotX * motionScale;
        d.rotY += d.vRotY * motionScale;
        d.rotZ += d.vRotZ * motionScale;

        // Reset if leaf hits floor or drifts too far
        if (d.y < -3.8 || d.x > 10 || d.x < -10) {
          d.y = 6.8 + Math.random() * 2.5;
          d.x = (Math.random() - 0.5) * 17;
          d.z = -2 + Math.random() * 8.5;
        }

        scratchPos.set(d.x, d.y, d.z);
        scratchEuler.set(d.rotX, d.rotY, d.rotZ);
        scratchQuat.setFromEuler(scratchEuler);
        scratchScale.set(d.scale, d.scale, d.scale);

        scratchMatrix.compose(scratchPos, scratchQuat, scratchScale);
        fallingLeavesMesh.setMatrixAt(i, scratchMatrix);
      }
      fallingLeavesMesh.instanceMatrix.needsUpdate = true;

      // Gently rotate golden sparkles
      sparkles.rotation.y = time * 0.02 * motionScale;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up resources on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose geometries & materials
      groundGeo.dispose();
      groundMat.dispose();
      leafGeo.dispose();
      fallingLeafMat.dispose();
      sparkleGeo.dispose();
      sparkleMat.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${
        isInvitationOpened ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* 1. Blurred Wedding Photo Background (mainblurbg.jpg) */}
      <div className="garden-photo-layer absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/mainblurbg.jpg"
          alt="Romantic wedding flower arch background"
          className="garden-photo w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Soft luxury warm ivory and gold ambient light wash over the blurred photo */}
        <div className="garden-photo-wash absolute inset-0" />
      </div>

      {/* 2. 3D WebGL Canvas Mount (Falling Leaves & Golden Sparkles) */}
      {webglSupported ? (
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      ) : (
        /* Graceful CSS & SVG Fallback for devices without WebGL */
        <div className="absolute inset-0 w-full h-full relative overflow-hidden">
          {/* Procedural floating CSS petals */}
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl animate-float-petal"
              style={{
                left: `${(i * 13) % 96}%`,
                top: `${(i * 17) % 90}%`,
                color: i % 2 === 0 ? '#7B263A' : '#C4A46A',
                opacity: 0.55,
                animationDuration: `${12 + (i % 7)}s`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              ❦
            </span>
          ))}
        </div>
      )}

      {/* Subtle vignette border gradient that frames the invitation */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(67,18,31,0.25)]" />
    </div>
  );
};
