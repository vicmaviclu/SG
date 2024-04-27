import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

 
class MyOvni extends THREE.Object3D {
  constructor() {
    super();
    
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('ovni/ufo.mtl', 
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('ovni/ufo.obj',
                (object) => {
                    this.add(object);
                }, null, null);
        });
    
  }
  
  update () {

  }
}

export { MyOvni };