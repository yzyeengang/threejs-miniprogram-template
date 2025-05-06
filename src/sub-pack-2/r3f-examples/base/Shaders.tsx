import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import DEMO_VERTEX from "./demo.vert";
import DEMO_FRAGMENT from "./demo.frag";
import { Vector2 } from "three";


export function Shaders() {
  const scene = useThree(state=>state.scene);
  useEffect(() => {
    scene.background = new THREE.Color('#111');
  }, []);
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.setScalar(11);
  }, [camera]);
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uAmplitude: { value: new Vector2(0.1, 0.1) },
      uFrequency: { value: new Vector2(20, 5) },
    }
  }, [])

  const blobRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>>(null);
  useFrame((state, delta, frame) => {
    if (blobRef.current) {
      blobRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  })
  return (<>
    <OrbitControls/>
    <mesh ref={blobRef} position-y={4}>
      <sphereGeometry args={[2, 32, 32]}/>
      <shaderMaterial uniforms={uniforms}
                      vertexShader={DEMO_VERTEX}
                      fragmentShader={DEMO_FRAGMENT}/>
    </mesh>
    <Grid args={[10, 10]} infiniteGrid></Grid>
  </>)
}
