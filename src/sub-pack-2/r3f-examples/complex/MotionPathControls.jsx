import * as THREE from 'three';
import { useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Clouds,
  Cloud,
  MotionPathControls,
  useMotion,
  useTexture,
  OrbitControls,
  MeshWobbleMaterial,
  Gltf,
  Float,
  Environment
} from '@react-three/drei';
import { EffectComposer, TiltShift2, HueSaturation, DotScreen } from '@react-three/postprocessing';
import { DecoderPath } from '@/constants';

export function MotionPathControlsApp({ eventSource }) {
  const poi = useRef();
  const motionRef = useRef();
  const { float, attachCamera, debug } = {
    attachCamera: true,
    debug: false,
    float: true
  };
  return (
    <Canvas camera={{ position: [10, 15, -10], fov: 45 }} eventSource={eventSource}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {!attachCamera && <OrbitControls />}
      <MotionPathControls
        object={attachCamera ? null : motionRef}
        focus={poi}
        debug={debug}
        damping={0.2}
        focusDamping={0.15}
      >
        <Circle />
        <Loop />
      </MotionPathControls>
      <Gltf
        useDraco={DecoderPath.GLTF}
        visible={!attachCamera}
        src="/sony_cinema_camera-transformed.glb"
        scale={0.03}
        ref={motionRef}
      />
      <Float floatIntensity={20} rotationIntensity={25} speed={float ? 4 : 0}>
        <Sticker position={[1, 0, 1]} scale={2} ref={poi} />
      </Float>
      <Environment preset="city" background blur={0.5} />
      <Clouds>
        <Cloud
          concentrate="outside"
          seed={1}
          segments={100}
          bounds={20}
          volume={20}
          growth={10}
          opacity={0.15}
          position={[0, 0, -10]}
          speed={1}
        />
      </Clouds>
      <EffectComposer disableNormalPass multisampling={4}>
        <HueSaturation saturation={-1} />
        <TiltShift2 blur={0.5} />
        <DotScreen scale={2} />
      </EffectComposer>
    </Canvas>
  );
}

function Loop({ factor = 0.2 }) {
  const motion = useMotion();
  useFrame((state, delta) => (motion.current += Math.min(0.1, delta) * factor));
}

const Sticker = forwardRef(({ url, ...props }, ref) => {
  const [smiley, invert] = useTexture([
    'Sticjer_1024x1024@2x.png',
    'Sticjer_1024x1024@2x_invert.png'
  ]);
  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshWobbleMaterial
        factor={4}
        speed={2}
        depthTest={false}
        transparent
        map={smiley}
        map-flipY={false}
        roughness={1}
        roughnessMap={invert}
        roughnessMap-flipY={false}
        map-anisotropy={16}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

export const Heart = () => {
  // Define the control points for the first curve
  const controlPoints1 = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 3, 0),
    new THREE.Vector3(0, 2, 0)
  ].map((point) => point.multiplyScalar(2));
  const controlPoints2 = controlPoints1.map(
    (point) => new THREE.Vector3(-point.x, point.y, point.z)
  );
  return [controlPoints1, controlPoints2].map(([v0, v1, v2, v3], index) => (
    <cubicBezierCurve3 key={index} v0={v0} v1={v1} v2={v2} v3={v3} />
  ));
};

export const Circle = ({ centerX = 0, centerY = 0, radius = 5 }) => {
  return [
    [
      new THREE.Vector3(centerX + radius, centerY, 0),
      new THREE.Vector3(centerX + radius, centerY, radius),
      new THREE.Vector3(centerX - radius, centerY, radius),
      new THREE.Vector3(centerX - radius, centerY, 0)
    ],
    [
      new THREE.Vector3(centerX - radius, centerY, 0),
      new THREE.Vector3(centerX - radius, centerY, -radius),
      new THREE.Vector3(centerX + radius, centerY, -radius),
      new THREE.Vector3(centerX + radius, centerY, 0)
    ]
  ].map(([v0, v1, v2, v3], index) => (
    <cubicBezierCurve3 key={index} v0={v0} v1={v1} v2={v2} v3={v3} />
  ));
};

export const Rollercoaster = () => {
  return [
    [
      new THREE.Vector3(-5, -5, 0),
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(6, 3, 0)
    ],
    [
      new THREE.Vector3(6, 3, 0),
      new THREE.Vector3(10, 5, 5),
      new THREE.Vector3(5, 3, 5),
      new THREE.Vector3(5, 5, 5)
    ]
  ].map(([v0, v1, v2, v3], index) => (
    <cubicBezierCurve3 key={index} v0={v0} v1={v1} v2={v2} v3={v3} />
  ));
};

export const Infinity = () => {
  const curves = [];
  // Define the center and radius of the circle
  const centerX = 0;
  const centerY = 0;
  const radius = 5;

  // Define the number of segments and the amplitude of the sine wave
  const segments = 8;
  const amplitude = 5;

  // Create each segment
  for (let i = 0; i < segments; i++) {
    // Calculate the start and end angles
    const startAngle = (i / segments) * Math.PI * 2;
    const endAngle = ((i + 1) / segments) * Math.PI * 2;

    // Calculate the start and end points
    const startPoint = new THREE.Vector3(
      centerX + radius * Math.cos(startAngle),
      centerY + amplitude * Math.sin(2 * startAngle),
      radius * Math.sin(startAngle)
    );
    const endPoint = new THREE.Vector3(
      centerX + radius * Math.cos(endAngle),
      centerY + amplitude * Math.sin(2 * endAngle),
      radius * Math.sin(endAngle)
    );

    // Calculate the control points
    const controlPoint1 = new THREE.Vector3(
      centerX + radius * Math.cos(startAngle + Math.PI / (2 * segments)),
      centerY + amplitude * Math.sin(2 * (startAngle + Math.PI / (2 * segments))),
      radius * Math.sin(startAngle + Math.PI / (2 * segments))
    );
    const controlPoint2 = new THREE.Vector3(
      centerX + radius * Math.cos(endAngle - Math.PI / (2 * segments)),
      centerY + amplitude * Math.sin(2 * (endAngle - Math.PI / (2 * segments))),
      radius * Math.sin(endAngle - Math.PI / (2 * segments))
    );

    curves.push([startPoint, controlPoint1, controlPoint2, endPoint]);
  }

  return curves.map(([v0, v1, v2, v3], index) => (
    <cubicBezierCurve3 key={index} v0={v0} v1={v1} v2={v2} v3={v3} />
  ));
};
