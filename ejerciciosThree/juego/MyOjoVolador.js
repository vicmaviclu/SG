import * as THREE from '../libs/three.module.js'

class MyOjoVolador extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    
  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  update() {
    // Update code here
  }
}

export { MyOjoVolador };