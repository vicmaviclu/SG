import * as THREE from '../libs/three.module.js'
 
class Juego extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

  }
  
  createGUI (gui,titleGui) {

  }

  update () {

  }
}

export { Juego };