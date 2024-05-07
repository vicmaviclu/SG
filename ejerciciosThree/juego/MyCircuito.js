import * as THREE from '../libs/three.module.js'

class MyCircuito extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    
    this.points = [
        new THREE.Vector3(0, 0, 0),
        // Loop
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(3.5, 1, -0.25),
        new THREE.Vector3(2.5, 2, -0.25),
        new THREE.Vector3(1.5, 1.5, -0.5),
        new THREE.Vector3(1.45, 0.5, -0.5),
        new THREE.Vector3(2.5, -1, -0.5),

        new THREE.Vector3(2.5, -1, 2),
        new THREE.Vector3(4, -1, 2),
        new THREE.Vector3(4, 0, 2),
        new THREE.Vector3(2.5, 1, 2),
        new THREE.Vector3(2.5, 1, -2),
    
        new THREE.Vector3(-2, 1, -2),
        new THREE.Vector3(-2, -1, -2),
        new THREE.Vector3(-1, -1, 2),
        new THREE.Vector3(1, 0, 2),
        new THREE.Vector3(0, 0.5, -3),
        new THREE.Vector3(-3, 0.5, -2.5),

        new THREE.Vector3(-3.5, 0, 1),
        new THREE.Vector3(-2.5, 0, 1),
        new THREE.Vector3(-2, 0, -1),
        new THREE.Vector3(-1, 0, -1),

    ];

    const path = new THREE.CatmullRomCurve3(this.points, true);

    const geometry = new THREE.TubeGeometry(path, 1000, 0.15, 16, true);

    const material = new THREE.MeshStandardMaterial({
      color: 0xCCCCCC, 
      roughness: 0.3, 
      metalness: 0.5, 
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }

  getPoints() {
    return this.points;
  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  update() {
    // Update code here
  }
}

export { MyCircuito };