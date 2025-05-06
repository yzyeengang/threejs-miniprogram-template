<template>
  <view class="page-container">
    <R3FLoader v-if="sceneLoaderReady" :scene-loader="sceneLoader" />
    <video
      v-if="enableVideo"
      id="scene-video"
      :src="enableVideo"
      loop
      muted
      crossorigin="anonymous"
      style="visibility: hidden; /*注意不能用display:none*/"
    ></video>
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { createExample, scenes, standardScenes } from './r3f-examples/index.tsx';
import { getCurrentInstance, ref, triggerRef } from 'vue';
import R3FLoader from '@/components/R3FLoader.vue';

const sceneLoaderReady = ref(false);
const sceneLoader = ref<any>(false);

const instance = getCurrentInstance();

const enableVideo = ref<string | false>(false);

onLoad((query) => {
  query = query || {};
  const sceneId = query?.scene ?? 'base';
  sceneLoader.value = (eventSource: any) => {
    const { scene, needVideo } = createExample(
      {
        eventSource,
        sceneId
      },
      (instance as any).ctx
    );

    if (needVideo) {
      enableVideo.value = needVideo;
    }
    return {
      scene,
    };
  };

  sceneLoaderReady.value = true;
  // 在小程序会不执行
  // triggerRef(sceneLoader);
});
</script>
