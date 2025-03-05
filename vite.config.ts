import { defineConfig, Rollup } from "vite";
import uni from '@dcloudio/vite-plugin-uni';
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';
import { toCustomChunkPlugin } from '@minisheep/rollup-plugin-to-custom-chunk';
import glsl from 'vite-plugin-glsl';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@minisheep/three-platform-adapter']
  },
  plugins: [
    glsl(),
    visualizer({
      emitFile: true,
    }),
    //@ts-expect-error 当前版本在以 esm 形式导出格式异常
    uni.default(),
    threePlatformAdapter(),


    //默认情况 uni-app 会将node_modules下的模块全都打包在 common/vendor.js
    //你也可以自定义输出目录，但需自己把控不影响应用加载顺序
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
    }),

    /**
     * 当你在某些情况需要开启 es6 转 es5 时，例如启用 skyline 或使用了手势系统(编译worklet),
     * 那么需要将 @minisheep相关的代码（特别是输出的worker)排除在外，否者将会出现问题
     * */
    {
      name: 'es5-ignore',
      generateBundle(options, bundles) {
        // 覆盖一下项目配置
        if (!bundles['project.config.json']) return null;
        const target = bundles['project.config.json'] as Rollup.OutputAsset;
        const data = JSON.parse(target.source as string);
        Object.assign(data.setting, {
          // 跳过库文件的 es6 转换不然有问题
          babelSetting: {
            ignore: [
              'workers',
              'common/my-vendor.js',
              'sub-pack-2/vendor.js',
            ],
            disablePlugins: [],
            outputPath: ''
          }
        });

        target.source = JSON.stringify(data, null, 2);
      }
    }
  ],
});
