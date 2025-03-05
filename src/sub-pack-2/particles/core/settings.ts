import * as THREE from 'three';
const amountMap = {
  '4k': [64, 64, 0.29],
  '8k': [128, 64, 0.42],
  '16k': [128, 128, 0.48],
  '32k': [256, 128, 0.55],
  '65k': [256, 256, 0.6],
  '131k': [512, 256, 0.85],
  '252k': [512, 512, 1.2],
  '524k': [1024, 512, 1.4],
  '1m': [1024, 1024, 1.6],
  '2m': [2048, 1024, 2],
  '4m': [2048, 2048, 2.5]
};

const motionBlurQualityMap = {
  best: 1,
  high: 0.5,
  medium: 1 / 3,
  low: 0.25
};
const query = {
  motionBlurQuality: 'medium',
  amount: '131k' as keyof typeof amountMap
};

const amountInfo = amountMap[query.amount];

export const ray = new THREE.Ray();

export const settings = {
  query,
  useStats: true,
  isMobile: true,
  amountList: Object.keys(amountMap),
  simulatorTextureWidth: amountInfo[0],
  simulatorTextureHeight: amountInfo[1],
  useTriangleParticles: true,
  followMouse: true,
  speed: 1,
  dieSpeed: 0.015,
  radius: amountInfo[2] / 2,
  curlSize: 0.02,
  attraction: 1.1,
  shadowDarkness: 0,
  bgColor: '#343434',
  color1: '#ffffff',
  color2: '#ffffff',
  fxaa: false,
  motionBlurQualityMap,
  motionBlurQualityList: Object.keys(motionBlurQualityMap),

  motionBlur: true,
  motionBlurPause: false,
  bloom: true,

  mouse: new THREE.Vector2(0, 0),
  mouse3d: ray.origin,
  camera: null as unknown as THREE.Camera,
  cameraPosition: null as unknown as THREE.Vector3
};
