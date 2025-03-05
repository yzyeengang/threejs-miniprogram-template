<template>
    <view class="scene-background">
        <PlatformCanvas
                type="webgl2"
                canvas-id="in-spirit-canvas"
                @useCanvas="useCanvas"
        >
        </PlatformCanvas>
        <view class="fps-tips" v-if="enableFPS"> FPS:{{ fps }}</view>
    </view>
</template>
<script setup lang="ts">
//demo from: https://github.com/edankwan/The-Spirit
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings, ray as _ray } from './core/settings.js';
import { Lights } from './3d/Lights.js';
import { Floor } from './3d/Floor.js';
import * as ease from './utils/ease.js';
import { Simulator } from './3d/Simulator.js';
import { Particles } from './3d/Particles.js';
import { effectScope, watchEffect, ref, reactive } from 'vue';
import { adapter, type UseCanvasResult } from '@minisheep/three-platform-adapter';
import PlatformCanvas from "@/components/PlatformCanvas.vue";

const props = reactive({
  play: true,
})


const scope = effectScope();
const fps = ref('0');
const enableFPS = ref(false);

const isIOS = wx.getDeviceInfo().platform === 'ios';


function useCanvas({ canvas, useFrame, eventHandler }: UseCanvasResult){
  const CANVAS_WIDTH = canvas.width;
  const CANVAS_HEIGHT = canvas.height;


  const _bgColor = new THREE.Color(settings.bgColor);
  settings.mouse = new THREE.Vector2(0, 0);
  settings.mouse3d = _ray.origin;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  const supportedFloatType = renderer.extensions.get('EXT_color_buffer_float');
  enableFPS.value = !!supportedFloatType;

  renderer.setClearColor(settings.bgColor);
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(settings.bgColor, 0.001);

  const camera = new THREE.PerspectiveCamera(
    45,
    CANVAS_WIDTH / CANVAS_HEIGHT,
    10,
    3000
  );
  camera.position.set(300, 60, 300).normalize().multiplyScalar(1500);
  settings.camera = camera;
  settings.cameraPosition = camera.position;

  const lights = new Lights();
  scene.add(lights);

  const floor = new Floor();
  scene.add(floor);

  let simulator: Simulator, particles: Particles;
  if (supportedFloatType) {
    simulator = new Simulator(renderer);
    particles = new Particles(renderer);
    scene.add(particles);
  }

  const control = new OrbitControls(camera, renderer.domElement);
  control.target.y = 50;
  control.maxDistance = 1000;
  control.minPolarAngle = 0.3;
  control.maxPolarAngle = Math.PI / 2 - 0.1;
  // control.enablePan = false;
  // control.enabled = false;
  control.update();

  let initAnimation = 0;

  const colorCycle = 3;

  let frames = 0;
  let prevUpdate = Date.now();

  function render(dt: number) {
    const deltaTime = Date.now() - prevUpdate;
    frames++;
    if (deltaTime > 1000) {
      fps.value = (frames / (deltaTime / 1000)).toFixed(1);
      frames = 0;
      prevUpdate = Date.now();
    }

    const targetColor = getRainbowColor(Math.floor((Date.now() / (10 * colorCycle)) % 100));
    settings.color2 = targetColor;

    _bgColor.setStyle(settings.bgColor);
    const tmpColor = (floor.material as THREE.MeshStandardMaterial).color;
    tmpColor.lerp(_bgColor, 0.05);
    scene.fog!.color.copy(tmpColor);
    renderer.setClearColor(tmpColor);

    initAnimation = Math.min(initAnimation + dt * 0.00025, 1);
    supportedFloatType && (simulator.initAnimation = initAnimation);

    control.maxDistance =
      initAnimation === 1
        ? 1000
        : THREE.MathUtils.lerp(1000, 450, ease.basic.Cubic.Out(initAnimation));
    control.update();

    // update mouse3d
    camera.updateMatrixWorld();
    _ray.origin.setFromMatrixPosition(camera.matrixWorld);
    _ray.direction
      .set(settings.mouse.x, settings.mouse.y, 0.5)
      .unproject(camera)
      .sub(_ray.origin)
      .normalize();
    const distance =
      _ray.origin.length() / Math.cos(Math.PI - _ray.direction.angleTo(_ray.origin));
    _ray.origin.add(_ray.direction.multiplyScalar(distance));

    if (supportedFloatType) {
      simulator.update(dt);
      particles.update(dt, simulator);
    }

    // fxaa.enabled = !!settings.fxaa;
    // motionBlur.enabled = !!settings.motionBlur;
    // bloom.enabled = !!settings.bloom;

    // postprocessing.render(dt, newTime);
    renderer.render(scene, camera);
    lights.update(renderer);
  }

  function onResize() {
    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT, false);

    // postprocessing.resize(_width, _height);
  }

  function onMouseMove(evt: MouseEvent) {
    settings.mouse.x = (evt.pageX / CANVAS_WIDTH) * 2 - 1;
    settings.mouse.y = -(evt.pageY / CANVAS_HEIGHT) * 2 + 1;
  }

  canvas.addEventListener('resize', onResize);
  canvas.addEventListener('click', onMouseMove);

  // #ifdef MP-WEIXIN
  let firstMotion: [number, number] | undefined;
  const throttle = 40;
  //ios 返回数据方向相反
  const globalScale = isIOS ? -1 : 1;
  wx.onDeviceMotionChange((data) => {
    if (!firstMotion) {
      firstMotion = [data.beta, data.gamma];
    } else {
      const deltaY = (data.beta - firstMotion[0]) / throttle;
      const deltaX = ((data.gamma - firstMotion[1]) * -1) / throttle;
      settings.mouse.x = globalScale * Math.min(0.9, Math.max(-0.9, deltaX));
      settings.mouse.y = globalScale * Math.min(0.9, Math.max(-0.9, deltaY));
    }
  });
  // #endif
  // #ifndef MP-WEIXIN
  settings.followMouse = false;
  // #endif

  scope.run(() => {
    watchEffect((onCleanup) => {
      if (props.play) {
        const { cancel } = useFrame((delta) => {
          render(delta);
        });
        // #ifdef MP-WEIXIN
        wx.startDeviceMotionListening({
          interval: 'game',
          success() {
            firstMotion = undefined;
          },
          fail() {
            settings.followMouse = false;
          }
        });
        // #endif
        onCleanup(() => {
          // #ifdef MP-WEIXIN
          wx.stopDeviceMotionListening({
            success() {
            },
            fail() {
            }
          });
          // #endif
          cancel();
        });
      }
    });
  });


}



// function onKeyUp(evt) {
//   if (evt.keyCode === 32) {
//     settings.speed = settings.speed === 0 ? 1 : 0;
//     settings.dieSpeed = settings.dieSpeed === 0 ? 0.015 : 0;
//   }
// }

function getRainbowColor(percentage: number) {
  // 确保阈值在 0 到 100 之间
  percentage = Math.max(0, Math.min(100, percentage));

  // 将阈值映射到 [0, 1] 范围
  const t = percentage / 100;

  // 彩虹颜色的 RGB 值
  const colors = [
    { r: 255, g: 0, b: 0 }, // 红色
    { r: 255, g: 127, b: 0 }, // 橙色
    { r: 255, g: 255, b: 0 }, // 黄色
    { r: 0, g: 255, b: 0 }, // 绿色
    { r: 0, g: 255, b: 255 }, // 青色
    { r: 0, g: 0, b: 255 }, // 蓝色
    { r: 148, g: 0, b: 211 } // 紫色
  ];

  // 计算每一段颜色的过渡
  const segmentCount = colors.length - 1;
  const segment = t * segmentCount;
  const segmentIndex = Math.floor(segment);
  const nextSegmentIndex = Math.min(segmentIndex + 1, segmentCount);

  const startColor = colors[segmentIndex];
  const endColor = colors[nextSegmentIndex];

  const blendFactor = segment - segmentIndex;

  const r = Math.round(startColor.r + blendFactor * (endColor.r - startColor.r));
  const g = Math.round(startColor.g + blendFactor * (endColor.g - startColor.g));
  const b = Math.round(startColor.b + blendFactor * (endColor.b - startColor.b));

  return `#${[r, g, b].map((item) => item.toString(16).padStart(2, '0')).join('')}`;
}
</script>

<style scoped lang="scss">
.scene-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;

  .fps-tips {
    position: absolute;
    left: 16px;
    bottom: 20px;
    font-size: 10px;
    color: #999999;
  }
}
</style>
