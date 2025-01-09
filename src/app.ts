// 手动添加 global prefix 插件的虚拟模块以避免重复添加
import '\0__prefix-global-virtual-inject';
import '@minisheep/mini-program-polyfill-core/polyfill';
// 也可以在分包里再加入xml支持 减小主包大小
import '@minisheep/mini-program-polyfill-core/xml-addon';
import { adapter } from '@minisheep/three-platform-adapter';
import { wechat } from '@minisheep/three-platform-adapter/wechat';
adapter.useAdapter(wechat).patch('THREEGlobals');
App({
  globalData: {},
  onLaunch() {

  },
})
