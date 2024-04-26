import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class MyPinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    /* MATERIAL */
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    /* GEOMETRY */
    var geometriaPinchos = new THREE.ConeGeometry(0.1, 0.3, 32);

    /* MESHES */
    var pincho1 = new THREE.Mesh(geometriaPinchos, material);
    
    /* POSICIONES */
    pincho1.position.set(0, 0, 0);

    /* THIS */
    this.add(pincho1);
    
  }
  
  createGUI (gui,titleGui) {

  }

  update () {

  }
}

export { MyPinchos };