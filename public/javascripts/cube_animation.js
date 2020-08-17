class CubeAnimation {
  constructor() {
    this.cube;
    this.rollF = 0;
    this.pitchF = 0;
  }

  init() {
    var container = document.getElementById('cube-anime');
  
    // scene - main object
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    // camera - where you are viewing from
    var camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientWidth, 1, 2000); // see THREE doc
    camera.position.set(5, 5, 5); // location of camera relative to origin - xyz
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // look at origin 
    
    // render
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientWidth);
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement); // canvas added to html here
    
    // axis - xyz lines
    scene.add(new THREE.AxesHelper(3));
    
    // Init a group
    this.cube = new THREE.Group();
    
    // cube - mesh
    var geometry = new THREE.BoxGeometry(3, 3, 3); // 3x3x3 cube
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // color = black
    var mesh = new THREE.Mesh(geometry, material); // cube instance
    this.cube.add(mesh); // add black cube to group
    
    // edges - outline
    var edges = new THREE.EdgesGeometry(geometry); // get edges of cube
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff00ff })); // color = magenta
    this.cube.add(line); // add magenta edges to group
    
    scene.add(this.cube);
    
    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };  
    animate();
  }

  set(roll, pitch) {
    this.cube.rotation.x = roll;
    this.cube.rotation.z = pitch;    
  }
}

export {
  CubeAnimation
}

