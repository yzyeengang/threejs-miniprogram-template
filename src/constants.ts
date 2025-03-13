// 根据 npx serve 启动的地址设置
export const CDN_PREFIX = `http://192.168.1.188:8196`

export function withCDNPrefix(path: string) {
  return CDN_PREFIX + (path.startsWith('/') ? path : ('/' + path));
}
