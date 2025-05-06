import { extend, type ThreeElement, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect } from 'react';

extend({
  OrbitControls
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: ThreeElement<typeof OrbitControls>;
  }
}

export function YourFirstScene() {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (camera) {
      camera.position.setScalar(3);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  return (
    <>
      <mesh>
        <torusGeometry args={[1, 0.5, 16, 32]} />
        <meshBasicMaterial color="orange" />
      </mesh>
      <ambientLight intensity={1} />
      <orbitControls args={[camera, gl.domElement]}></orbitControls>
    </>
  );
}
