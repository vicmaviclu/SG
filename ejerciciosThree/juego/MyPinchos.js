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
    var radio = 0.2;
    var geometriaPinchos = new THREE.ConeGeometry(radio, 0.4, 32);

    /* MESHES */
    var pinchos = [];
    var largo = 5;
    var ancho = 4;
    
    for(var i = 0; i < largo; i++){
      for(var j = 0; j < ancho; j++){
        var pincho = new THREE.Mesh(geometriaPinchos, material);
        pincho.position.set(i*(radio+radio), 0, j*(radio+radio));
        pinchos.push(pincho);
      }
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