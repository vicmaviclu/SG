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
      let yOffset = (i % 4 < 2) ? 0.35 : -0.30; 
      let xOffset = (i % 2 === 1) ? 0.25 : -0.25;
      ojoVolador.position.set((point.x + xOffset) * scale, (point.y + yOffset) * scale, (point.z ) * scale);
      this.ojosVoladores.push(ojoVolador);
      this.add(ojoVolador);
    }

    /************** PRUEBAS ***************/
    // let u = 0;
    // let point = this.path.getPointAt(u);
    // let tangent = this.path.getTangentAt(u);
    // // Vector arbitrario para la rotación
    // let arbitraryVector = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

    // let normal = new THREE.Vector3().crossVectors(tangent, arbitraryVector).normalize();
    // let tubeRadius = this.circuito.getRadio() * 3;
    // normal.multiplyScalar(tubeRadius);
    // let pointOnSurface = new THREE.Vector3().addVectors(point, normal);

    // // Punto Helper ////////////////
    // let geometry = new THREE.SphereGeometry(0.01, 32, 32);
    // let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // let puntoHelper = new THREE.Mesh(geometry, material);
    // puntoHelper.position.set(pointOnSurface.x, pointOnSurface.y, pointOnSurface.z);

    // this.add(puntoHelper);

    // // Objeto //////////////
    // let obj = new MyEscudo();
    // obj.scale.set(0.25, 0.25, 0.25);
    // obj.position.set(pointOnSurface.x, pointOnSurface.y, pointOnSurface.z);

    // let tangentPoint = new THREE.Vector3().addVectors(pointOnSurface, tangent);
    // obj.lookAt(tangentPoint);

    // let yAxis = obj.up;
    // let dotProduct = yAxis.dot(normal);
    // let angle = Math.acos(dotProduct);
    // if (pointOnSurface.x > 0) {
    //   angle = -angle;
    // }
    // obj.rotateOnWorldAxis(tangent, angle);

    // this.add(obj);

    // // Vectores Helper ////////////////
    // let tangentHelper = new THREE.ArrowHelper(tangent, pointOnSurface, 1, 0xff0000);
    // let normalHelper = new THREE.ArrowHelper(normal, pointOnSurface, 1, 0x00ff00);

    // let objYAxis = new THREE.Vector3().copy(obj.up);
    // let objYAxisHelper = new THREE.ArrowHelper(objYAxis, pointOnSurface, 1, 0x0000ff);

    // this.add(objYAxisHelper);
    // this.add(tangentHelper);
    // this.add(normalHelper);


    /************** OBJETOS ***************/
    this.objetos = [];

    let radio = this.circuito.getRadio();
    for (let i = 0; i < this.points.length; i += 2) {
      let t = i / this.points.length;
      let point = this.path.getPointAt(t);

      let objeto;
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          objeto = new MyGasolina();
          break;
        case 1:
          objeto = new MyEscudo();
          break;
        case 2:
          objeto = new MyReparar();
          break;
        case 3:
          objeto = new MyOvni();
          break;
        case 4:
          objeto = new MyPinchos();
          
          break;
      }
      objeto.scale.set(0.25, 0.25, 0.25);
        
      objeto.position.set(point.x * scale, (point.y + radio) * scale, point.z * scale);
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

  update(teclaDerecha, teclaIzquierda) {
    // Actualización del juego aquí
    TWEEN.update();
    if (!this.animacion.isPlaying()) {
        this.setupAnimation();
    }
    this.personaje.update(teclaDerecha, teclaIzquierda);

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

    // Colisiones
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