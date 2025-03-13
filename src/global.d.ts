import type { GlobalPatched } from '@minisheep/three-platform-adapter';
import type { SharedGlobals } from '@minisheep/mini-program-polyfill-core/polyfill';

declare global {
  const THREEGlobals: GlobalPatched<SharedGlobals>;
}


declare module '*.frag' {
  const fragmentText: string;
  export default fragmentText;
}
declare module '*.vert' {
  const vertexText: string;
  export default vertexText;
}
