import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'


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

    // Aleron
    var geometriaCilindro = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    var geometriaCaja = new THREE.BoxGeometry(1, 0.4, 0.25);
    var geometriaPlancha = new THREE.PlaneGeometry(1, 0.26);
    var geometriaCaja2 = new THREE.BoxGeometry(0.8, 0.3, 0.3);

    const materialPlancha = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide});

    var cilindro = new THREE.Mesh(geometriaCilindro, materialRueda);
    var caja = new THREE.Mesh(geometriaCaja, materialRueda);
    var caja2 = new THREE.Mesh(geometriaCaja2, materialRueda);
    this.plancha1 = new THREE.Mesh(geometriaPlancha, materialPlancha);

    cilindro.position.set(0, 0.5, 0); 
    caja.position.set(0, 0.9, 0); 
    caja2.position.copy(caja.position); 
    this.plancha1.position.set(0, 0.9, 0); 

    this.plancha1.rotateY(Math.PI / 2);

    var csg = new CSG();
    csg.union([cilindro, caja]);
    csg.subtract([caja2]);

    var pieza = csg.toMesh();
    pieza.rotateY(Math.PI / 2);

    this.aleron = new THREE.Group();
    this.aleron.add(cilindro);
    this.aleron.add(pieza);
    this.aleron.add(this.plancha1);
    this.aleron.position.set(1, -0.2, 0); 
    this.aleron.scale.set(0.75, 0.75, 0.75); 

    /* THIS */
    this.coche = new THREE.Group();
    this.coche.add(base);
    this.coche.add(ejeDelantero);
    this.coche.add(ejeTrasero);
    this.coche.add(this.ruedaDelanteraIzquierda);
    this.coche.add(this.ruedaDelanteraDerecha);
    this.coche.add(this.ruedaTraseraIzquierda);
    this.coche.add(this.ruedaTraseraDerecha);
    this.coche.add(this.aleron);

    // CAMARA EN TERCERA PERSONA
    this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera2.position.set (3, 1, 0.05);
    this.camera2.lookAt(0, 0.9, 0);
    this.coche.add (this.camera2);

    this.add(this.coche);
    this.coche.position.set(0, 0.46, 0);
    this.coche.rotateY(-0.3);
    this.coche.scale.set(0.05, 0.05, 0.05);

    this.origen = { angle: Math.PI / 2 }; 
  }

  setupRotationAnimationDerecha() {
    var radio = 0.46; 
    var fin = { angle: this.origen.angle + 2 * (Math.PI / 180) }; 
    var tiempoDeRecorrido = 5; 

      var centro = new THREE.Vector3(
          this.coche.position.x,
          this.coche.position.y - radio * Math.sin(this.origen.angle),
          this.coche.position.z - radio * Math.cos(this.origen.angle)
      );

    this.rotacionAnimacion = new TWEEN.Tween(this.origen).to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        let angle = this.origen.angle;
        this.currentAngle = angle;

        let posicionTubo = new THREE.Vector3(
            centro.x,
            centro.y + radio * Math.sin(angle),
            centro.z + radio * Math.cos(angle)
        );

        // Actualizar la posición del coche
        this.coche.position.copy(posicionTubo);
        this.coche.rotateX(-2 * Math.PI / 180);

                
    });
    this.rotacionAnimacion.start();
  }
  setupRotationAnimationIzquierda() {
    var radio = 0.46; 
    var fin = { angle: this.origen.angle - 2 * (Math.PI / 180) }; 
    var tiempoDeRecorrido = 5; 

    var centro = new THREE.Vector3(
        this.coche.position.x,
        this.coche.position.y - radio * Math.sin(this.origen.angle),
        this.coche.position.z - radio * Math.cos(this.origen.angle)
    );

    this.rotacionAnimacion = new TWEEN.Tween(this.origen).to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        let angle = this.origen.angle;

        let posicionTubo = new THREE.Vector3(
            centro.x,
            centro.y + radio * Math.sin(angle),
            centro.z + radio * Math.cos(angle)
        );

        // Actualizar la posición del coche
        this.coche.position.copy(posicionTubo);
        this.coche.rotateX(2 * Math.PI / 180);
                
    });
    this.rotacionAnimacion.start();
  }
  
  update (teclaDerecha, teclaIzquierda) {
    // Hacer que las ruedas giren
    this.ruedaDelanteraIzquierda.rotateZ(0.5);
    this.ruedaDelanteraDerecha.rotateZ(0.5);
    this.ruedaTraseraIzquierda.rotateZ(0.5);
    this.ruedaTraseraDerecha.rotateZ(0.5);

    TWEEN.update();
    if(teclaDerecha && (!this.rotacionAnimacion || !this.rotacionAnimacion.isPlaying())){
      this.setupRotationAnimationDerecha();
      teclaDerecha = false;
    }
    if(teclaIzquierda && (!this.rotacionAnimacion || !this.rotacionAnimacion.isPlaying())){
      this.setupRotationAnimationIzquierda();
      teclaIzquierda = false;
    }

    // Mover todo el grupo aleron un poco en el eje Y
    var time = Date.now() * 0.001;

    // Mover aleron y plancha1 suavemente
    this.aleron.rotation.y = Math.sin(time) * 0.5;
    this.plancha1.rotateX(Math.sin(time) * 0.015);
  }
  
}

export { MyPersonaje };