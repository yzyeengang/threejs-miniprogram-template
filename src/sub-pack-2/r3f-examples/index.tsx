import { YourFirstScene } from "./base/YourFirstScene.tsx";
import type * as React from "react";
import { Canvas, CanvasProps } from '@react-three/fiber';
import { wxContext } from "@/sub-pack-2/r3f-examples/context";
import { BaseEvent } from "./base/BaseEvent.tsx";
import { OrbitControlsDemo } from "./base/OrbitControls.tsx";
import { BaseAnimation } from "./base/BaseAnimation.tsx";
import { GLTFDemo } from "@/sub-pack-2/r3f-examples/base/GLTFDemo.tsx";
import { BaseTexture } from "@/sub-pack-2/r3f-examples/base/BaseTexture.tsx";
import { Shaders } from "@/sub-pack-2/r3f-examples/base/Shaders.tsx";
import { ShoppingApp } from "@/sub-pack-2/r3f-examples/complex/Shopping";
import { CardsWithBorderRadiusApp } from "@/sub-pack-2/r3f-examples/complex/CardsWithBorderRadius";
import FisheyeApp from "@/sub-pack-2/r3f-examples/complex/Fisheye";
import { CDN_PREFIX } from "@/constants";
import { GodRayVideoApp } from "@/sub-pack-2/r3f-examples/complex/GodRayVideo";
import { RoomWithSoftShadowsApp } from "@/sub-pack-2/r3f-examples/complex/RoomWithSoftShadows";

import { EnterPortalsApp } from "@/sub-pack-2/r3f-examples/complex/EnterPortals";
import MonitorsApp from "@/sub-pack-2/r3f-examples/complex/Monitors/App";
import { RenderTextureApp } from "@/sub-pack-2/r3f-examples/complex/RenderTexture";



type BaseSceneInfo = {
  canvasProps?: Partial<CanvasProps>;
  scene: React.JSX.Element;
}
type StandardSceneInfo = {
  needVideo?: false | string;
} & BaseSceneInfo;

export const scenes: Record<string, BaseSceneInfo | React.JSX.Element> = {
  base: <YourFirstScene/>,
  events: <BaseEvent/>,
  orbitControls: <OrbitControlsDemo/>,
  animation: <BaseAnimation/>,
  gltf: <GLTFDemo/>,
  texture: <BaseTexture/>,
  shaders: <Shaders/>,
}

export const standardScenes: Record<string, (eventSource: HTMLElement | React.RefObject<HTMLElement>) => StandardSceneInfo | React.JSX.Element> = {
  renderTexture: (eventSource) => <RenderTextureApp eventSource={eventSource}/>,
  shopping: (eventSource) => <ShoppingApp eventSource={eventSource}/>,
  cards: (eventSource) => <CardsWithBorderRadiusApp eventSource={eventSource}/>,
  fisheye: (eventSource) => <FisheyeApp eventSource={eventSource}/>,
  godRayVideo: (eventSource) => {
    return {
      scene: <GodRayVideoApp eventSource={eventSource}/>,
      needVideo: `${CDN_PREFIX}/10.mp4`
    }
  },
  roomWithSoftShadows: (eventSource) => <RoomWithSoftShadowsApp eventSource={eventSource}/>,
  enterPortals: (eventSource) => <EnterPortalsApp eventSource={eventSource}/>,
  monitors: (eventSource) => <MonitorsApp eventSource={eventSource}/>,
}


export interface BaseCanvasProps {
  eventSource: HTMLElement | React.RefObject<HTMLElement>;
  sceneId: keyof typeof scenes | keyof typeof standardScenes;
}


export function createExample(props: BaseCanvasProps, ctx: any) {
  const { eventSource, sceneId } = props;
  const isStandard = sceneId in standardScenes;
  const info = scenes[sceneId] || standardScenes[sceneId]?.(eventSource);
  const scene = 'scene' in info ? info.scene : info;
  return {
    needVideo: ('needVideo' in info ? (info.needVideo as string) : false) as (false | string),
    scene: (<wxContext.Provider value={ctx}>
      {isStandard ? scene : (<Canvas
        eventSource={eventSource}
        dpr={THREEGlobals.devicePixelRatio}
        {...('canvasProps' in info ? info.canvasProps : {})}>
        {scene}
      </Canvas>)}
    </wxContext.Provider>)
  }
}

