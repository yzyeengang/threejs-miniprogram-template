import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { cdn } from '@/constants';

export function BaseTexture() {
  const camera = useThree((state) => state.camera as THREE.PerspectiveCamera);
  useEffect(() => {
    camera.position.set(1, 2, 5);
  }, [camera]);
  return (
    <>
      <OrbitControls />
      <directionalLight position={[0, 2, 4]} intensity={2} castShadow />
      <Suspense>
        <TexturedBall />
      </Suspense>
    </>
  );
}

const getPath = (path: string) => `${cdn.R3F_ASSETS}textures/${path}`;

export function TexturedBall() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const pbrTexture = useTexture({
    map: getPath('Ice002_1K-JPG_Color.jpg'),
    displacementMap: getPath('Ice002_1K-JPG_Displacement.jpg'),
    roughnessMap: getPath('Ice002_1K-JPG_Roughness.jpg'),
    normalMap: getPath('Ice002_1K-JPG_NormalGL.jpg')
    // ambientOcclusion:
    //   'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_AmbientOcclusion.jpg',
  });
  useFrame((state, delta, frame) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta;
    }
  });
  return (
    <>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 100, 100]} />
        <meshStandardMaterial displacementScale={0.2} {...pbrTexture} />
      </mesh>
    </>
  );
}
