import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, Gltf, Text, Preload, CameraControls } from '@react-three/drei'
import { easing, geometry } from 'maath'
import { CDN_PREFIX, withCDNPrefix } from "@/constants";

extend(geometry);

export const EnterPortalsApp = ({ eventSource }) => {
  const [id, setId] = useState(null);
  return (<Canvas flat camera={{ fov: 75, position: [0, 0, 20] }} eventSource={eventSource}>
      <color attach="background" args={['#f0f0f0']}/>
      <Frame id="01" activated={id} setActive={setId} name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]}
             rotation={[0, 0.5, 0]}>
        <Gltf src={withCDNPrefix('pickles_3d_version_of_hyuna_lees_illustration-transformed_compressed.glb')}
              useDraco="draco/gltf/"
              scale={8} position={[0, -0.7, -2]}/>
      </Frame>
      <Frame id="02" activated={id} setActive={setId} name="tea" author="Omar Faruq Tawsif">
        <Gltf src={withCDNPrefix("fiesta_tea-transformed_compressed.glb")} position={[0, -2, -3]}
              useDraco="draco/gltf/"
        />
      </Frame>
      <Frame id="03" activated={id} setActive={setId} name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[1.15, 0, 0]}
             rotation={[0, -0.5, 0]}>
        <Gltf src={withCDNPrefix("still_life_based_on_heathers_artwork-transformed_compressed.glb")}
              useDraco="draco/gltf/"
              scale={2} position={[0, -0.8, -4]}/>
      </Frame>
      <Rig activated={id}/>
      <Preload all/>
    </Canvas>
  )
}

function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, activated, setActive, ...props }) {
  const portal = useRef()
  const [hovered, hover] = useState(false)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', activated === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font={withCDNPrefix('/inter_medium.woff')} fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]}
            material-toneMapped={false}>
        {name}
      </Text>
      <Text font={withCDNPrefix('/inter_regular.woff')} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text font={withCDNPrefix('/inter_regular.woff')} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text>
      <mesh name={id} onClick={(e) => (e.stopPropagation(), setActive(id === activated ? null : id))} onPointerOver={(e) => hover(true)}
            onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.1]}/>
        <MeshPortalMaterial ref={portal} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]}/>
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({
               activated,
               position = new THREE.Vector3(0, 0, 2),
               focus = new THREE.Vector3(0, 0, 0)
             }) {
  const { controls, scene } = useThree()
  useEffect(() => {
    const active = scene.getObjectByName(activated)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2}/>
}
