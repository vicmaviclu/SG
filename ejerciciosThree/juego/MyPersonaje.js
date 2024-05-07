import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

class MyPersonaje extends THREE.Object3D {
  constructor() {
    super();
    /* MATERIAL */
    var materialBase = new THREE.MeshPhongMaterial({color: 0xFF0000}); // Rojo para la base
    var materialEje = new THREE.MeshPhongMaterial({color: 0x000000}); // Negro para los ejes
    var materialRueda = new THREE.MeshPhongMaterial({color: 0x000000}); // Negro para las ruedas

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
    var base = new THREE.Mesh(geometriaBase, materialBase);

    // Ejes
    var ejeDelantero = new THREE.Mesh(geometriaEje, materialEje);
    var ejeTrasero = new THREE.Mesh(geometriaEje, materialEje);

    // Ruedas
    this.ruedaDelanteraIzquierda = new THREE.Mesh(geometriaRueda, materialRueda);
    this.ruedaDelanteraDerecha = new THREE.Mesh(geometriaRueda, materialRueda);
    this.ruedaTraseraIzquierda = new THREE.Mesh(geometriaRueda, materialRueda);
    this.ruedaTraseraDerecha = new THREE.Mesh(geometriaRueda, materialRueda);

    /* POSICIONES */
    // Ejes
    ejeDelantero.translateX(0.8);
    ejeTrasero.translateX(-0.8);

    // Ruedas
    this.ruedaDelanteraIzquierda.translateX(0.8);
    this.ruedaDelanteraIzquierda.translateZ(-0.5);
    this.ruedaDelanteraDerecha.translateX(0.8);
    this.ruedaDelanteraDerecha.translateZ(0.5);

    this.ruedaTraseraIzquierda.translateX(-0.8);
    this.ruedaTraseraIzquierda.translateZ(-0.5);
    this.ruedaTraseraDerecha.translateX(-0.8);
    this.ruedaTraseraDerecha.translateZ(0.5);

    /* THIS */
    this.coche = new THREE.Group();
    this.coche.add(base);
    this.coche.add(ejeDelantero);
    this.coche.add(ejeTrasero);
    this.coche.add(this.ruedaDelanteraIzquierda);
    this.coche.add(this.ruedaDelanteraDerecha);
    this.coche.add(this.ruedaTraseraIzquierda);
    this.coche.add(this.ruedaTraseraDerecha);

    this.add(this.coche);

    this.rotateY(Math.PI / 2);
  }

  update () {
    // Hacer que las ruedas giren
    this.ruedaDelanteraIzquierda.rotateX(0.5);
    this.ruedaDelanteraDerecha.rotateX(0.5);
    this.ruedaTraseraIzquierda.rotateX(0.5);
    this.ruedaTraseraDerecha.rotateX(0.5);
  }
}

export { MyPersonaje };