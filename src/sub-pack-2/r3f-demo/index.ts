import { adapter } from "@minisheep/three-platform-adapter";
import { createRoot } from "@minisheep/platform-adapter-integration/r3f";
import { createExample } from "@/sub-pack-2/r3f-examples";

Page({
  app: null as any,
  sceneId: 'base',
  data: {
    video: '',
  },
  onLoad(query) {
    this.sceneId = query?.scene ?? 'base';
  },
  async onReady() {
    const result = await adapter.useCanvas(`#r3f_demo`, this);
    this.defaultHandler = (e: any) => {
      // if (e.type === 'touchstart') {
      //   result.eventHandler({
      //     ...e,
      //     type: 'touchmove',
      //   }, true, true)
      // }
      result.eventHandler(e, true)
    };
    const example = createExample({
      eventSource: result.canvas,
      sceneId: this.sceneId,
    }, this)
    if (example.needVideo) {
      this.setData({ video: example.needVideo });
    }

    this.app = createRoot(result.canvas).render(example.scene, () => {
      console.log('rendered');
    });
  },
  defaultHandler(e: any) {

  },
  onUnload() {
    this.app?.unmount()
  }
})
