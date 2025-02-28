import '@minisheep/mini-program-polyfill-core/wechat-polyfill';
// import '@minisheep/mini-program-polyfill-core/xml-addon'; // 如果项目中使用了需要 DOMParser 支持的部分，也可以后续按需导入，避免影响主包大小
import { game } from '@minisheep/three-platform-adapter';
import { wechatGame } from '@minisheep/three-platform-adapter/wechat-game';
import {init as gltfDemo} from "@/demos/gltf-loader";
import {init as particles} from "@/demos/particles/index";
game.useAdapter(wechatGame);

game.patch('THREEGlobals');


const result = game.useCanvas();
wx.onTouchStart(result.eventHandler);
wx.onTouchMove(result.eventHandler);
wx.onTouchEnd(result.eventHandler);
wx.onTouchCancel(result.eventHandler);


gltfDemo(result);
// particles(result);
