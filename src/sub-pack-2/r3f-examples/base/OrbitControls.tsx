import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls, Text3D, Grid, Center } from "@react-three/drei";
import React from "react";

export function OrbitControlsDemo() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(4, 3, 9)
  }, [camera]);
  return (<>
    <OrbitControls makeDefault></OrbitControls>
    <React.Suspense>
      <Center position={[0, 1, 0]}>
        <Text3D font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json">
          Hello three.js
        </Text3D>
      </Center>
    </React.Suspense>
    <Grid args={[10, 10]}/>
    <directionalLight position={[0, 2, 4]} intensity={1.2} castShadow></directionalLight>
  </>)
}
