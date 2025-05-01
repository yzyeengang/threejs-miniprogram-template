import { defineConfig, Rollup, normalizePath, Plugin, createFilter } from "vite";
import uni from '@dcloudio/vite-plugin-uni';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import { templateCompilerOptions } from '@tresjs/core'
import { useStandardVuePlugin } from "@minisheep/platform-adapter-integration/tresjs/plugin";
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';
import { babel } from '@rollup/plugin-babel';
import createMpChunkSplitterPlugin from "@minisheep/vite-plugin-mp-chunk-splitter";

const tresjsComponentPattern = /\/tresjs-demo\/examples\/.*.vue/

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    dedupe:[
      '@minisheep/three-platform-adapter',
    ]
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: 79
            },
          }
        ]
      ],
      include: ['**/node_modules/@tresjs/**']
    }),
    glsl(),
    visualizer({
      emitFile: true,
    }),
    //@ts-expect-error 当前版本在以 esm 形式导出格式异常
    uni.default({
      vueOptions: {
        exclude: [tresjsComponentPattern]
      }
    }),
    vue({
      include: [tresjsComponentPattern],
      ...templateCompilerOptions
    }),

    useStandardVuePlugin({
      include: [
        tresjsComponentPattern
      ]
    }),
    threePlatformAdapter(),
    createMpChunkSplitterPlugin({
      subpackages:['sub-pack-2'],
      singleChunkMode:true,
      packageSizeLimit:1.8*1024*1024
    }),

  ],
});
