import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class MyPinchos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    /* MATERIAL */
    var loader = new THREE.TextureLoader();
    var metalTextura = loader.load('../../texturas/metal.jpg');
    var material = new THREE.MeshStandardMaterial({ map: metalTextura }); // Color gris
    material.metalness = 0.7;

    /* GEOMETRY */
    var radio = 0.2; 
    var geometriaPinchos = new THREE.ConeGeometry(radio, 0.2, 32); 

    /* MESHES */
    var pinchos = [];
    var largo = 3; 
    var ancho = 3;
    
    for(var i = 0; i < largo; i++){
      for(var j = 0; j < ancho; j++){
        var pincho = new THREE.Mesh(geometriaPinchos, material);
        pincho.position.set(i*(radio+radio), 0.1, j*(radio+radio));
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