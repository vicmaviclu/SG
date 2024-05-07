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
    this.createOjosVoladores(gui, titleGui);

    // Creación de los objetos
    this.createObjetos(gui, titleGui);

    // Configuración de la animación
    this.setupAnimation();
  }

  createGUI(gui, titleGui) {
    // Código de la GUI aquí
  }

  createOjosVoladores(gui, titleGui) {
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
  }

  createObjetos(gui, titleGui) {
    this.objetos = [];
    let scale = this.circuito.scale.x;

    for (let i = 0; i < this.points.length; i += 2) {
      let point = this.points[i];
  
      // Crear un objeto diferente dependiendo del valor de i
      let objeto;
      switch (i % 3) {
        case 0:
          objeto = new MyReparar();
          break;
        case 1:
          objeto = new MyEscudo();
          break;
        case 2:
          objeto = new MyReparar();
          break;
      }
      // Establecer la misma escala para todos los objetos
      objeto.scale.set(0.25, 0.25, 0.25);
      // Posicionar el objeto
      objeto.position.set((point.x ) * scale, (point.y + 0.2) * scale, (point.z ) * scale);
    
      // Añadir el objeto a la escena y al array
      this.add(objeto);
      this.objetos.push(objeto);
    }
  }

  setupAnimation() {
    this.segmentos = 100;
    this.frenetFrames = this.path.computeFrenetFrames(this.segmentos, true);

    var origen = { t: 0 };
    var fin = { t: 1 };
    var tiempoDeRecorrido = 50000; // 4000 ms = 4 segundos

    // Primera animación: seguir un camino recto
    this.animacion = new TWEEN.Tween(origen).to(fin, tiempoDeRecorrido)
    .onUpdate(() => {
        this.t = origen.t;
    
        let position = this.path.getPointAt(this.t);
            
        let tangent = this.path.getTangentAt(this.t).normalize();
    
        this.personaje.position.copy(position.multiplyScalar(3)); 
        
        // Se mira en una dirección paralela al camino
        let lookAtPosition = position.clone().add(tangent);
        this.personaje.lookAt(lookAtPosition);
    
        this.personaje.translateY(0.47);
        this.personaje.rotateY(Math.PI/2);
    });

    this.animacion.start();
}



  update(angle, keyPressed) {
    TWEEN.update();
    // Actualización de los ojos voladores
    for (let i = 0; i < this.ojosVoladores.length; i++) {
      let ojoVolador = this.ojosVoladores[i];
      ojoVolador.update();
      ojoVolador.lookAt(this.personaje.position);
      if (i % 2 === 0) {
        ojoVolador.position.y += Math.sin(Date.now() * 0.005) * 0.025;
      } else {
        ojoVolador.position.z += Math.sin(Date.now() * 0.005) * 0.025;
      }
    }

    // Actualización de los objetos
    for (let i = 0; i < this.objetos.length; i++) {
      let objeto = this.objetos[i];
      objeto.update();
    }
  }
}

export { MyJuego };