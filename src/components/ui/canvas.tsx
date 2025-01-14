"use client";
import { tableFeetOptions } from "@/lib/utils/static";
import { useAppContext } from "@/state/context";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { Loader, RenderIf, Spinner } from "../shared";
import { setLoadingProgress } from "@/state/reducer";
import { linearMapValue } from "@/lib/utils";

const BACKGROUND = 0xf1f1f1;
const HALF_LEG_WIDTH = 0.015;
const DEFAULT_TABLE_WIDTH = 1.2;
const DEFAULT_LEG_POSITION_X = DEFAULT_TABLE_WIDTH / 2 - HALF_LEG_WIDTH;
const DEFAULT_LEG_POSITION_Y = -0.5;
const DEFAULT_TABLE_HEIGHT_SCALE = 1;

const DEFAULT_FEET_POSITIONS = [
  { x: DEFAULT_LEG_POSITION_X, y: DEFAULT_LEG_POSITION_Y, z: -0.13 },
  { x: DEFAULT_LEG_POSITION_X, y: DEFAULT_LEG_POSITION_Y, z: 0.13 },
  { x: -DEFAULT_LEG_POSITION_X, y: DEFAULT_LEG_POSITION_Y, z: 0.13 },
  { x: -DEFAULT_LEG_POSITION_X, y: DEFAULT_LEG_POSITION_Y, z: -0.13 },
];

const DEFAULT_TABLE_LEG_POSITIONS = [
  {
    x: DEFAULT_LEG_POSITION_X,
    y: DEFAULT_LEG_POSITION_Y,
    z: 0,
    rotation: -Math.PI / 2,
  },
  {
    x: -DEFAULT_LEG_POSITION_X,
    y: DEFAULT_LEG_POSITION_Y,
    z: 0,
    rotation: Math.PI / 2,
  },
];

export function Canvas() {
  const { state, dispatch } = useAppContext();

  const [textureLoading, setTextureLoading] = useState(false);
  const loadedTextures = useRef<Map<string, THREE.Material>>(new Map()).current;

  const refContainer = useRef<HTMLDivElement | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const tableTopRef = useRef<THREE.Mesh | null>(null);
  const tableLegsRef = useRef<THREE.Object3D[]>([]).current;

  const tableFeet1Ref = useRef<THREE.Object3D[]>([]).current;
  const tableFeet2Ref = useRef<THREE.Object3D[]>([]).current;

  const widthRatio = state.width / state.defaultWidth;
  const depthRatio = state.depth / state.defaultDepth;
  const heightRatio = state.height / state.defaultHeight;

  function getContainerSize() {
    const height = refContainer?.current?.getBoundingClientRect().height || 0;
    const width = refContainer?.current?.getBoundingClientRect().width || 0;

    return {
      width,
      height,
    };
  }

  useEffect(() => {
    // Initialize Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const { height, width } = getContainerSize();

    scene.background = new THREE.Color(BACKGROUND);
    scene.fog = new THREE.Fog(BACKGROUND, 20, 100);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    refContainer.current?.appendChild(renderer.domElement);

    cameraRef.current = camera;
    rendererRef.current = renderer;

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 1;
    controls.minPolarAngle = Math.PI / 12;
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.enableDamping = true;
    controls.enablePan = !false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.2;

    camera.position.z = 3.5;
    camera.position.y = 0.3;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Key Light: Acts as the main source of light (like sunlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(0, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    // Fill Light: Softer light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 5, 5);
    fillLight.castShadow = false;
    scene.add(fillLight);

    // Back Light: Adds separation between the furniture and the background
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 5, -5);
    backLight.castShadow = false;
    scene.add(backLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 5);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0, 0, -5);
    scene.add(directionalLight, directionalLight2);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f1f1,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = DEFAULT_LEG_POSITION_Y - 0.005;

    // Tabletop
    const tableTopGeometry = new THREE.BoxGeometry(
      DEFAULT_TABLE_WIDTH,
      0.03,
      0.3
    );
    const tableTopMaterial = new THREE.MeshStandardMaterial({});

    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);

    tableTop.position.set(0, linearMapValue(heightRatio), 0);
    tableTop.castShadow = true;
    tableTopRef.current = tableTop;

    const loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      dispatch(setLoadingProgress((itemsLoaded / itemsTotal) * 100));
    };

    loadingManager.onLoad = function () {
      scene.add(floor, tableTop);
    };

    const feetPositionY = linearMapValue(heightRatio, 1, 2.4, -0.5, -0.487);
    const loader = new GLTFLoader(loadingManager);
    // LOAD TABLE LEGS
    loader.load(
      "/models/leg.glb",
      (gltf) => {
        const tableLeg = gltf.scene;

        tableLeg.traverse((o: any) => {
          if (o?.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        DEFAULT_TABLE_LEG_POSITIONS.forEach((pos) => {
          const legClone = tableLeg.clone();
          legClone.position.set(pos.x * widthRatio, pos.y, pos.z);
          legClone.rotation.y = pos.rotation;
          tableLeg.scale.lerp(
            new THREE.Vector3(1 * depthRatio, 1 * heightRatio, 1),
            1
          );
          tableLegsRef.push(legClone);
          scene.add(legClone);
        });
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // LOAD FEET 1
    loader.load(
      "/models/prop_01.glb",
      (gltf) => {
        const feet1 = gltf.scene;
        feet1.traverse((o: any) => {
          if (o?.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        feet1.visible = state.feet.value === tableFeetOptions[0].value;

        DEFAULT_FEET_POSITIONS.forEach((pos) => {
          const footClone = feet1.clone();
          footClone.position.set(
            pos.x * widthRatio,
            feetPositionY,
            pos.z * depthRatio
          );
          tableFeet1Ref.push(footClone);
          scene.add(footClone);
        });
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // LOAD FEET 2
    loader.load(
      "/models/prop_02.glb",
      (gltf) => {
        const feet2 = gltf.scene;
        feet2.traverse((o: any) => {
          if (o?.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });

        feet2.visible = state.feet.value === tableFeetOptions[1].value;

        DEFAULT_FEET_POSITIONS.forEach((pos) => {
          const footClone = feet2.clone();
          footClone.position.set(
            pos.x * widthRatio,
            feetPositionY,
            pos.z * depthRatio
          );
          tableFeet2Ref.push(footClone);
          scene.add(footClone);
        });
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // LOAD FIRST MATERIAL
    loader.load(state.tableTop.material, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && tableTopRef?.current) {
          loadedTextures.set(state.tableTop.material, child.material);
          tableTopRef.current.material = child.material;
        }
      });
    });

    function animate() {
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(animate);
    }

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current) {
        const { height, width } = getContainerSize();

        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
      refContainer.current?.removeChild(renderer.domElement);
    };
  }, []);

  // TABLE SIZE CHANGE
  useEffect(() => {
    tableTopRef.current?.scale.lerp(
      new THREE.Vector3(1 * widthRatio, 1, 1 * depthRatio),
      1
    );

    tableTopRef.current?.position.set(0, linearMapValue(heightRatio), 0);

    tableFeet1Ref.forEach((foot, index) => {
      foot.position.lerp(
        new THREE.Vector3(
          DEFAULT_FEET_POSITIONS[index]?.x * widthRatio,
          foot.position.y,
          DEFAULT_FEET_POSITIONS[index]?.z * depthRatio
        ),
        1
      );
    });

    tableFeet2Ref.forEach((foot, index) => {
      foot.position.lerp(
        new THREE.Vector3(
          DEFAULT_FEET_POSITIONS[index]?.x * widthRatio,
          foot.position.y,
          DEFAULT_FEET_POSITIONS[index]?.z * depthRatio
        ),
        1
      );
    });

    tableLegsRef.forEach((leg, index) => {
      leg.position.lerp(
        new THREE.Vector3(
          DEFAULT_TABLE_LEG_POSITIONS[index]?.x * widthRatio,
          leg.position.y,
          leg.position.z
        ),
        1
      );
      leg.scale.lerp(
        new THREE.Vector3(
          1 * depthRatio,
          DEFAULT_TABLE_HEIGHT_SCALE * heightRatio,
          leg.scale.z
        ),
        1
      );
    });
  }, [widthRatio, depthRatio, heightRatio]);

  // FEET VARIANT CHANGE
  useEffect(() => {
    const newPositionY = linearMapValue(heightRatio, 1, 2.4, -0.5, -0.487);
    tableFeet1Ref.forEach((foot) => {
      foot.visible = state.feet.value === tableFeetOptions[0].value;
      foot.position.setY(newPositionY);
    });
    tableFeet2Ref.forEach((foot) => {
      foot.visible = state.feet.value === tableFeetOptions[1].value;
      foot.position.setY(newPositionY);
    });
  }, [state.feet.value, heightRatio]);

  // MATERIAL CHANGE
  useEffect(() => {
    if (!tableTopRef.current) return;

    if (loadedTextures.has(state.tableTop.material)) {
      tableTopRef.current.material = loadedTextures.get(
        state.tableTop.material
      ) as THREE.Material;
      return;
    }

    setTextureLoading(true);
    const loader = new GLTFLoader();
    loader.load(state.tableTop.material, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && tableTopRef?.current) {
          // Save the texture GLB into the loaded textures map
          loadedTextures.set(state.tableTop.material, child.material);
          tableTopRef.current.material = child.material;
        }
      });
      setTextureLoading(false);
    });
  }, [state.tableTop.material]);

  return (
    <div className="app_canvas_container" ref={refContainer}>
      <Loader />
      <RenderIf condition={textureLoading}>
        <div className="app_canvas_container__spinner">
          <Spinner />
        </div>
      </RenderIf>
    </div>
  );
}
