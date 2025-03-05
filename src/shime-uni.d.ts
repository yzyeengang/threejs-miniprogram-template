import type { GlobalPatched } from '@minisheep/three-platform-adapter';
import type { SharedGlobals } from '@minisheep/mini-program-polyfill-core/polyfill';

export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}


declare global {
  const THREEGlobals: GlobalPatched<SharedGlobals>;

  interface ExampleInfo {
    canView: boolean;
    primaryColor: string;
    blockReason?: string;
  }

}
