import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber/dist/declarations/src/core/events';

export function BaseEvent() {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.setClearColor('#201919');
  }, []);
  const camera = useThree((state) => state.camera as THREE.PerspectiveCamera);
  useEffect(() => {
    camera.position.setScalar(11);
    camera.fov = 45;
    camera.near = 0.1;
    camera.far = 1000;
    camera.lookAt(-8, 3, -3);
  }, [camera]);

  const onClick = useCallback((ev: ThreeEvent<MouseEvent>) => {
    (ev.object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshToonMaterial>).material.color.set(
      '#008080'
    );
  }, []);
  const onPointerEnter = useCallback((ev: ThreeEvent<MouseEvent>) => {
    (ev.object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshToonMaterial>).material.color.set(
      '#DFFF45'
    );
  }, []);
  const onPointerLeave = useCallback((ev: ThreeEvent<MouseEvent>) => {
    (ev.object as THREE.Mesh<THREE.BoxGeometry, THREE.MeshToonMaterial>).material.color.set(
      '#efefef'
    );
  }, []);

  return (
    <>
      <OrbitControls makeDefault />
      <directionalLight intensity={0.2} castShadow={true} position={[0, 8, 4]} />
      <ambientLight intensity={1}></ambientLight>
      {[-2.5, 0, 2.5].map((x) => {
        return [-2.5, 0, 2.5].map((y) => {
          return [-2.5, 0, 2.5].map((z) => {
            return (
              <mesh
                key={`${x}-${y}-${z}`}
                position={[x, y, z]}
                receiveShadow={true}
                {...{
                  onClick,
                  onPointerEnter,
                  onPointerLeave
                }}
              >
                <boxGeometry></boxGeometry>
                <meshToonMaterial color="#efefef" />
              </mesh>
            );
          });
        });
      })}
    </>
  );
}
