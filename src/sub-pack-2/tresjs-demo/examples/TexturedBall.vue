<script setup lang="ts">
import { ref } from 'vue';
import type * as THREE from 'three';
import { useTexture, useRenderLoop } from '@tresjs/core';

//https://threejs.org/examples/textures/ambientcg/Ice002_1K-JPG_Color.jpg

const getPath = (path: string) => `https://threejs.org/examples/textures/ambientcg/${path}`;
const pbrTexture = await useTexture({
  map: getPath('Ice002_1K-JPG_Color.jpg'),
  displacementMap: getPath('Ice002_1K-JPG_Displacement.jpg'),
  roughnessMap: getPath('Ice002_1K-JPG_Roughness.jpg'),
  normalMap: getPath('Ice002_1K-JPG_NormalGL.jpg'),
  // ambientOcclusion:
  //   'https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_AmbientOcclusion.jpg',
});

const sphereRef = ref<THREE.Mesh>();

const { resume, onLoop } = useRenderLoop();


onLoop(({ delta }) => {
  // I will run at every frame ~ 60FPS (depending of your monitor)
  if (sphereRef.value) {
    sphereRef.value.rotation.y += delta;
  }
});
</script>

<template>
    <TresMesh ref="sphereRef" :scale="1" cast-shadow>
        <TresSphereGeometry :args="[1, 100, 100]"/>
        <TresMeshStandardMaterial
                v-bind="pbrTexture"
                displacement-scale="0.2"
        />
    </TresMesh>
</template>
