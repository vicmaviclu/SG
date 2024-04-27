import * as THREE from '../libs/three.module.js'

import { MyCircuito } from './Juego.js'

class Juego extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

  }
  
  createGUI (gui,titleGui) {

  }

  update () {

  }
}

export { Juego };