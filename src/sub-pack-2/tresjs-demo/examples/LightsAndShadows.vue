<script setup lang="ts">
import { shallowRef } from 'vue';
import { TresCanvas, useRenderLoop } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from 'three'

const gl = {
  clearColor: '#82DBC5',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}

const boxRef = shallowRef()

const { onLoop } = useRenderLoop()

onLoop(() => {
  if (boxRef.value) {
    boxRef.value.rotation.y += 0.01
  }
})


</script>

<template>
    <TresCanvas v-bind="gl" window-size>
        <OrbitControls/>
        <TresPerspectiveCamera :position="[5, 7.5, 7.5]" :fov="45" :aspect="1" :near="0.1" :far="1000"/>
        <TresMesh :position="[-2, 2, 0]" :rotation="[0, Math.PI, 0]">
            <TresConeGeometry :args="[1, 1.5, 3]"/>
            <TresMeshToonMaterial color="#82DBC5"/>
        </TresMesh>
        <TresMesh ref="boxRef" cast-shadow :position="[0, 0, 0]">
            <TresBoxGeometry :args="[1.5, 1.5, 1.5]"/>
            <TresMeshToonMaterial color="#4F4F4F"/>
        </TresMesh>
        <TresMesh cast-shadow :position="[1.8, -1.8, 0]">
            <TresSphereGeometry :args="[1,256,128]"/>
            <TresMeshToonMaterial color="#FBB03B"/>
        </TresMesh>
        <TresMesh receive-shadow :position="[0, -3, 0]" :rotation="[-Math.PI / 2, 0, 0]">
            <TresPlaneGeometry :args="[10, 10, 10, 10]"/>
            <TresMeshStandardMaterial color="#f7f7f7"/>
        </TresMesh>

        <TresAmbientLight :intensity="1"/>
        <TresDirectionalLight cast-shadow :position="[0, 2, 0]" :intensity="1"/>
    </TresCanvas>
</template>
