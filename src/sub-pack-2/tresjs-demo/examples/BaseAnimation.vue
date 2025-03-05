<script setup lang="ts">
import { shallowRef } from 'vue';
import { TresCanvas, useRenderLoop } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import type * as THREE from 'three';

const boxRef = shallowRef<THREE.Mesh>();

const { onLoop } = useRenderLoop();

onLoop(({ delta, elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.y += delta;
    boxRef.value.rotation.z = elapsed * 0.2;
  }
});
</script>

<template>
    <TresCanvas clear-color="#82DBC5" shadows alpha window-size>
        <OrbitControls/>
        <TresPerspectiveCamera
                :position="[1, 2, 5]"
                :fov="45"
                :aspect="1"
                :near="0.1"
                :far="1000"
        />
        <TresMesh ref="boxRef" :scale="1" cast-shadow>
            <TresBoxGeometry :args="[1, 1, 1]"/>
            <TresMeshNormalMaterial/>
        </TresMesh>
    </TresCanvas>
</template>
