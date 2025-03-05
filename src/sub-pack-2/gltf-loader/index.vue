<template>
   <view class="page-container">
       <PlatformCanvas
               type="webgl2"
               canvas-id="webgl_loader_gltf_compressed"
               @useCanvas="useCanvas"
       >
       </PlatformCanvas>
   </view>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import PlatformCanvas from "@/components/PlatformCanvas.vue";

function useCanvas( { canvas, useFrame,recomputeSize }) {
  const CANVAS_WIDTH = canvas.width;
  const CANVAS_HEIGHT = canvas.height;
  let camera, scene, renderer;

  init();
  render();

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(THREEGlobals.devicePixelRatio);
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 2000);
    camera.position.set(0, 100, 0);

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbbbbbb);
    scene.environment = pmremGenerator.fromScene(environment).texture;
    environment.dispose();

    const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add(grid);

    const ktx2Loader = new KTX2Loader()
      .setWorkerLimit(1)
      .setTranscoderPath('https://threejs.org/examples/jsm/libs/basis/')
      .detectSupport(renderer);

    const loader = new GLTFLoader();
    loader.setPath('https://threejs.org/examples/')
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('models/gltf/coffeemat.glb', function (gltf) {
      // coffeemat.glb was produced from the source scene using gltfpack:
      // gltfpack -i coffeemat/scene.gltf -o coffeemat.glb -cc -tc
      // The resulting model uses EXT_meshopt_compression (for geometry) and KHR_texture_basisu (for texture compression using ETC1S/BasisLZ)

      gltf.scene.position.y = 8;

      scene.add(gltf.scene);

      render();
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 400;
    controls.maxDistance = 1000;
    controls.target.set(10, 90, -16);
    controls.update();



    //需要手动触发
    canvas.addEventListener('resize', onWindowResize);
  }


  //手动触发resize
  function manualTriggerResize() {
    recomputeSize().then(()=>{
      canvas.dispatchEvent(new Event('resize'));
    })
  }

  function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    render();
  }

  //

  function render() {
    renderer.render(scene, camera);
  }
}

</script>



<style scoped>

</style>
