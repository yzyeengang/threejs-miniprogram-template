import { defineConfig } from 'weapp-vite/config';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import { toCustomChunkPlugin } from '@minisheep/rollup-plugin-to-custom-chunk';
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from "node:path";

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
    rollupOptions: {
      output: {
        //方便开发者工具的 babel 排除 es6 转 es5 的文件
        chunkFileNames: "[name].js"
      }
    }
  },
  plugins: [
    glsl(),
    visualizer({
      emitFile: true,
    }),
    // @ts-ignore
    threePlatformAdapter({
      //插件默认会自动在入口 chunk 添加虚拟模块, 但此项目每个 page 都是入口会导致重复添加
      mergePrefixGlobalOptions: {
        manualInject(chunk: any) {
          return chunk.name === 'src/app.ts';
        }
      }
    }),


    //默认情况 weapp-vite 会将 package.json里的 dependencies 就近打包到 miniprogram_npm 见：https://vite.icebreaker.top/guide/npm.html
    //你也通过将依赖全安装到 devDependencies ，然后通过自定义输出目录，更方便的使用分包
    //可以设置环境变量进行调试 如 cross-env DEBUG=minisheep:to-custom-chunk uni build -p mp-weixin
    toCustomChunkPlugin({
      'common/my-vendor': [
        '@minisheep/three-platform-adapter',
        '@minisheep/three-platform-adapter/wechat',
      ],
      'sub-pack-2/vendor': [
        '@minisheep/three-platform-adapter/dist/three-override/jsm/**',
        'three',
        'three/examples/jsm/**',
      ]
    })
  ],
})
