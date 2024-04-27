import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

 
class MyOvni extends THREE.Object3D {
  constructor() {
    super();
    
    // var materialLoader = new MTLLoader();
    // var objectLoader = new OBJLoader();
    // materialLoader.load('../models/ovni/ufo.mtl', 
    //     (materials) => {
    //         objectLoader.setMaterials(materials);
    //         objectLoader.load('../models/ovni/ufo.obj',
    //             (object) => {
    //                 this.add(object);
    //             }, null, null);
    //     }
    // );
    // this.position.x = 0;
    // this.position.y = -10;
    // this.position.z = 0;

    /* MATERIAL */
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    /* SHAPE */
    var shape = new THREE.Shape();
    shape.moveTo(0, -0.8);
    shape.quadraticCurveTo(1.7, -0.8, 1.7, 0);
    shape.lineTo(2, 0);
    shape.quadraticCurveTo(2, 0.9, 1.1, 0.9);
    shape.lineTo(1.1, 1);
    shape.lineTo(1, 1);
    shape.quadraticCurveTo(1, 2, 0, 2);

    /* GEOMETRY */
    var points = shape.getPoints();
    var geometry = new THREE.LatheGeometry(points, 32);

    /* MESH */
    var mesh = new THREE.Mesh(geometry, material);

    /* THIS */
    this.add(mesh);    
  }
  
  update () {

  }
}

export { MyOvni };