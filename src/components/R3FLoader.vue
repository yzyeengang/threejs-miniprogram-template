<template>
  <!--  #ifndef H5  -->
  <platform-canvas
    class="r3f-loader"
    type="webgl2"
    :canvas-id="canvasId"
    @useCanvas="useCanvas"
  />
  <!--  #endif  -->
  <!--  #ifdef H5  -->
  <component :is="'div'" ref="h5Container" class="r3f-loader" />
  <!--  #endif  -->
</template>

<script lang="ts" setup>
import PlatformCanvas from '@/components/PlatformCanvas.vue';
// #ifndef H5
import { createRoot as mpCreateRoot } from '@minisheep/platform-adapter-integration/r3f';
// #endif
// #ifdef H5
import { createRoot } from 'react-dom/client';
// #endif
import { markRaw, onMounted, ref, shallowRef, watch } from 'vue';
import type { UseCanvasResult } from "@minisheep/three-platform-adapter";

export interface R3FLoaderProps {
  sceneLoader: (eventSource: any) => any;
}

const props = defineProps<R3FLoaderProps>();

const h5Container = shallowRef<HTMLElement>();

const canvasId = 'canvas-' + Date.now();
defineOptions({
  options: {
    virtualHost: true
  }
});

const mpCanvas = ref<HTMLCanvasElement>();


watch([mpCanvas, h5Container], ([canvas, h5Container], oldValue, onCleanup) => {
  if (canvas || h5Container) {
    const { scene, setContext } = props.sceneLoader(canvas || h5Container);
    let root: any;
    // #ifdef H5
    root = createRoot(h5Container!);
    root.render(scene);
    // #endif
    // #ifndef H5
    root = mpCreateRoot(canvas!);
    root.render(scene, () => {
      console.log('mp rendered');
    });
    // #endif
    onCleanup(() => {
      // root.render(null);
      console.log('r3f loader dispose');
      root.unmount();
    });
  }
});

async function useCanvas({ canvas }: UseCanvasResult) {
  mpCanvas.value = markRaw(canvas);
  console.log(mpCanvas.value,'----');
}
</script>

<style scoped lang="scss">
.bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.r3f-loader {
  width: 100%;
  height: 100%;
}
</style>
