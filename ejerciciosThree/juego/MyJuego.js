import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { MyCircuito } from './MyCircuito.js'
import { MyPersonaje } from './MyPersonaje.js'
import { MyOjoVolador } from './MyOjoVolador.js'
import { MyGasolina } from './MyGasolina.js'
import { MyEscudo } from './MyEscudo.js'
import { MyReparar } from './MyReparar.js'
import { MyOvni } from './MyOvni.js'
import { MyPinchos } from './MyPinchos.js'


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
      let yOffset = (i % 4 < 2) ? 0.35 : -0.30; 
      let xOffset = (i % 2 === 1) ? 0.25 : -0.25;
      ojoVolador.position.set((point.x + xOffset) * scale, (point.y + yOffset) * scale, (point.z ) * scale);
      this.ojosVoladores.push(ojoVolador);
      this.add(ojoVolador);
    }

    this.objetos = [];

    for (let i = 0; i < this.points.length; i += 1) {
        let point = this.points[i];
    
        // Crear un objeto diferente dependiendo del valor de i
        let objeto;
        switch (i % 5) {
            case 0:
                objeto = new MyReparar();
                break;
            case 1:
                objeto = new MyEscudo();
                break;
            case 2:
                objeto = new MyReparar();
                break;
            case 3:
                objeto = new MyOvni();
                objeto.scale.set(0.5, 0.5, 0.5);
                break;
            case 4:
                objeto = new MyPinchos();
                break;
        }
        objeto.scale.set(0.25, 0.25, 0.25);
    
        // Posicionar el objeto alrededor del tubo
        objeto.position.set((point.x ) * scale, (point.y + 0.2) * scale, (point.z ) * scale);
    
        // Añadir el objeto a la escena y al array
        this.add(objeto);
        this.objetos.push(objeto);
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

    this.t += 0.00025;

    // Movimiento de los ojos
    for (let i = 0; i < this.ojosVoladores.length; i++) {
      let ojoVolador = this.ojosVoladores[i];
      ojoVolador.update();
      ojoVolador.lookAt(this.personaje.position);
      if (i % 2 === 0) {
        ojoVolador.position.y += Math.sin(Date.now() * 0.005) * 0.025;
    }
    // Si el índice es impar, mover en el eje Z
    else {
        ojoVolador.position.z += Math.sin(Date.now() * 0.005) * 0.025;
    }
    }
    for (let i = 0; i < this.objetos.length; i++) {
      let objeto = this.objetos[i];
      objeto.update();
    }
  }
}

export { MyJuego };