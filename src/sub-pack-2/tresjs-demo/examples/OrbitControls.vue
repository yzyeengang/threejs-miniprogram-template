<template>
    <TresCanvas v-bind="gl">
        <TresPerspectiveCamera :position="[4, 3, 9]" />
        <OrbitControls />
        <Suspense>
            <Text3D
                    :position="[0, 1, 0]"
                    text="Hello three.js"
                    font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
            >
                <TresMeshNormalMaterial/>
            </Text3D>
        </Suspense>
        <TresDirectionalLight :position="[0, 2, 4]" :intensity="1.2" cast-shadow />
        <TresGridHelper />
    </TresCanvas>
</template>
<script setup lang="ts">
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Text3D } from '@tresjs/cientos';

const gl = {
  clearColor: '#82DBC5',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};
</script>
