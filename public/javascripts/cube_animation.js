class CubeAnimation {
  constructor() {
    this.cube;
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
    
      // // x-axis - slider
      // var sliderX = document.getElementById("accel-x-anime");
      // var outputX = document.getElementById("accel-x-val-anime");
      // outputX.innerHTML = sliderX.value;
      // sliderX.oninput = function () {
      //   outputX.innerHTML = this.value;
      //   setAngle(this.cube, 'x', this.value)
      // }
    
      // // y-axis - slider
      // var sliderY = document.getElementById("accel-y-anime");
      // var outputY = document.getElementById("accel-y-val-anime");
      // outputY.innerHTML = sliderY.value;
      // sliderY.oninput = function () {
      //   outputY.innerHTML = this.value;
      //   setAngle(this.cube, 'y', this.value)
      // }
    
      // // z-axis - slider
      // var sliderZ = document.getElementById("accel-z-anime");
      // var outputZ = document.getElementById("accel-z-val-anime");
      // outputZ.innerHTML = sliderZ.value;
      // sliderZ.oninput = function () {
      //   outputZ.innerHTML = this.value;
      //   setAngle(this.cube, 'z', this.value)
      // }
    
      renderer.render(scene, camera);
    };  
    animate();
  }

  // helper function (degree to radians) bc THREE uses radians (unit circle)
  setAngle(cube, axis, degree) {
    if(axis == 'x') {
      cube.rotation.x = degree * (Math.PI / 180)
    } else if(axis == 'y') {
      cube.rotation.y = degree * (Math.PI / 180)
    } else if(axis == 'z') {
      cube.rotation.z = degree * (Math.PI / 180)
    }
  }

  set(x, y, z) {
    this.cube.rotation.x = x * (Math.PI / 180)
    this.cube.rotation.x = y * (Math.PI / 180)
    this.cube.rotation.x = z * (Math.PI / 180)
  }
}

export {
  CubeAnimation
}

