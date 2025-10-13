

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const InteractiveShapes = () => {
  const [isClient, setIsClient] = useState(false); // Ensure client-side rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Geometries, materials, and sound effects
  const geometries = [
    { position: [0, 0, 0], r: 0.3, geometry: new THREE.IcosahedronGeometry(3) },
    { position: [1, -0.75, 4], r: 0.4, geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16) },
    { position: [-4.4, 2, -4], r: 0.6, geometry: new THREE.DodecahedronGeometry(1.5) },
    { position: [-1.2, -0.75, 5], r: 0.5, geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32) },
    { position: [3.6, 1.6, -4], r: 0.7, geometry: new THREE.OctahedronGeometry(1.5) },
  ];

  
  const [soundEffects, setSoundEffects] = useState<HTMLAudioElement[]>([]); // Initialize soundEffects

  useEffect(() => {
    // Only run on client-side
    setIsClient(true);
    setSoundEffects([
      new Audio("/sounds/hit2.ogg"),
      new Audio("/sounds/hit3.ogg"),
      new Audio("/sounds/hit4.ogg"),
    ]);
  }, []);


  const materials = [
    new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.5,
      color: 0x2980b9,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.1,
      metalness: 0.5,
    }),
  ];

  useEffect(() => {
    setIsClient(true);

    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000); // Adjusted aspect ratio
    camera.position.set(0, 0, 10); // Adjusted for better view of all shapes

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true }); // Enable transparency
    renderer.setSize(window.innerWidth / 2, window.innerHeight); // Half the screen width
    renderer.shadowMap.enabled = true;

    // Light setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Softer ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Bright directional light
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Create shapes array
    const shapes: THREE.Mesh[] = [];

    geometries.forEach((shapeData, index) => {
      const { position, geometry } = shapeData;
      const material = materials[index % materials.length];
      
      // Create the mesh (shape)
      const mesh = new THREE.Mesh(geometry, material);
    
      // Store a unique ID in the userData property
      mesh.userData.id = `shape-${index}`; // `shape-0`, `shape-1`, etc.
    
      // Initially set the shape to be invisible
      mesh.material.opacity = 0;
      mesh.material.transparent = true;
    
      // Set a random starting position for the animation
      const randomX = Math.random() * window.innerWidth - window.innerWidth / 2;
      const randomY = Math.random() * window.innerHeight - window.innerHeight / 2;
      const randomZ = Math.random() * 10 - 5; // Random depth for 3D effect
      mesh.position.set(randomX, randomY, randomZ); 
    
      // Add the mesh to the scene
      scene.add(mesh);
      shapes.push(mesh);
    
      // Add random rotation
      gsap.to(mesh.rotation, {
        x: "+=6.283", y: "+=6.283", z: "+=6.283", duration: 10, repeat: -1, yoyo: true, ease: "none"
      });
    
      // Animate shape from the random position to the final position
      gsap.fromTo(mesh.position, {
        x: 0,
        y: 1,
        z: 1,
        opacity:1,
        duration: 2,  // Duration for the animation
        ease: "power2.out",  // Ease out for smooth transition
        onComplete: () => {
          // Set opacity to 1 after the animation completes, making the shape visible
          mesh.material.opacity = 1;
        }
      } , {
        x:position[0],
        y:position[1],
        z:position[2],
      });
    });
    
    

    // Add click interaction for changing color of specific shapes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObjects(shapes);
      intersects.forEach((intersect) => {
        const shape = intersect.object as THREE.Mesh;
        const sound = soundEffects[Math.floor(Math.random() * soundEffects.length)];

        // Change color only if it's a circle (IcosahedronGeometry)
        if (shape.geometry instanceof THREE.IcosahedronGeometry) {
          const newMaterial = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff, // Random color
            roughness: 0.5,
          });
          shape.material = newMaterial;
        }

        // Vibrate the shape
        gsap.to(shape.position, {
          x: `+=0.1`,
          y: `+=0.1`,
          z: `+=0.1`,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut"
        });

        // Play the sound effect
        sound.play();
      });
    };

    window.addEventListener('click', onMouseClick);

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / 2 / window.innerHeight; // Keep canvas on right half
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Animate scene
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return( <div className=''><canvas  ref={canvasRef}></canvas></div>)
};

export default InteractiveShapes;


