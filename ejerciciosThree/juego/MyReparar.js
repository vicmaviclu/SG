import * as THREE from '../libs/three.module.js'
import {CSG} from '../libs/CSG-v2.js'

 
class MyReparar extends THREE.Object3D {
  constructor() {
    super();
    /* MATERIAL */
    var materialMadera = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); 
    var materialMetal = new THREE.MeshStandardMaterial({ color: 0x808080 }); 
    materialMetal.metalness = 0.7; 
    materialMetal.roughness = 0.5; 
    

    /* GEOMETRIAS */
    // Martillo
    var cabezaMartilloGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.25);
    var mangoMartilloGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1, 32);
    var cajaGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.5);

    // Llave
    var cabezaLlaveGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
    var quitarGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
    var mangoLlaveGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.65, 32);

    /* POSICIONES */
    // Martillo
    cabezaMartilloGeometry.translate(0, 0.5, 0);
    cajaGeometry.rotateZ(Math.PI/4);
    cajaGeometry.translate(0.27, 0.4, 0);

    // Llave
    quitarGeometry.scale(1.2, 1, 0.6);
    quitarGeometry.translate(0.2, 0, 0);

    /* MESHES */
    // Martillo
    var cabezaMartilloMesh = new THREE.Mesh(cabezaMartilloGeometry, materialMetal);
    var mangoMartilloMesh = new THREE.Mesh(mangoMartilloGeometry, materialMadera);
    var cajaMesh = new THREE.Mesh(cajaGeometry, materialMetal);

    // Llave
    var cabezaLlaveMesh = new THREE.Mesh(cabezaLlaveGeometry, materialMetal);
    var quitarMesh = new THREE.Mesh(quitarGeometry, materialMetal);
    var mangoLlaveMesh = new THREE.Mesh(mangoLlaveGeometry, materialMetal);

    mangoLlaveMesh.rotateZ(Math.PI/2);

    /* CSG */
    // Martillo
    var csgCabezaMartillo = new CSG();
    csgCabezaMartillo.subtract([cabezaMartilloMesh, cajaMesh]);

    // Llave
    var csgCabezaLlave = new CSG();
    csgCabezaLlave.subtract([cabezaLlaveMesh, quitarMesh]);

    /* CSG TO MESH */
    // Martillo
    var meshCabezaMartillo = csgCabezaMartillo.toMesh();

    // Llave
    var meshCabezaLlave1 = csgCabezaLlave.toMesh();
    var meshCabezaLlave2 = csgCabezaLlave.toMesh();

    /* POSICIONES */
    meshCabezaLlave1.rotateY(Math.PI);
    meshCabezaLlave1.translateX(0.5);
    meshCabezaLlave1.scale.set(0.7, 0.7, 0.7);
    meshCabezaLlave2.translateX(0.5);
    meshCabezaLlave2.scale.set(0.7, 0.7, 0.7);

    /* GRUPOS */
    // Martillo
    var grupoMartillo = new THREE.Group();
    grupoMartillo.add(meshCabezaMartillo);
    grupoMartillo.add(mangoMartilloMesh);

    // Llave
    var grupoLlave = new THREE.Group();
    grupoLlave.add(meshCabezaLlave1);
    grupoLlave.add(meshCabezaLlave2);
    grupoLlave.add(mangoLlaveMesh);

    grupoLlave.rotateX(Math.PI/2);
    
    this.grupoReparar = new THREE.Group();
    this.grupoReparar.add(grupoMartillo);
    this.grupoReparar.add(grupoLlave);
    /* THIS */
    this.add(this.grupoReparar);
    
  }
  update () {
    // Actualización del objeto
    this.grupoReparar.rotation.y += 0.025;
  }
}

export { MyReparar };