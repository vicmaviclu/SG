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
      let yOffset = (i % 4 < 2) ? 0.3 : -0.30; 
      let xOffset = (i % 2 === 1) ? 0.25 : -0.25;
      ojoVolador.position.set((point.x + xOffset) * scale, (point.y + yOffset) * scale, (point.z ) * scale);
      this.ojosVoladores.push(ojoVolador);
      this.add(ojoVolador);
    }

    /************** OBJETOS ***************/
    this.objetos = [];

    let positions = [
      { x: 0, y: 0.43, z: 0 }, // Arriba
      { x: -0.43, y: 0, z: 0 }, // Izquierda
      { x: 0, y: -0.43, z: 0 }, // Abajo
      { x: 0.43, y: 0, z: 0 }  // Derecha
    ];
    
    for (let i = 1; i < this.points.length; i += 1) {
      let t = i / this.points.length;
      let point = this.path.getPointAt(t);
      let tangent = this.path.getTangentAt(t).normalize();
    
      let objeto;
      let randomValue = Math.random();
    
      if (randomValue < 0.50) { 
        let goodRandomValue = Math.random();
        if (goodRandomValue < 0.45) { // 44%
          objeto = new MyEscudo();
        } else if (goodRandomValue < 0.85) { // 40% 
          objeto = new MyReparar();
        } else { // 15% 
          objeto = new MyGasolina();
        }
      } else { 
        let badRandomValue = Math.random();
        if (badRandomValue < 0.50) { // 50% 
          objeto = new MyOvni();
        } else {  
          objeto = new MyPinchos();
          objeto.translateZ(-0.35);
          objeto.translateY(0.15);
        }
      }
    
      objeto.scale.set(0.2, 0.2, 0.2);
    
      // Añade un valor a la coordenada y para que el modelo esté por encima del tubo
      // Usa el módulo de i con 4 para rotar entre las cuatro posiciones cada dos objetos
      let positionIndex = Math.floor(i / 2) % 4;
    
      objeto.position.set(
        point.x * scale + positions[positionIndex].x,
        (point.y) * scale + positions[positionIndex].y,
        point.z * scale
      );
    
      if (positionIndex === 2) {
        objeto.rotateX(Math.PI);
      }
      if (positionIndex === 1) {
        objeto.rotateZ(Math.PI / 2);
      }
      if (positionIndex === 3) {
        objeto.rotateZ(-Math.PI / 2);
      }
    
      objeto.rotateY(Math.PI/2);
    
      this.objetos.push(objeto);
      this.add(objeto);
    }


    // Puntuacion
    this.puntuacion = 0;

    /***************** COLISIONES **********************/
    this.personajeBox = new THREE.Box3().setFromObject(this.personaje);
    var personajeBoxHelper = new THREE.Box3Helper(this.personajeBox, 0xffff00);
    this.add(personajeBoxHelper);
    for (let i = 0; i < this.objetos.length; i++) {
      let objeto = this.objetos[i];
      objeto.userData.box = new THREE.Box3().setFromObject(objeto);
      var boxHelper = new THREE.Box3Helper(objeto.userData.box, 0xffff00);
      this.add(boxHelper);
    }

    /****************** ANIMACION *********************/
    // Inicializar this.origen antes de llamar a this.setupAnimation();
    this.origen = { t: 0 };

    this.setupAnimation();

  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  getOjosVoladores() {
    return this.ojosVoladores;
  }

  removeOjoVolador(index) {
    this.remove(this.ojosVoladores[index]);
    this.ojosVoladores.splice(index, 1);
    console.log(this.ojosVoladores);
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

  update(teclaDerecha, teclaIzquierda, isThirdPersonCamera) {

    // Se actualiza la animacion del recorrido
    // Si se pulsa las teclas de direccion y esta en 3 persona gira
    TWEEN.update();
    if (!this.animacion.isPlaying()) {
        this.setupAnimation();
    }
    if(isThirdPersonCamera){
      this.personaje.update(teclaDerecha, teclaIzquierda);
    }

    // Movimiento de los ojos ////////////////////////////
    for (let i = 0; i < this.ojosVoladores.length; i++) {
      let ojoVolador = this.ojosVoladores[i];
      ojoVolador.update();
      ojoVolador.lookAt(this.personaje.position);
      if (i % 2 === 0) {
        ojoVolador.position.y += Math.sin(Date.now() * 0.005) * 0.025;
    }
    else {
        ojoVolador.position.z += Math.sin(Date.now() * 0.005) * 0.025;
    }
    }
    for (let i = 0; i < this.objetos.length; i++) {
      let objeto = this.objetos[i];
      objeto.update();
    }

    // Colisiones /////////////////////////////////////
    this.personajeBox.setFromObject(this.personaje);

    for (let i = 0; i < this.objetos.length; i++) {
      let objeto = this.objetos[i];
      if (this.personajeBox.intersectsBox(objeto.userData.box)) {
        console.log("Colisión");

        if(objeto instanceof MyGasolina){
          this.puntuacion += 3;
          console.log("Colision Gasolina");
          console.log("puntuacion: " + this.puntuacion);
        } else if(objeto instanceof MyOvni){
          this.puntuacion -= 5;
          console.log("Colision Ovni");
          console.log("puntuacion: " + this.puntuacion);
        }

        objeto.visible = false;

        this.objetos.splice(i, 1);
        i--;

        setTimeout(() => {
          objeto.visible = true;
          this.objetos.push(objeto);
        }, 5000);
      }
    }
  }

  
}

export { MyJuego };