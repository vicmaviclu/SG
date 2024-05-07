import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { MyCircuito } from './MyCircuito.js'
import { MyPersonaje } from './MyPersonaje.js'
import { MyOjoVolador } from './MyOjoVolador.js'

class MyJuego extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    this.circuito = new MyCircuito(gui, titleGui); 
    this.circuito.scale.set(3,3,3);
    this.add(this.circuito);

    this.personaje = new MyPersonaje(gui, titleGui);
    this.add(this.personaje);
    this.personaje.scale.set(0.1, 0.1, 0.1);
    this.personaje.position.set(0,0.65,0);
    this.personaje.rotateY(Math.PI/3);

    this.points = this.circuito.getPoints();
    this.path = new THREE.CatmullRomCurve3(this.points, true);
    this.t = 0;


    // Crear ojos voladores
    this.ojosVoladores = [];
    let scale = this.circuito.scale.x;
    for (let i = 0; i < this.points.length; i += 2) {
      let ojoVolador = new MyOjoVolador(gui, titleGui);
      ojoVolador.scale.set(0.25, 0.25, 0.25);
    
      let point = this.points[i];
      let yOffset = (i % 4 < 2) ? 0.25 : -0.35; // Modificado aquí
      let xOffset = (i % 2 === 1) ? 0.25 : -0.25;
      let zOffset = (i % 2 === 1) ? 0.25 : -0.25;
      ojoVolador.position.set((point.x + xOffset) * scale, (point.y + yOffset) * scale, (point.z + zOffset) * scale);
      this.ojosVoladores.push(ojoVolador);
      this.add(ojoVolador);
    }
  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  update() {
    this.t = this.t % 1;

  let position = this.path.getPointAt(this.t);

  let tangent = this.path.getTangentAt(this.t).normalize();

  this.personaje.position.copy(position.multiplyScalar(3)); 

  this.personaje.lookAt(position.clone().add(tangent));

  this.personaje.translateY(0.5);
  this.personaje.rotateY(Math.PI/2);

  this.t += 0.0005;

  for (let ojoVolador of this.ojosVoladores) {
    ojoVolador.update();
    ojoVolador.lookAt(this.personaje.position);
  }
  }
}

export { MyJuego };