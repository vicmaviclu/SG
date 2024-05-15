import * as THREE from '../libs/three.module.js'

class MyOvni extends THREE.Object3D {
  constructor() {
    super();

    // Materiales
    var loader = new THREE.TextureLoader();
    var textura = loader.load('../../texturas/aluminio.jpg');
    const material = new THREE.MeshStandardMaterial({
      color: 0xC0C0C0, 
      map: textura,
      metalness: 0.5, 
      roughness: 0.25, 
    });

    const lightMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});

    // Geometría OVNI
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.8);
    shape.quadraticCurveTo(1.7, -0.8, 1.7, 0);
    shape.lineTo(2, 0);
    shape.quadraticCurveTo(2, 0.9, 1.1, 0.9);
    shape.lineTo(1.1, 1);
    shape.lineTo(1, 1);
    shape.quadraticCurveTo(1, 2, 0, 2);

    const points = shape.getPoints();
    const geometry = new THREE.LatheGeometry(points, 32);

    // Geometría Luz
    const lightGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);

    // Meshes
    const mesh = new THREE.Mesh(geometry, material);

    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.y = 0.82;
      lightMesh.position.x = 1.5 * Math.cos(angle);
      lightMesh.position.z = 1.5 * Math.sin(angle);
      mesh.add(lightMesh);
    }

    const luzAbajo = new THREE.CylinderGeometry(0.75, 0.75, 0.01, 32);
    const luzAbajo_M = new THREE.Mesh(luzAbajo, lightMaterial);
    luzAbajo_M.position.y = -0.76;

    // Grupo del ovni
    this.ovni = new THREE.Group();
    this.ovni.add(mesh);
    this.ovni.add(luzAbajo_M);
    this.ovni.scale.set(0.25, 0.25, 0.25);

    this.ovni.translateY(0.35);

    /* LUZ */
    this.luz = new THREE.PointLight(0x00ff00, 1, 10);
    this.luz.position.set(0, 0, 0);
    this.ovni.add(this.luz);

    this.encendido = true;

    this.add(this.ovni);
  }
  
  update () {
    this.ovni.rotation.y += 0.01;

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

export { MyOvni };