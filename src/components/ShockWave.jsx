import React, { useEffect, useRef, useState } from 'react';

const ShockwaveScene = () => {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let animationId;
    let scene, camera, renderer, composer, controls;
    let shockwavePass, bloomPass;
    let rotatingGroup;
    let shockwaveActive = false;
    let shockwaveStartTime = 0;
    const shockwaveDuration = 10;

    const initScene = async () => {
      // Dynamic imports for Three.js
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass');
      const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass');

      if (!mounted || !canvasRef.current) return;

      // Get container dimensions
      const container = canvasRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // Transparent background

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 5;

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Light
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);

      // Rotating group
      rotatingGroup = new THREE.Group();
      scene.add(rotatingGroup);

      // Stars
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 1000;
      const starsPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starsPositions[i] = (Math.random() - 0.5) * 200;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 0.1,
        sizeAttenuation: true
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Inner mesh
      const innerGeometry = new THREE.IcosahedronGeometry(1, 1);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 1,
        flatShading: true,
        transparent: true,
        opacity: 0.7
      });
      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      rotatingGroup.add(innerMesh);

      // Wireframe mesh
      const outerGeometry = new THREE.IcosahedronGeometry(1.15, 1);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      const wireframeMesh = new THREE.Mesh(outerGeometry, wireframeMaterial);
      rotatingGroup.add(wireframeMesh);

      // Particles
      const positions = [];
      const posAttr = outerGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 0.025
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      rotatingGroup.add(particles);

      // Composer setup
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      // Bloom pass
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        1.5,
        0.4,
        0.05
      );
      composer.addPass(bloomPass);

      // Shockwave shader
      const ShockwaveShader = {
        uniforms: {
          tDiffuse: { value: null },
          center: { value: new THREE.Vector2(0.5, 0.5) },
          time: { value: 0.0 },
          maxRadius: { value: 1.0 },
          amplitude: { value: 0.1 },
          speed: { value: 0.3 },
          width: { value: 0.3 },
          aspect: { value: width / height },
          smoothing: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          #define PI 3.14159265359
          uniform sampler2D tDiffuse;
          uniform vec2 center;
          uniform float time;
          uniform float maxRadius;
          uniform float amplitude;
          uniform float speed;
          uniform float width;
          uniform float aspect;
          uniform float smoothing;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            vec2 aspectUV = vec2((uv.x - center.x) * aspect, uv.y - center.y);
            float dist = length(aspectUV);
            float wave = 0.0;
            float t = mod(time * speed, maxRadius + width);
            if (dist < t && dist > t - width) {
              float edgeDist = abs(dist - (t - width / 2.0)) / (width / 2.0);
              float smoothFactor = smoothstep(1.0 - smoothing, 1.0, edgeDist);
              wave = amplitude * sin((dist - t + width) / width * PI * 2.0) * (1.0 - smoothFactor);
            }
            uv += normalize(aspectUV) * wave;
            gl_FragColor = texture2D(tDiffuse, uv);
          }
        `
      };

      shockwavePass = new ShaderPass(ShockwaveShader);
      shockwavePass.renderToScreen = true;
      composer.addPass(shockwavePass);

      // Event listeners
      const handleDoubleClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        shockwavePass.uniforms.center.value.set((mouseX + 1) / 2, (mouseY + 1) / 2);
        shockwaveActive = true;
        shockwaveStartTime = performance.now() / 1000;
        shockwavePass.uniforms.time.value = 0.0;
      };

      const handleResize = () => {
        if (!camera || !renderer || !composer || !canvasRef.current) return;
        const container = canvasRef.current.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
        bloomPass.setSize(width, height);
        shockwavePass.uniforms.aspect.value = width / height;
      };

      window.addEventListener('dblclick', handleDoubleClick);
      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        if (!mounted) return;
        animationId = requestAnimationFrame(animate);
        
        if (controls) controls.update();
        
        if (rotatingGroup) {
          rotatingGroup.rotation.x += 0.002;
          rotatingGroup.rotation.y += 0.003;
        }

        if (shockwaveActive && shockwavePass) {
          const elapsedTime = performance.now() / 1000 - shockwaveStartTime;
          if (elapsedTime < shockwaveDuration) {
            shockwavePass.uniforms.time.value = elapsedTime;
          } else {
            shockwaveActive = false;
            shockwavePass.uniforms.time.value = 0.0;
          }
        }
        
        if (composer) composer.render();
      };

      animate();

      sceneRef.current = {
        cleanup: () => {
          window.removeEventListener('dblclick', handleDoubleClick);
          window.removeEventListener('resize', handleResize);
          if (animationId) cancelAnimationFrame(animationId);
          if (renderer) renderer.dispose();
          if (composer) composer.dispose();
        }
      };
    };

    initScene();

    return () => {
      mounted = false;
      if (sceneRef.current?.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex overflow-hidden relative justify-center items-center w-full h-full bg-transparent select-none">
      <canvas ref={canvasRef} className="block" />
      
      <div className="absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20">
        <h3 className="text-sm font-medium text-white">
          Interactive 3D Experience
        </h3>
        <p className="text-xs text-white/80">
          Built with Three.js • Double-click to interact
        </p>
      </div>
      
      <div className="absolute right-4 bottom-4 px-4 py-2 rounded-lg backdrop-blur-sm bg-black/20">
        <p className="text-xs text-white/80">
          Available for your portfolio
        </p>
      </div>
    </div>
  );
};

export default ShockwaveScene;