import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
// 也可以在分包里再加入xml支持 减小主包大小
import '@minisheep/mini-program-polyfill-core/xml-addon';
import '@minisheep/three-platform-adapter/wechat';
App({
  globalData: {},
  onLaunch() {

  },
})
