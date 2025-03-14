import { defineConfig, Rollup, normalizePath, Plugin, createFilter } from "vite";
import uni from '@dcloudio/vite-plugin-uni';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import { toCustomChunkPlugin } from '@minisheep/rollup-plugin-to-custom-chunk';
import { templateCompilerOptions } from '@tresjs/core'
import { useStandardVuePlugin } from "@minisheep/platform-adapter-integration/tresjs/plugin";
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';
import { babel } from '@rollup/plugin-babel';

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

    threePlatformAdapter({
      mergePrefixGlobalOptions: {
        include: [
          /\/@vueuse\/(core|shared)\//,
          /\/@tresjs\/(core|cientos)\//,
        ]
      },
    }),


    //默认情况 uni-app 会将node_modules下的模块全都打包在 common/vendor.js
    //你也可以自定义输出目录，但需自己把控不影响应用加载顺序
    //可以设置环境变量进行调试 如 cross-env DEBUG=minisheep:to-custom-chunk uni build -p mp-weixin
    toCustomChunkPlugin({
      'common/vendor':[

      ],
      'common/my-vendor': [
        '@minisheep/three-platform-adapter',
        '@minisheep/three-platform-adapter/wechat',
      ],
      'sub-pack-2/vendor': [
        '@minisheep/three-platform-adapter/dist/three-override/jsm/**',
        'three',
        '@tresjs/core',
        '@tresjs/cientos',
        'three-stdlib',
        'three/examples/jsm/**',
        '@minisheep/platform-adapter-integration/tresjs'
      ]
    }),

    useStandardVuePlugin({
      include: [
        tresjsComponentPattern
      ]
    })
  ],
});
