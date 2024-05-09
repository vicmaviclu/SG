import * as THREE from '../libs/three.module.js'
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
            object.scale.set(0.25, 0.25, 0.25);
            this.add(object);
            this.userData.box = new THREE.Box3().setFromObject(this);
        });
    
  }
  
  update () {
    this.userData.box.setFromObject(this);
  }
}

export { MyGasolina };