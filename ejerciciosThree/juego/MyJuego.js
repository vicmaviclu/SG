import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { MyCircuito } from './MyCircuito.js'
import { MyPersonaje } from './MyPersonaje.js'
class MyJuego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    this.circuito = new MyCircuito(gui, titleGui); 
    this.circuito.scale.set(3,3,3);
    this.add(this.circuito);

    this.personaje = new MyPersonaje(gui, titleGui);
    this.add(this.personaje);
    this.personaje.scale.set(0.25, 0.25, 0.25);
    this.personaje.position.set(0,0.65,0);
    this.personaje.rotateY(Math.PI/3);

    this.points = this.circuito.getPoints();
    this.path = new THREE.CatmullRomCurve3(this.points, true);
    this.t = 0;


  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  update() {
    if (this.t > 1) this.t = 0;
  
    let position = this.path.getPointAt(this.t);
  
    // Calcular la tangente de la curva en este punto
    let tangent = this.path.getTangentAt(this.t).normalize();
  
    // Ajustar la posición del personaje
    this.personaje.position.copy(position.multiplyScalar(3)); // Escalar la posición por el mismo factor que el circuito
  
    // Hacer que el personaje mire en la dirección en la que se está moviendo
    this.personaje.lookAt(position.clone().add(tangent));
  
    // Mover el personaje 1.95 unidades en su eje Y local (0.65 * 3 para un circuito más grande)
    this.personaje.translateY(0.5);
    this.personaje.rotateY(Math.PI/2);
  
    // Incrementar this.t en 0.003 para que el personaje se mueva más rápido en un circuito más grande
    this.t += 0.0001;

  }
}

export { MyJuego };