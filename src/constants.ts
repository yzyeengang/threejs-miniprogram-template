// 根据 npx serve 启动的地址设置
export const LOCAL_ASSETS = `http://192.168.1.188:8196/`

export const cdn = {
  R3F_ASSETS: LOCAL_ASSETS,
};


export const DecoderPath = {
  GLTF: 'https://threejs.org/examples/jsm/libs/draco/gltf/',
  STANDARD: 'https://threejs.org/examples/jsm/libs/draco/'
};
// #ifndef H5
Object.assign(DecoderPath, {
  GLTF: 'draco/gltf/',
  STANDARD: 'draco/'
});
// #endif

export function withCDNPrefix(path: string, prefix: keyof typeof cdn = 'R3F_ASSETS'): string {
  return cdn[prefix] + (path.startsWith('/') ? path.slice(1) : path);
}
