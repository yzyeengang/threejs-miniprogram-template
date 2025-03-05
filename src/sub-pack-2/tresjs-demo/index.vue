<template>
    <view class="page-container">
        <canvas
                class="platform-canvas"
                :type="type"
                :id="canvasId"
                @touchstart="defaultHandler"
                @touchmove="defaultHandler"
                @touchcancel="defaultHandler"
                @touchend="defaultHandler"
                @tap="defaultHandler"
                disable-scroll
        >
        </canvas>
    </view>
</template>


<script setup lang="ts">
import { type Component, getCurrentInstance, onMounted, ref, shallowRef, watch } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { adapter, type TouchEventLike } from "@minisheep/three-platform-adapter";
import { mountTresApp } from "@minisheep/platform-adapter-integration/tresjs";
import YourFirstScene from './examples/YourFirstScene.vue'
import OrbitControls from './examples/OrbitControls.vue'
import BaseAnimation from "./examples/BaseAnimation.vue";
import BaseTexture from "./examples/BaseTexture.vue";
import GLTF from "./examples/GLTF.vue";
import LightsAndShadows from "@/sub-pack-2/tresjs-demo/examples/LightsAndShadows.vue";
import Shaders from "@/sub-pack-2/tresjs-demo/examples/Shaders.vue";
import BaseEvent from "@/sub-pack-2/tresjs-demo/examples/BaseEvent.vue";


export interface Props {
  type?: 'webgl' | 'webgl2';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'webgl2',
});

const canvasId = 'canvas-' + Date.now();

const defaultHandler = ref<(e: any) => void>();

const instance = getCurrentInstance();

const subPages = {
  base: YourFirstScene,
  events: BaseEvent,
  orbitControls: OrbitControls,
  animation: BaseAnimation,
  gltf: GLTF,
  texture: BaseTexture,
  lightsShadows: LightsAndShadows,
  shaders: Shaders,
}

const currentScene = shallowRef<Component>();
const canvas = shallowRef<HTMLCanvasElement>();

onLoad((query) => {
  const sceneId = query?.scene ?? 'base';
  currentScene.value = subPages[sceneId as keyof typeof subPages] ?? subPages['base'];
})

onMounted(async () => {
  const result = await adapter.useCanvas(`#${canvasId}`, (instance as any).ctx);
  defaultHandler.value = (e: TouchEventLike) => {
    if (e.type === 'touchstart') {
      result.eventHandler({
        ...e,
        type: 'touchmove',
      }, true, true)
    }
    result.eventHandler(e, true)
  };

  canvas.value = result.canvas;
})

watch([currentScene, canvas], ([scene, canvas], oldValue, onCleanup) => {
  const app = scene && canvas && mountTresApp(canvas, scene)
  //最新版本的 tresjs 使用 vueuse/core 的 useElementBounding 方式有误
  app && adapter.window.dispatchEvent({ type: 'resize' })
  app && onCleanup(() => {
    app.unmount();
  })
}, { immediate: true, flush: 'post' })


</script>


<style lang="scss">
.platform-canvas {
  width: 100%;
  height: 100%;
}
</style>
