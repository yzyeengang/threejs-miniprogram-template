import VERT_PARTICLES from '../glsl/particles.vert';
import FRAG_PARTICLES from '../glsl/particles.frag';
import VERT_PARTICLES_DISTANCE from '../glsl/particlesDistance.vert';
import FRAG_PARTICLES_DISTANCE from '../glsl/particlesDistance.frag';
// import VERT_PARTICLES_MOTION from '../glsl/particlesMotion.vert'
// import VERT_TRIANGLES from '../glsl/triangles.vert'
// import VERT_TRIANGLES_Distance from '../glsl/trianglesDistance.vert'
// import VERT_TRIANGLES_MOTION from '../glsl/trianglesMotion.vert'
import * as THREE from 'three';
import { settings } from '../core/settings.ts';
const TEXTURE_WIDTH = settings.simulatorTextureWidth;
const TEXTURE_HEIGHT = settings.simulatorTextureHeight;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;
const undef = undefined;

export class Particles extends THREE.Object3D {
  constructor(/** @type Three.WebGLRenderer*/ renderer) {
    super();
    this._renderer = renderer;
    this._tmpColor = new THREE.Color();
    this._color1 = new THREE.Color(settings.color1);
    this._color2 = new THREE.Color(settings.color2);

    this._meshes = [
      // this._triangleMesh = this._createTriangleMesh(),
      (this._particleMesh = this._createParticleMesh())
    ];
    // this._triangleMesh.visible = false;
    this._particleMesh.visible = false;

    // this.add(this._triangleMesh);
    this.add(this._particleMesh);
  }

  _createParticleMesh() {
    const position = new Float32Array(AMOUNT * 3);
    let i3;
    for (let i = 0; i < AMOUNT; i++) {
      i3 = i * 3;
      position[i3 + 0] = (i % TEXTURE_WIDTH) / TEXTURE_WIDTH;
      position[i3 + 1] = ~~(i / TEXTURE_WIDTH) / TEXTURE_HEIGHT;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        // THREE.ShaderLib.standard.uniforms,
        {
          texturePosition: { type: 't', value: undef },
          color1: { type: 'c', value: undef },
          color2: { type: 'c', value: undef }
        }
      ]),
      vertexShader: VERT_PARTICLES,
      fragmentShader: FRAG_PARTICLES,
      blending: THREE.NoBlending
      // lights: true
      // fog: true
    });

    material.uniforms.color1.value = this._color1;
    material.uniforms.color2.value = this._color2;

    const mesh = new THREE.Points(geometry, material);

    mesh.customDistanceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        lightPos: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
        texturePosition: { type: 't', value: undef }
      },
      vertexShader: VERT_PARTICLES_DISTANCE,
      fragmentShader: FRAG_PARTICLES_DISTANCE,
      depthTest: true,
      depthWrite: true,
      side: THREE.BackSide,
      blending: THREE.NoBlending
    });

    // mesh.motionMaterial = new MeshMotionMaterial({
    //   uniforms: {
    //     texturePosition: { type: 't', value: undef },
    //     texturePrevPosition: { type: 't', value: undef }
    //   },
    //   vertexShader: shaderParse(VERT_PARTICLES_MOTION),
    //   depthTest: true,
    //   depthWrite: true,
    //   side: THREE.DoubleSide,
    //   blending: THREE.NoBlending
    // });

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  // _createTriangleMesh() {
  //
  //   const position = new Float32Array(AMOUNT * 3 * 3);
  //   const positionFlip = new Float32Array(AMOUNT * 3 * 3);
  //   const fboUV = new Float32Array(AMOUNT * 2 * 3);
  //
  //   const PI = Math.PI;
  //   const angle = PI * 2 / 3;
  //   const angles = [
  //     Math.sin(angle * 2 + PI),
  //     Math.cos(angle * 2 + PI),
  //     Math.sin(angle + PI),
  //     Math.cos(angle + PI),
  //     Math.sin(angle * 3 + PI),
  //     Math.cos(angle * 3 + PI),
  //     Math.sin(angle * 2),
  //     Math.cos(angle * 2),
  //     Math.sin(angle),
  //     Math.cos(angle),
  //     Math.sin(angle * 3),
  //     Math.cos(angle * 3)
  //   ];
  //   let i6, i9;
  //   for (let i = 0; i < AMOUNT; i++) {
  //     i6 = i * 6;
  //     i9 = i * 9;
  //     if (i % 2) {
  //       position[i9 + 0] = angles[0];
  //       position[i9 + 1] = angles[1];
  //       position[i9 + 3] = angles[2];
  //       position[i9 + 4] = angles[3];
  //       position[i9 + 6] = angles[4];
  //       position[i9 + 7] = angles[5];
  //
  //       positionFlip[i9 + 0] = angles[6];
  //       positionFlip[i9 + 1] = angles[7];
  //       positionFlip[i9 + 3] = angles[8];
  //       positionFlip[i9 + 4] = angles[9];
  //       positionFlip[i9 + 6] = angles[10];
  //       positionFlip[i9 + 7] = angles[11];
  //     } else {
  //       positionFlip[i9 + 0] = angles[0];
  //       positionFlip[i9 + 1] = angles[1];
  //       positionFlip[i9 + 3] = angles[2];
  //       positionFlip[i9 + 4] = angles[3];
  //       positionFlip[i9 + 6] = angles[4];
  //       positionFlip[i9 + 7] = angles[5];
  //
  //       position[i9 + 0] = angles[6];
  //       position[i9 + 1] = angles[7];
  //       position[i9 + 3] = angles[8];
  //       position[i9 + 4] = angles[9];
  //       position[i9 + 6] = angles[10];
  //       position[i9 + 7] = angles[11];
  //     }
  //
  //     fboUV[i6 + 0] = fboUV[i6 + 2] = fboUV[i6 + 4] = (i % TEXTURE_WIDTH) / TEXTURE_WIDTH;
  //     fboUV[i6 + 1] = fboUV[i6 + 3] = fboUV[i6 + 5] = ~~(i / TEXTURE_WIDTH) / TEXTURE_HEIGHT;
  //   }
  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  //   geometry.setAttribute('positionFlip', new THREE.BufferAttribute(positionFlip, 3));
  //   geometry.setAttribute('fboUV', new THREE.BufferAttribute(fboUV, 2));
  //
  //   const material = new THREE.ShaderMaterial({
  //     uniforms: {
  //       texturePosition: { type: 't', value: undef },
  //       flipRatio: { type: 'f', value: 0 },
  //       color1: { type: 'c', value: undef },
  //       color2: { type: 'c', value: undef },
  //       cameraMatrix: { type: 'm4', value: undef }
  //     }
  //     ,
  //     vertexShader: VERT_TRIANGLES,
  //     fragmentShader: FRAG_PARTICLES,
  //     blending: THREE.NoBlending
  //   });
  //
  //   material.uniforms.color1.value = this._color1;
  //   material.uniforms.color2.value = this._color2;
  //   material.uniforms.cameraMatrix.value = settings.camera.matrixWorld;
  //
  //   const mesh = new THREE.Mesh(geometry, material);
  //
  //   mesh.customDistanceMaterial = new THREE.ShaderMaterial({
  //     uniforms: {
  //       lightPos: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
  //       texturePosition: { type: 't', value: undef },
  //       flipRatio: { type: 'f', value: 0 }
  //     },
  //     vertexShader: VERT_PARTICLES_DISTANCE,
  //     fragmentShader: FRAG_PARTICLES_DISTANCE,
  //     depthTest: true,
  //     depthWrite: true,
  //     side: THREE.BackSide,
  //     blending: THREE.NoBlending
  //   });
  //
  //   // mesh.motionMaterial = new MeshMotionMaterial({
  //   //   uniforms: {
  //   //     texturePosition: { type: 't', value: undef },
  //   //     texturePrevPosition: { type: 't', value: undef },
  //   //     flipRatio: { type: 'f', value: 0 }
  //   //   },
  //   //   vertexShader: shaderParse(VERT_TRIANGLES_MOTION),
  //   //   depthTest: true,
  //   //   depthWrite: true,
  //   //   side: THREE.DoubleSide,
  //   //   blending: THREE.NoBlending
  //   // });
  //
  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;
  //
  //   return mesh;
  // }

  update(dt, simulator) {
    let mesh;

    // this._triangleMesh.visible = settings.useTriangleParticles;
    this._particleMesh.visible = settings.useTriangleParticles;

    this._tmpColor.setStyle(settings.color1);
    this._color1.lerp(this._tmpColor, 0.05);

    this._tmpColor.setStyle(settings.color2);
    this._color2.lerp(this._tmpColor, 0.05);

    for (let i = 0; i < this._meshes.length; i++) {
      mesh = this._meshes[i];
      mesh.material.uniforms.texturePosition.value = simulator.positionRenderTarget.texture;
      mesh.customDistanceMaterial.uniforms.texturePosition.value =
        simulator.positionRenderTarget.texture;
      // mesh.motionMaterial.uniforms.texturePrevPosition.value = simulator.prevPositionRenderTarget;
      if (mesh.material.uniforms.flipRatio) {
        mesh.material.uniforms.flipRatio.value ^= 1;
        mesh.customDistanceMaterial.uniforms.flipRatio.value ^= 1;
        // mesh.motionMaterial.uniforms.flipRatio.value ^= 1;
      }
    }
  }
}
