import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class MyEscudo extends THREE.Object3D {
  constructor() {
    super();
    /* MATERIAL */
    var loader = new THREE.TextureLoader();
    var textura = loader.load('../../texturas/grietas.jpg');
    textura.wrapS = THREE.RepeatWrapping;
    textura.wrapT = THREE.RepeatWrapping;
    textura.repeat.set(2,2);
    var material = new THREE.MeshStandardMaterial({
      color: 0x666666,
      map: textura,
      bumpMap: textura,
      bumpScale: 1
    });

    /* SHAPES */
    // Shape de la base 
    var shape = new THREE.Shape();
    shape.moveTo(0, 1.5); 
    shape.lineTo(0, 0);
    shape.bezierCurveTo(0, 0, 1, -1, 2, 0);
    shape.lineTo(2, 1.5); 
    shape.lineTo(1, 2); 
    shape.lineTo(0, 1.5); 

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
    var escudo_mesh = new THREE.Mesh(geometriaBase, material);

    var geometriaBase2 = new THREE.ExtrudeGeometry(shape, optionsBase);
    geometriaBase2.scale(0.85,0.9,0.85);
    geometriaBase2.translate(0.135,0.1,0.05);
    var escudo_mesh2 = new THREE.Mesh(geometriaBase2, material);


    var material_logo = new THREE.MeshStandardMaterial();
    material_logo.color.set(0xff0000);


    var shape_logo = new THREE.Shape();
    shape_logo.moveTo(0, 0);
    shape_logo.lineTo(0.2, 0);
    shape_logo.lineTo(0.35, 0.4);
    shape_logo.bezierCurveTo(0.35, 0.4, 0.4, 0.43, 0.5, 0.45);
    shape_logo.lineTo(1, 0.45);
    shape_logo.lineTo(1.2, 0.65);
    shape_logo.lineTo(0.4, 0.65);
    shape_logo.bezierCurveTo(0.4, 0.65, 0.35, 0.63, 0.2, 0.5);
    shape_logo.lineTo(0, 0);

    var optionsLogo = {
        steps: 2,
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness : 0.001,
        bevelSize : 0.001,
        bevelOffset : 0,
        bevelSegments : 20,
    };

    var geometriaLogo = new THREE.ExtrudeGeometry(shape_logo, optionsLogo);
    geometriaLogo.translate(0.2, 0.7, 0.5);

    var geometriaLogo2 = new THREE.ExtrudeGeometry(shape_logo, optionsLogo);
    geometriaLogo2.translate(0.65, 1.06, 0.62);
    geometriaLogo2.scale(0.65,0.65,0.8);

    var logo = new THREE.Mesh(geometriaLogo, material_logo);

    var logo2 = new THREE.Mesh(geometriaLogo2, material_logo);

    var shape_logo = new THREE.Shape();
    shape_logo.moveTo(0, 0);
    shape_logo.lineTo(0.25, 0);
    shape_logo.lineTo(0.65, 0.6);
    shape_logo.lineTo(0.35, 0.6);
    shape_logo.lineTo(-0.1, 0);

    var geometriaLogo = new THREE.ExtrudeGeometry(shape_logo, optionsLogo);
    geometriaLogo.translate(1.08, 0.74, 0.5);

    var logo3 = new THREE.Mesh(geometriaLogo, material_logo);

    var group_logo = new THREE.Group();
    group_logo.add(logo);
    group_logo.add(logo2);
    group_logo.add(logo3);

    group_logo.translateZ(-0.35);
    group_logo.translateY(-0.22);
    group_logo.translateX(0.04);

    this.group = new THREE.Group();
    this.group.add(escudo_mesh);
    this.group.add(escudo_mesh2);
    this.group.add(group_logo);

    this.group.scale.set(0.75,0.75,0.75);

    this.group.translateX(-0.8);
    this.group.translateY(0.43);

    this.group.scale.set(0.5,0.5,0.5);

    /* LUCES */
    this.luz = new THREE.PointLight(0xff0000, 1, 10);
    this.luz.position.set(0, 0.1, 0);
    this.group.add(this.luz);

    this.encendido = true;

    this.add(this.group);

  }

  update () {
    if (this.encendido) {
      this.luz.intensity -= 0.002;
      if (this.luz.intensity <= 0) {
        this.encendido = false;
      }
    }
    else {
      this.luz.intensity += 0.002;
      if (this.luz.intensity >= 1) {
        this.encendido = true;
      }
    }
  }
}

export { MyEscudo };