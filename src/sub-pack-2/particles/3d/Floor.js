import * as THREE from 'three';
export class Floor extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(4000, 4000, 10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 1.0,
      color: 0x333333,
      emissive: 0x000000
    });
    super(geometry, planeMaterial);

    this.rotation.x = -1.57;
    this.receiveShadow = true;
    this.position.y = -100;
  }
}
