import * as THREE from '../libs/three.module.js'

class MyOvni extends THREE.Object3D {
  constructor() {
    super();

    // Materiales
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080, 
      metalness: 0.5, 
      roughness: 0.25, 
    });

    const lightMaterial = new THREE.MeshBasicMaterial({color: 0xFFFF00});

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

    // Grupo del ojo
    this.ovni = new THREE.Group();
    this.ovni.add(mesh);
    this.ovni.add(luzAbajo_M);
    this.ovni.scale.set(0.5, 0.5, 0.5);
    this.add(this.ovni);
  }
  
  update () {
    // Actualización del objeto
    this.ovni.rotation.y += 0.01;
  }
}

export { MyOvni };