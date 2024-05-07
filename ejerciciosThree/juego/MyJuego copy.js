import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { MyCircuito } from './MyCircuito.js'
import { MyEscudo } from './MyEscudo.js'
import { MyGasolina } from './MyGasolina.js'
import { MyOjoVolador } from './MyOjoVolador.js'
import { MyOvni } from './MyOvni.js'
import { MyPersonaje } from './MyPersonaje.js'
import { MyPinchos } from './MyPinchos.js'
import { MyReparar } from './MyReparar.js'

class MyJuego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    // Creación del circuito
    this.circuito = new MyCircuito(gui, titleGui); 
    this.circuito.scale.set(3,3,3);
    this.add(this.circuito);

    // Creación del personaje
    this.personaje = new MyPersonaje(gui, titleGui);
    this.add(this.personaje);
    this.personaje.scale.set(0.1, 0.1, 0.1);
    this.personaje.position.set(0, 0.5, 0);

    // Configuración del camino
    this.points = this.circuito.getPoints();
    this.path = new THREE.CatmullRomCurve3(this.points, true);
    this.t = 0;

    // Creación de los ojos voladores

    // Creación de los objetos

    // Configuración de la animación
    this.setupAnimation();
  }

  createGUI(gui, titleGui) {
    // Código de la GUI aquí
  }




  setupAnimation() {
    this.segmentos = 100;
    this.frenetFrames = this.path.computeFrenetFrames(this.segmentos, true);

    var origen = { t: 0 };
    var fin = { t: 1 };
    var tiempoDeRecorrido = 50000; // 50000 ms = 50 segundos

    // Animación: seguir un camino recto
    this.animacion = new TWEEN.Tween(origen).to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        this.t = origen.t;
    
        let position = this.path.getPointAt(this.t);
            
        let tangent = this.path.getTangentAt(this.t).normalize();
    
        this.personaje.position.copy(position.multiplyScalar(3)); 
        
        // Hacer que el personaje mire hacia el frente en la dirección del camino
        let lookAtPosition = position.clone().add(tangent);
        this.personaje.lookAt(lookAtPosition);

        this.personaje.translateY(0.47);
        this.personaje.rotateY(Math.PI / 2);
    });

    this.animacion.start();
}



  update(angle, keyPressed) {
    TWEEN.update();
    // Actualización de los ojos voladores


  }
}

export { MyJuego };