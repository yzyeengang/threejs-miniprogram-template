<template>
    <view class="content">
        <image class="logo" src="/static/logo.png"/>
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view>
        <view class="btns">
            <button
                    v-for="scene in sceneList"
                    @tap="navigateTo"
                    :data-target="scene.target"
                    :key="scene.name"
            >
                {{ scene.name }}
            </button>
        </view>
    </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { scenes, standardScenes } from './r3f-examples/index.tsx';

const title = ref('');

const sceneList = ref<{ name: string; target: string }[]>([]);

onLoad((query) => {
  query = query || {};
  title.value = `R3F ${query.type === 'base' ? '基础' : '复杂'}示例`;
  sceneList.value = Object.keys(query.type === 'base' ? scenes : standardScenes).map((key) => ({
    name: key,
    target: `/sub-pack-2/r3f-demo?scene=${key}`
  }));
});

function navigateTo(e: any) {
  uni.navigateTo({
    url: e.currentTarget.dataset.target as string
  });
}
</script>
<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.btns{
  margin-top: 20px;
  button{
    margin-top: 10px;
  }
}
</style>
