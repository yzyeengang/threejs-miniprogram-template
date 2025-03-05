<template>
    <!--  #ifndef H5    -->
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
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <!--  uni-component 实现的 canvas 固定了type=2d, 不能在h5中正常使用-->
    <component
            :is="'canvas'"
            class="platform-canvas"
            :id="canvasId"
            @touchstart.stop="defaultHandler"
            @touchmove.stop="defaultHandler"
            @touchcancel.stop="defaultHandler"
            @touchend.stop="defaultHandler"
            @click.stop="defaultHandler"
    />
    <!-- #endif -->
</template>

<script lang="ts" setup>
import { adapter, type UseCanvasResult, type TouchEventLike } from "@minisheep/three-platform-adapter";
import { getCurrentInstance, onMounted } from 'vue';

export interface PlatformCanvasProps {
  type: '2d' | 'webgl' | 'webgl2';
  canvasId: string;
}

defineOptions({
  options: {
    virtualHost: true
  }
});
const props = defineProps<PlatformCanvasProps>();

const emit = defineEmits<{
  touchstart: [e: TouchEventLike];
  touchmove: [e: TouchEventLike];
  touchend: [e: TouchEventLike];
  tap: [e: TouchEventLike];
  touchcancel: [e: TouchEventLike];
  dispatch: [e: TouchEventLike];
  useCanvas: [e: UseCanvasResult];
}>();

let additionHandler: (e: TouchEventLike) => void = () => {
};
const defaultHandler = (e: any) => {
  if (e.type === 'click') {
    e = {
      ...e,
      type: 'tap'
    };
  }
  emit(e.type, e);
  emit('dispatch', e);
  additionHandler?.(e);
};


console.log(props.canvasId);

const instance = getCurrentInstance();

onMounted(() => {
  adapter.useCanvas(`#${props.canvasId}`, (instance as any).ctx).then((result) => {
    additionHandler = (e: TouchEventLike) => {
      result.eventHandler(e, false)
    }
    emit('useCanvas', result);
  })
})
</script>

<style lang="scss">
.platform-canvas {
  width: 100%;
  height: 100%;
}
</style>
