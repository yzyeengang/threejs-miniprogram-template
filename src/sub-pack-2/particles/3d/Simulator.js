import * as THREE from 'three';
import { settings } from '../core/settings.ts';
import VERT_QUAD from '../glsl/quad.vert';
import FRAG_THROUGH from '../glsl/through.frag';
import FRAG_POSITION from '../glsl/position.frag';

const undef = undefined;
const TEXTURE_WIDTH = settings.simulatorTextureWidth;
const TEXTURE_HEIGHT = settings.simulatorTextureHeight;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;

export class Simulator {
  initAnimation = 0;
  _followPointTime = 0;
  _followPoint = new THREE.Vector3();
  _scene = new THREE.Scene();
  _camera = new THREE.Camera();

  constructor(/** @type Three.WebGLRenderer*/ renderer) {
    this._renderer = renderer;
    let rawShaderPrefix = 'precision ' + renderer.capabilities.precision + ' float;\n';
    // webgl2 原生支持
    // let gl = _renderer.getContext();
    // console.log(gl);
    // console.log(gl.getExtension('OES_texture_float'));
    // if (!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
    //   alert('No support for vertex shader textures!');
    //   return;
    // }
    // if (!gl.getExtension('OES_texture_float')) {
    //   alert('No OES_texture_float support for float textures!');
    //   return;
    // }
    this._camera.position.z = 1;

    this._copyShader = new THREE.RawShaderMaterial({
      uniforms: {
        resolution: { type: 'v2', value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT) },
        texture: { type: 't', value: undef }
      },
      vertexShader: rawShaderPrefix + VERT_QUAD,
      fragmentShader: rawShaderPrefix + FRAG_THROUGH
    });

    this._positionShader = new THREE.RawShaderMaterial({
      uniforms: {
        resolution: { type: 'v2', value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT) },
        texturePosition: { type: 't', value: undef },
        textureDefaultPosition: { type: 't', value: undef },
        mouse3d: { type: 'v3', value: new THREE.Vector3() },
        speed: { type: 'f', value: 1 },
        dieSpeed: { type: 'f', value: 0 },
        radius: { type: 'f', value: 0 },
        curlSize: { type: 'f', value: 0 },
        attraction: { type: 'f', value: 0 },
        time: { type: 'f', value: 0 },
        initAnimation: { type: 'f', value: 0 }
      },
      vertexShader: rawShaderPrefix + VERT_QUAD,
      fragmentShader: rawShaderPrefix + FRAG_POSITION,
      blending: THREE.NoBlending,
      transparent: false,
      depthWrite: false,
      depthTest: false
    });

    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this._copyShader);
    this._scene.add(this._mesh);

    this._positionRenderTarget = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthWrite: false,
      depthBuffer: false,
      stencilBuffer: false
    });
    this._positionRenderTarget2 = this._positionRenderTarget.clone();

    this._copyTexture(this._createPositionTexture(), this._positionRenderTarget);
    this._copyTexture(this._positionRenderTarget.texture, this._positionRenderTarget2);
  }

  _copyTexture(input, output) {
    this._copyShader.uniforms.texture.value = input;

    const currentRenderTarget = this._renderer.getRenderTarget();
    this._renderer.setRenderTarget(output);
    this._renderer.render(this._scene, this._camera);
    this._renderer.setRenderTarget(currentRenderTarget);
  }

  _updatePosition(dt) {
    // swap
    const tmp = this._positionRenderTarget;
    this._positionRenderTarget = this._positionRenderTarget2;
    this._positionRenderTarget2 = tmp;

    this._mesh.material = this._positionShader;
    this._positionShader.uniforms.textureDefaultPosition.value = this._textureDefaultPosition;
    this._positionShader.uniforms.texturePosition.value = this._positionRenderTarget2.texture;
    this._positionShader.uniforms.time.value += dt * 0.001;

    const currentRenderTarget = this._renderer.getRenderTarget();
    this._renderer.setRenderTarget(this._positionRenderTarget);
    this._renderer.render(this._scene, this._camera);
    this._renderer.setRenderTarget(currentRenderTarget);
  }

  _createPositionTexture() {
    const positions = new Float32Array(AMOUNT * 4);
    let i4;
    let r, phi, theta;
    for (let i = 0; i < AMOUNT; i++) {
      i4 = i * 4;
      // r = (0.5 + Math.pow(Math.random(), 0.4) * 0.5) * 50;
      r = (0.5 + Math.random() * 0.5) * 50;
      phi = (Math.random() - 0.5) * Math.PI;
      theta = Math.random() * Math.PI * 2;
      positions[i4 + 0] = r * Math.cos(theta) * Math.cos(phi);
      positions[i4 + 1] = r * Math.sin(phi);
      positions[i4 + 2] = r * Math.sin(theta) * Math.cos(phi);
      positions[i4 + 3] = Math.random();
    }
    const texture = new THREE.DataTexture(
      positions,
      TEXTURE_WIDTH,
      TEXTURE_HEIGHT,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.generateMipmaps = false;
    texture.flipY = false;
    this._textureDefaultPosition = texture;
    return texture;
  }

  update(dt) {
    const { _followPointTime, _positionShader, _renderer } = this;
    if (settings.speed || settings.dieSpeed) {
      let r = 200;
      let h = 60;
      if (settings.isMobile) {
        r = 100;
        h = 40;
      }

      const autoClearColor = _renderer.autoClearColor;
      const clearColor = new THREE.Color();
      _renderer.getClearColor(clearColor);
      const clearAlpha = _renderer.getClearAlpha();

      _renderer.autoClearColor = false;

      const deltaRatio = dt / 16.6667;

      _positionShader.uniforms.speed.value = settings.speed * deltaRatio;
      _positionShader.uniforms.dieSpeed.value = settings.dieSpeed * deltaRatio;
      _positionShader.uniforms.radius.value = settings.radius;
      _positionShader.uniforms.curlSize.value = settings.curlSize;
      _positionShader.uniforms.attraction.value = settings.attraction;
      _positionShader.uniforms.initAnimation.value = this.initAnimation;

      if (settings.followMouse) {
        _positionShader.uniforms.mouse3d.value.copy(settings.mouse3d);
      } else {
        this._followPointTime += dt * 0.001 * settings.speed;
        this._followPoint.set(
          Math.cos(_followPointTime) * r,
          Math.cos(_followPointTime * 4.0) * h,
          Math.sin(_followPointTime * 2.0) * r
        );
        _positionShader.uniforms.mouse3d.value.lerp(this._followPoint, 0.2);
      }

      _renderer.setClearColor(0, 0);
      this._updatePosition(dt);

      _renderer.setClearColor(clearColor, clearAlpha);
      _renderer.autoClearColor = autoClearColor;
    }
  }

  get positionRenderTarget() {
    return this._positionRenderTarget;
  }
  get prevPositionRenderTarget() {
    return this._positionRenderTarget2;
  }
}
