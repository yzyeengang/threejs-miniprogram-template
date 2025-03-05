import { adapter } from "@minisheep/three-platform-adapter";
import YourFirstScene from "@/sub-pack-2/tresjs-demo/examples/YourFirstScene.vue";
import BaseAnimation from "@/sub-pack-2/tresjs-demo/examples/BaseAnimation.vue";
import GLTF from "@/sub-pack-2/tresjs-demo/examples/GLTF.vue";
import BaseTexture from "@/sub-pack-2/tresjs-demo/examples/BaseTexture.vue";
import LightsAndShadows from "@/sub-pack-2/tresjs-demo/examples/LightsAndShadows.vue";
import Shaders from "@/sub-pack-2/tresjs-demo/examples/Shaders.vue";
import OrbitControls from "@/sub-pack-2/tresjs-demo/examples/OrbitControls.vue";
import { mountTresApp } from "@minisheep/platform-adapter-integration/tresjs";
import BaseEvent from "@/sub-pack-2/tresjs-demo/examples/BaseEvent.vue";

const subPages = {
  base: YourFirstScene,
  events: BaseEvent,
  orbitControls: OrbitControls,
  animation: BaseAnimation,
  gltf: GLTF,
  texture: BaseTexture,
  lightsShadows: LightsAndShadows,
  shaders: Shaders,
}

Page({
  tresApp: null,
  data: {
    currentScene: null,
    tresApp:null
  },
  onLoad(query) {
    const sceneId = query?.scene ?? 'base';
    this.data.currentScene = subPages[sceneId];
  },
  async onReady() {
    const result = await adapter.useCanvas(`#tresjs_demo`, this);
    this.defaultHandler = result.eventHandler

    this.tresApp = this.data.currentScene && mountTresApp(result.canvas, this.data.currentScene);

    //当前版本的 tresjs 使用 vueuse/core 的 useElementBounding 方式有误
    this.tresApp && adapter.window.dispatchEvent({ type: 'resize' })
  },
  defaultHandler() {

  },
  onUnload() {
    this.tresApp?.unmount()
  }
})
