
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto

import { MyJuego} from './MyJuego copy.js'
import { MyOjoVolador } from './MyOjoVolador.js'


 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    this.initStats();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera1 ();
    this.createCamera2 ();

    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
  
    
    // Un suelo 
    this.createGround ();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.axis = new THREE.AxesHelper (1.5);
    this.add (this.axis);
    
    
    /*** IMPORTACIONES DE MODELOS  ***/
    

    this.model = new MyJuego();
    this.add(this.model);
    

  // Picking
  this.raycaster = new THREE.Raycaster();
  this.mouse = new THREE.Vector2();

  window.addEventListener('click', (event) => {
    // Actualizar las coordenadas del ratón
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualizar el rayo del raycaster
    this.raycaster.setFromCamera(this.mouse, this.getCamera());

    // Obtener los ojos voladores desde MyJuego
    let ojosVoladores = this.model.getOjosVoladores();

    // Obtener los objetos que intersectan con el rayo
    let intersects = this.raycaster.intersectObjects(ojosVoladores, true);
    console.log("Intersects: ", intersects);

    // Si hay alguna intersección
    if (intersects.length > 0) {
      // Obtener el primer objeto que intersecta
      let firstObject = intersects[0].object;
      // Buscar el objeto MyOjoVolador padre
      while (firstObject.parent && !(firstObject instanceof MyOjoVolador)) {
        firstObject = firstObject.parent;
      }
      console.log("First object: ", firstObject);

      // Encontrar el índice del objeto en el array de ojos voladores
      let index = ojosVoladores.indexOf(firstObject);
      console.log("Index: ", index);

      // Si el objeto está en el array (index != -1), eliminarlo
      if (index !== -1) {
        this.model.removeOjoVolador(index);
      }
    }
  }, false);

    this.isThirdPersonCamera = false;
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.isThirdPersonCamera = !this.isThirdPersonCamera;
      }
    });

    this.angle = 0;
    this.keyPressed = false;
    
    window.addEventListener('keydown', (event) => {
      if (!this.keyPressed) {
        switch (event.key) {
          case 'ArrowLeft':
            this.angle -= 5;
            this.keyPressed = true;
            break;
          case 'ArrowRight':
            this.angle += 5;
            this.keyPressed = true;
            break;
        }
      }
    });
    
    window.addEventListener('keyup', function(event) {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          this.keyPressed = false;
          break;
      }
    });
  }

  initStats() {
  
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }
  
  createCamera1 () {
      // Crear camera1
      this.camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
      this.camera1.position.set (0, 5, 7);
      var look1 = new THREE.Vector3 (0,1.5,0);
      this.camera1.lookAt(look1);
      this.add (this.camera1);
      this.cameraControl1 = new TrackballControls (this.camera1, this.renderer.domElement);
      this.cameraControl1.rotateSpeed = 5;
      this.cameraControl1.zoomSpeed = -2;
      this.cameraControl1.panSpeed = 0.5;
      this.cameraControl1.target = look1;

  }

  createCamera2 () {
// En el método de creación de la cámara
this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
this.add (this.camera2);
  }
  
  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (10,0.2,10);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    //this.add (ground);
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower : 500.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity : 0.5,   
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.PointLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.add (this.pointLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.isThirdPersonCamera ? this.camera2 : this.camera1;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera1.aspect = ratio;
    this.camera2.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera1.updateProjectionMatrix();
    this.camera2.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl1.update();
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Se actualiza el resto del modelo
    this.model.update(this.angle, this.keyPressed);

  
    // Camara /////////////////////////
    this.updateCamera2Position();
    this.renderer.render (this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }

  updateCamera2Position() {
    let tangent = this.model.path.getTangentAt(this.model.t).normalize();
    let cameraOffset = tangent.clone().multiplyScalar(-0.5); 
    cameraOffset.y += 0.1; 
    let cameraPosition = new THREE.Vector3().addVectors(this.model.personaje.position, cameraOffset);
    this.camera2.position.copy(cameraPosition);
    let lookAtPosition = this.model.personaje.position.clone();
    lookAtPosition.y += 0.15;
    this.camera2.lookAt(lookAtPosition);
}

}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
