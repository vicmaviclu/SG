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
    var geometriaPinchos = new THREE.ConeGeometry(0.2, 0.4, 32);

    /* MESHES */
    var pinchos = [];
    for(var i = 0; i < 4; i++){
      pinchos.push(new THREE.Mesh(geometriaPinchos, material));
    }
    /* POSICIONES */
    for(var i = 0; i < 4; i++){
      pinchos[i].position.set(0, 0, i*0.4);
    }

    /* THIS */
    for(var i = 0; i < pinchos.length; i++){
      this.add(pinchos[i]);
    }
    
  }
  
  createGUI (gui,titleGui) {

  }

  update () {

  }
}

export { MyPinchos };