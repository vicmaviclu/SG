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

    this.personaje = new MyPersonaje(gui, titleGui);
    this.add(this.personaje);

    this.points = this.circuito.getPoints();
    this.path = new THREE.CatmullRomCurve3(this.points, true);
    this.t = 0;

    // Inicializar this.origen antes de llamar a this.setupAnimation();
    this.origen = { t: 0 };

    // Creación de los objetos
    this.setupAnimation();
  }

  createGUI(gui, titleGui) {
    // Código de la GUI aquí
  }

  setupAnimation() {
    this.segmentos = 500;
    this.frenetFrames = this.path.computeFrenetFrames(this.segmentos, true);

    var fin = { t: this.origen.t + 0.00001 }; 
    var tiempoDeRecorrido = 0.005; 

    // Animación: seguir un camino recto
    this.animacion = new TWEEN.Tween(this.origen).to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        this.t = this.origen.t;

    
        let position = this.path.getPointAt(this.t);
            
        let tangent = this.path.getTangentAt(this.t).normalize();
    
        this.personaje.position.copy(position.multiplyScalar(3)); 
        
        // Hacer que el personaje mire hacia el frente en la dirección del camino
        let lookAtPosition = position.clone().add(tangent);
        this.personaje.lookAt(lookAtPosition);

        this.personaje.rotateY(Math.PI / 1.75);  
    })    
    .onComplete(() => {
      if (this.origen.t > 0.999) {
          this.origen.t = 0;
      } else {
          this.origen.t += 0.0001; 
      }
    });
    this.animacion.start();
  }

  update(teclaDerecha, teclaIzquierda) {
    // Actualización del juego aquí
    TWEEN.update();
    if (!this.animacion.isPlaying()) {
        this.setupAnimation();
    }
    this.personaje.update(teclaDerecha, teclaIzquierda);
  }
}

export { MyJuego };