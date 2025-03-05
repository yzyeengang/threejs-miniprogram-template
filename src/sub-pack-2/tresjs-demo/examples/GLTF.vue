<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three'
import GltfTokyo from './GLTFTokyo.vue';

const gl = {
  clearColor: '#F78B3D',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  windowSize: true,
}
</script>
<template>
    <TresCanvas v-bind="gl">
        <TresPerspectiveCamera
                :position="[5, 2, 8 ]"
                :look-at="[0, 2, 0]"
        />
        <OrbitControls  :target="[0,0.5,0]"/>
        <Suspense>
            <GltfTokyo />
        </Suspense>
        <TresDirectionalLight
                color="#F78B3D"
                :position="[3, 3, 3]"
                :intensity="1"
        />
        <TresAmbientLight :intensity="2" />
    </TresCanvas>
</template>
