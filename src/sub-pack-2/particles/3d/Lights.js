import * as THREE from 'three';
// import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';

const SHADOW_MAP_WIDTH = 4096;
const SHADOW_MAP_HEIGHT = 2048;

export class Lights extends THREE.Object3D {
  constructor() {
    super();
    this.position.set(0, 500, 0);

    const ambient = new THREE.AmbientLight(0x333333);
    this.add(ambient);

    const pointLight = (this.pointLight = new THREE.PointLight(0xffffff, 1, 700, 0));
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 10;
    pointLight.shadow.camera.far = 700;
    // pointLight.shadow.bias = 0.1;
    pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    this.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xba8b8b, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0x8bbab4, 0.3);
    directionalLight2.position.set(1, 1, -1);
    this.add(directionalLight2);

    // const lightShadowMapViewer = this.lightShadowMapViewer = new ShadowMapViewer( pointLight );
    // lightShadowMapViewer.position.x = 10;
    // lightShadowMapViewer.position.y = window.innerHeight - ( SHADOW_MAP_HEIGHT / 6 ) - 10;
    // lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 6;
    // lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 6;
    // lightShadowMapViewer.update();
  }

  update(renderer) {
    // this.pointLight.shadow.
    // this.pointLight.shadowDarkness = this._shadowDarkness += (shadowDarkness - _shadowDarkness) * 0.1
    // this.lightShadowMapViewer.render(renderer)
  }
}
