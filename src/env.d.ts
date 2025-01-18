/// <reference types="vite/client" />
import type { GlobalPatched } from '@minisheep/three-platform-adapter';
import type { SharedGlobals } from '@minisheep/mini-program-polyfill-core/polyfill';


declare global {
  const THREEGlobals: GlobalPatched<SharedGlobals>;
}

