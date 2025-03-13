import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import { OrbitControls, useAnimations } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import * as THREE from 'three';
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function GLTFDemo() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(5, 2, 8);
  }, [camera]);
  const gl = useThree((state) => state.gl);
  const scene = useThree(state => state.scene);
  const target = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    return pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  }, [])

  useEffect(() => {
    scene.background = new THREE.Color(0xbfe3dd);
    scene.environment = target.texture;
  }, [scene]);
  return (<>
    <OrbitControls target={[0, 0.5, 0]}/>
    <Suspense>
      <Model/>
    </Suspense>
  </>)
}


function Model() {
  const { scene: model, animations } = useLoader(GLTFLoader, 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb', (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('draco/gltf/');
      loader.setDRACOLoader(dracoLoader);
    }
  )
  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);

  const { actions } = useAnimations(animations, model)

  useEffect(() => {
    const action = Object.values(actions)[0];
    action?.play()
  })
  return <primitive object={model}/>
}
