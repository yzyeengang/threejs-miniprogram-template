<script setup lang="ts">
import { useAnimations, useGLTF } from '@tresjs/cientos'
import { DRACOLoader } from 'three-stdlib';

const { scene: model, animations } = await useGLTF(
  'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
  {
    // 使用内建的 dracoLoader 会绕过插件内部依赖收集，所以需要在下面手动设置
    // draco:'draco/gltf/'
  },
  (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/gltf/');
    loader.setDRACOLoader?.(dracoLoader);
  }
)
model.position.set(1, 1, 0);
model.scale.set(0.01, 0.01, 0.01);

const { actions } = useAnimations(animations, model)

Object.values(actions)[0].play()

</script>

<template>
    <primitive :object="model"/>
</template>
