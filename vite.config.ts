import { defineConfig, Rollup } from "vite";
import uni from '@dcloudio/vite-plugin-uni';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import { createMpChunkSplitterPlugin } from "@minisheep/vite-plugin-mp-chunk-splitter";
import react from '@vitejs/plugin-react';
import {supportR3fInUni} from '@minisheep/platform-adapter-integration/r3f/plugin'
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@minisheep/three-platform-adapter']
  },
  resolve:{
    // dedupe:['troika-three-text']
  },
  build:{
    rollupOptions:{
      external: [
        // @react-three/drei 有依赖它，但如果你实际上不应该使用 dom-only 相关组件如 Html，ScrollControls
        'react-dom/client'
      ],
      treeshake:{
        preset: 'smallest',
        annotations: true,
        moduleSideEffects: 'no-external'
      }
    }
  },
  plugins: [
    // esm-only 的包
    glsl(),
    visualizer({
      emitFile: true,
    }),
    threePlatformAdapter(),
    react(),
    //@ts-expect-error 当前版本在以 esm 形式导出格式异常
    uni.default(),
    supportR3fInUni(),

    createMpChunkSplitterPlugin({
      singleChunkMode: true,
      subpackages: ['sub-pack-2'],
      packageSizeLimit: 1.8 * 1024 * 1024
    }),
    {
      name:'find-dep',
      config(config){
        // uni 插件覆盖了这个导致不能正确识别 pnpm 安装模块的依赖
        config.resolve!.preserveSymlinks = false;
      }
    },
  ],
});
