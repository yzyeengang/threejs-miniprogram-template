// #ifndef H5
import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
// import '@minisheep/mini-program-polyfill-core/xml-addon'; // 如果项目中使用了需要 DOMParser 支持的部分，也可以后续按需导入，避免影响主包大小
// #endif
import { createSSRApp } from "vue";
import App from "./App.vue";
import { adapter } from '@minisheep/three-platform-adapter';
// #ifdef MP-WEIXIN
import { wechat } from '@minisheep/three-platform-adapter/wechat';
adapter.useAdapter(wechat);
// #endif
adapter.patch('THREEGlobals');

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
