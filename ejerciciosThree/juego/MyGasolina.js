import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

 
class MyGasolina extends THREE.Object3D {
  constructor() {
    super();
    /* MATERIAL */
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    /* CARGAR OBJETO */
    var objLoader = new OBJLoader();

    objLoader.load('../../models/gasolina/gascanhp.obj',
        (object) => {
            object.traverse( (child) => {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                }
            });
            this.add(object);
            this.userData.box = new THREE.Box3().setFromObject(this);
        });
  }
  
  update () {
    this.userData.box.setFromObject(this);
  }
}

export { MyGasolina };