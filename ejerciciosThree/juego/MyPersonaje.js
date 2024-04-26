import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class MyPersonaje extends THREE.Object3D {
  constructor() {
    super();
    /* MATERIAL */
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    /* SHAPES */
    // Shape de la base 
    var shapeBase = new THREE.Shape();
    shapeBase.moveTo(1.2, 0.1); 
    shapeBase.quadraticCurveTo(1.5, 0, 1.2, -0.1); 
    shapeBase.lineTo(0.3, -0.3); 
    shapeBase.quadraticCurveTo(0, -0.35, -0.3, -0.3); 
    shapeBase.lineTo(-1.2, -0.1); 
    shapeBase.quadraticCurveTo(-1.5, 0, -1.2, 0.1); 
    shapeBase.lineTo(-0.3, 0.3); 
    shapeBase.quadraticCurveTo(0, 0.35, 0.3, 0.3); 

    /* EXTRUDES */
    // Opciones de extrude de la base
    var optionsBase = {
        steps: 2,
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness : 0.1,
        bevelSize : 0.1,
        bevelOffset : 0,
        bevelSegments : 10,
    };

    /*GEOMETRIAS */
    // Base
    var geometriaBase = new THREE.ExtrudeGeometry(shapeBase, optionsBase);
    geometriaBase.rotateX(Math.PI / 2);

    // Ejes
    var geometriaEje = new THREE.CylinderGeometry(0.04, 0.04, 0.85 , 32);
    geometriaEje.rotateX(Math.PI / 2);

    // Ruedas
    var geometriaRueda = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    geometriaRueda.rotateX(Math.PI / 2);

    /* MESHES */
    // Base
    var base = new THREE.Mesh(geometriaBase, material);

    // Ejes
    var ejeDelantero = new THREE.Mesh(geometriaEje, material);
    var ejeTrasero = new THREE.Mesh(geometriaEje, material);

    // Ruedas
    var ruedaDelanteraIzquierda = new THREE.Mesh(geometriaRueda, material);
    var ruedaDelanteraDerecha = new THREE.Mesh(geometriaRueda, material);
    var ruedaTraseraIzquierda = new THREE.Mesh(geometriaRueda, material);
    var ruedaTraseraDerecha = new THREE.Mesh(geometriaRueda, material);

    /* POSICIONES */
    // Ejes
    ejeDelantero.translateX(0.8);
    ejeTrasero.translateX(-0.8);

    // Ruedas
    ruedaDelanteraIzquierda.translateX(0.8);
    ruedaDelanteraIzquierda.translateZ(-0.5);
    ruedaDelanteraDerecha.translateX(0.8);
    ruedaDelanteraDerecha.translateZ(0.5);

    ruedaTraseraIzquierda.translateX(-0.8);
    ruedaTraseraIzquierda.translateZ(-0.5);
    ruedaTraseraDerecha.translateX(-0.8);
    ruedaTraseraDerecha.translateZ(0.5);

    /* THIS */
    this.add(base);
    this.add(ejeDelantero);
    this.add(ejeTrasero);
    this.add(ruedaDelanteraIzquierda);
    this.add(ruedaDelanteraDerecha);
    this.add(ruedaTraseraIzquierda);
    this.add(ruedaTraseraDerecha);

    this.rotateY(Math.PI / 2);
  }

  update () {

  }
}

export { MyPersonaje };