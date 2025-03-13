import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { BoxGeometry, Mesh, MeshNormalMaterial } from "three";

export function BaseAnimation() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
  }, [camera]);

  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.setClearColor('#82DBC5')
  }, []);

  const boxRef = useRef<Mesh<BoxGeometry, MeshNormalMaterial>>(null)
  useFrame(({ clock }) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += clock.getDelta();
      boxRef.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  })
  return (<>
    <OrbitControls/>
    <mesh ref={boxRef}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshNormalMaterial/>
    </mesh>
  </>)
}
