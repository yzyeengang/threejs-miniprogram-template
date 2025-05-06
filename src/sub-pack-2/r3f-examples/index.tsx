import { YourFirstScene } from './base/YourFirstScene';
import type * as React from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { wxContext } from './context';
import { BaseEvent } from './base/BaseEvent';
import { OrbitControlsDemo } from './base/OrbitControls';
import { BaseAnimation } from './base/BaseAnimation';
import { GLTFDemo } from './base/GLTFDemo';
import { BaseTexture } from './base/BaseTexture';
import { Shaders } from './base/Shaders';
import { ShoppingApp } from './complex/Shopping';
import { CardsWithBorderRadiusApp } from './complex/CardsWithBorderRadius';
import { FisheyeApp } from './complex/Fisheye';
import { GodRayVideoApp } from './complex/GodRayVideo';
import { RoomWithSoftShadowsApp } from './complex/RoomWithSoftShadows';
import { EnterPortalsApp } from './complex/EnterPortals';
import { MonitorsApp } from './complex/Monitors/App';
import { RenderTextureApp } from './complex/RenderTexture';
import { cdn } from '@/constants';
// @ts-expect-error no typings
import { configureTextBuilder } from 'troika-three-text';

configureTextBuilder({
  useWorker: false,
});
type SceneInfo = {
  scene: (...args: any[]) => React.JSX.Element,
  canvasProps?: Partial<CanvasProps>;
  needVideo?: false | string;
}


export const scenes: Record<string, SceneInfo['scene']> = {
  base: YourFirstScene,
  events: BaseEvent,
  orbitControls: OrbitControlsDemo,
  animation: BaseAnimation,
  gltf: GLTFDemo,
  texture: BaseTexture,
  shaders: Shaders
};

export const standardScenes: Record<
  string,
  SceneInfo | SceneInfo['scene']
> = {
  renderTexture: RenderTextureApp,
  shopping: ShoppingApp,
  cards: CardsWithBorderRadiusApp,
  fisheye: FisheyeApp,
  godRayVideo: {
    scene: GodRayVideoApp,
    needVideo: `${cdn.R3F_ASSETS}10.mp4`
  },
  roomWithSoftShadows: RoomWithSoftShadowsApp,
  enterPortals: EnterPortalsApp,
  monitors: MonitorsApp
};

export interface BaseCanvasProps {
  eventSource: HTMLElement | React.RefObject<HTMLElement>;
  sceneId: keyof typeof scenes | keyof typeof standardScenes;
}

export function createExample(props: BaseCanvasProps, ctx: any) {
  const { eventSource, sceneId } = props;
  const isStandard = sceneId in standardScenes;
  const info: SceneInfo = isStandard ? (typeof standardScenes[sceneId] === 'object' ? standardScenes[sceneId] : {
    scene: standardScenes[sceneId],
  }) : { scene: scenes[sceneId] };
  const Scene = info.scene;
  return {
    needVideo: ('needVideo' in info ? (info.needVideo as string) : false) as false | string,
    scene: (
      <wxContext.Provider value={ctx}>
        {isStandard ? (
          <Scene eventSource={eventSource}/>
        ) : (
          <Canvas
            eventSource={eventSource}
            dpr={THREEGlobals.devicePixelRatio}
            {...('canvasProps' in info ? info.canvasProps : {})}
          >
            <Scene/>
          </Canvas>
        )}
      </wxContext.Provider>
    )
  };
}
