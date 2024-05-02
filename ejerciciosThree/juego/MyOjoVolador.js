import * as THREE from '../libs/three.module.js'

class MyOjoVolador extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    // Ojo
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Blanco
    const eyeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.add(eye);

    // Pupila
    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Marrón
    const pupilGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.z = 0.25;
    eye.add(pupil);

    // Punto
    const puntoMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Negro
    const puntoGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const punto = new THREE.Mesh(puntoGeometry, puntoMaterial);
    punto.position.z = 0.4;
    pupil.add(punto);

    // Grupo del ojo
    this.eyeGroup = new THREE.Group();
    this.eyeGroup.add(eye);

    // Alas
    var alasMaterial = new THREE.MeshBasicMaterial({ color: 0x66666666 }); // Negro
    var shape = new THREE.Shape();
    shape.moveTo(0, 0.75); // Ajustado de 1.5 a 0.75
    shape.lineTo(0, 0);
    shape.bezierCurveTo(0, 0, 0.5, -0.5, 1, 0); // Ajustado de 1, -1, 2, 0 a 0.5, -0.5, 1, 0
    shape.lineTo(1, 0.75); // Ajustado de 2, 1.5 a 1, 0.75
    shape.lineTo(0.5, 1); // Ajustado de 1, 2 a 0.5, 1
    shape.lineTo(0, 0.75); // Ajustado de 0, 1.5 a 0, 0.75

    /* EXTRUDES */
    // Opciones de extrude de la base
    var optionsBase = {
        steps: 2,
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness : 0.1,
        bevelSize : 0.1,
        bevelOffset : 0,
        bevelSegments : 20,
    };

    /*GEOMETRIAS */
    // Base
    var geometriaBase = new THREE.ExtrudeGeometry(shape, optionsBase);
    this.alaD = new THREE.Mesh(geometriaBase, alasMaterial);
    this.alaD.position.x = 1.7;
    this.alaD.position.z = -0.5;
    this.alaD.rotateX(Math.PI/2);
    this.alaD.rotateZ(Math.PI/2);

    this.alaI = new THREE.Mesh(geometriaBase, alasMaterial);
    this.alaI.rotateX(Math.PI/2);
    this.alaI.rotateZ(-Math.PI/2);
    this.alaI.position.x = -1.7;
    this.alaI.position.z = 0.5;


    this.eyeGroup.add(this.alaD);
    this.eyeGroup.add(this.alaI);

    this.add(this.eyeGroup);
    this.p = 0 ;
    this.updateC = 0;
  }

  createGUI(gui, titleGui) {
    // GUI code here
  }

  update() {
    // Update code here
    this.updateC++;

    if (this.updateC % 3 === 0) {
      switch (this.p) {
        case 0: // Posición inicial
          this.alaD.rotateX(0.3);
          this.alaD.position.y += 0.3;
          this.alaI.rotateX(0.3); // Añadido para alaI
          this.alaI.position.y += 0.3; // Añadido para alaI
          this.p++;
          break;
        case 1: // Subiendo
          this.alaD.rotateX(-0.3);
          this.alaD.position.y -= 0.3;
          this.alaI.rotateX(-0.3); // Añadido para alaI
          this.alaI.position.y -= 0.3; // Añadido para alaI
          this.p++;
          break;
        case 2: // Volviendo a la posición inicial
          this.alaD.rotateX(-0.3);
          this.alaD.position.y -= 0.3;
          this.alaI.rotateX(-0.3); // Añadido para alaI
          this.alaI.position.y -= 0.3; // Añadido para alaI
          this.p++;
          break;
        case 3: // Bajando
          this.alaD.rotateX(0.3);
          this.alaD.position.y += 0.3;
          this.alaI.rotateX(0.3); // Añadido para alaI
          this.alaI.position.y += 0.3; // Añadido para alaI
          this.p = 0; // Vuelve al estado inicial después de bajar
          break;
      }
    }
  }
}

export { MyOjoVolador };