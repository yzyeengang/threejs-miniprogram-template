import { defineConfig } from 'weapp-vite/config';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from "node:path";
import vue from '@vitejs/plugin-vue';
import { templateCompilerOptions } from '@tresjs/core'
import babel from "@rollup/plugin-babel";
import createMpChunkSplitterPlugin from "@minisheep/vite-plugin-mp-chunk-splitter";

export default defineConfig({
  weapp: {
    srcRoot: 'src',
    // pnpm g 生成的格式
    // https://vite.icebreaker.top/guide/generate.html
    generate: {
      extensions: {
        js: 'ts',
        wxss: 'scss',
      },
      dirs: {
        component: 'src/components',
        page: 'src/pages',
      },
      // 假如你想让默认生成的组件命名为 HelloWorld/index 而不是 HelloWorld/HelloWorld 可以下列选项
      // filenames: {
      //   component: 'index',
      //   page: 'index',
      // },
    },
  },
  resolve: {
    dedupe: ['three'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  build: {
    // target: 'chrome79',
    rollupOptions: {
      output: {
        //方便开发者工具的 babel 排除 es6 转 es5 的文件
        chunkFileNames: "[name].js"
      }
    }
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
    // @ts-ignore
    threePlatformAdapter({
      //插件默认会自动在入口 chunk 添加虚拟模块, 但此项目每个 page 都是入口会导致重复添加
      prefixGlobal: {
        manualInject(chunk: any) {
          return chunk.name === 'src/app.ts';
        }
      }
    }),

    vue({
      ...templateCompilerOptions,
    }),


    createMpChunkSplitterPlugin({
      subpackages:['sub-pack-2'],
      singleChunkMode:true,
      packageSizeLimit:1.8*1024*1024
    }),
  ],
})
