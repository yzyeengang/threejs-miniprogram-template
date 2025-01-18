import * as THREE from 'three';
export class WebGLRenderer extends THREE.WebGLRenderer {
  constructor(parameters?: THREE.WebGLRendererParameters) {
    super(parameters);
    const originSetRenderTarget = this.setRenderTarget;

    this.setRenderTarget = function (...args: any) {
      originSetRenderTarget.apply(this, args);
      // 微信特有bug， 不清除深度缓冲会导致各种各样的bug。
      // 例如 pmremGenerator 的 fromScene 黑屏
      // 截至到 2025-01-18 依然存在
      if (args[0]) {
        this.clear(false, true, false);
      }
    };
  }
}
export * from 'three';
