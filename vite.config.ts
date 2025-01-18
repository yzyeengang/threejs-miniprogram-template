import { defineConfig, PluginOption } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";
import axios from "axios";
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import * as fsp from "node:fs/promises";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import threePlatformAdapter from "@minisheep/three-platform-adapter/plugin";
import glsl from 'vite-plugin-glsl';

// const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig((config) => {
  const isDev = config.mode === 'development';
  const openDevTools = process.env.OPEN_DEVTOOL === 'true';
  return {
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    },
    build: {
      minify: isDev ? false : 'esbuild',
      lib: {
        entry: {
          game: resolve('./src/game.ts')
        },
        formats: ['cjs'],
        fileName: (format, entryName) => {
          return `${entryName}.js`
        }
      }
    },
    plugins: [
      glsl(),
      threePlatformAdapter({}),
      !isDev && visualizer({
        emitFile: true,
      }),
      {
        //如果你希望自动打开开发者工具
        async closeBundle() {
          if(!openDevTools){
            return
          }
          //修改成你自己的安装路径
          const devtoolsInstallPath = 'D:\\微信web开发者工具'; //苹果用户 /Applications/wechatwebdevtools.app/Contents/MacOS
          if (!fs.existsSync(devtoolsInstallPath)) {
            console.log('如果你希望自动打开开发者工具,你需要先配置开发者工具路径');
            return
          }
          if (process.platform === 'linux') {
            return
          }
          const isWindows = process.platform === 'win32';
          let latestNw = '';
          if (isWindows) {
            const versionFile = join(devtoolsInstallPath, './version');
            const info = JSON.parse(await fsp.readFile(versionFile, 'utf8'));
            latestNw = info.latestNw;
          }
          const md5 = crypto.createHash('md5').update(`${devtoolsInstallPath}${latestNw}`).digest('hex');
          const homeDir = process.env.HOME || process.env.USERPROFILE as string;
          let idePath = '';
          if (isWindows) {
            idePath = join(homeDir, `AppData/Local/微信开发者工具/User Data/${md5}/Default/.ide`);
          } else {
            idePath = join(homeDir, `/Library/Application Support/微信开发者工具/${md5}/Default/.ide`);
          }
          const ideContent = await fsp.readFile(idePath, 'utf8');
          const apiPort = ideContent.trim();

          //唤起开发者工具
          axios.get(`http://127.0.0.1:${apiPort}/v2/open?project=${resolve('./dist')}`).then(response => {
            console.log('唤起成功', response.status);
          }).catch(error => {
            console.error('唤起失败', error);
          })
        }
      }
    ] as PluginOption[]
  }
})
