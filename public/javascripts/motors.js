/* MOTOR FUNCTIONS */
/* Listens for 'motor on' commands from client */
function motorOn(socket) {
  $('#on-universal').click(event => {
    socket.emit('motor-on', { motor: 0 })
    socket.emit('motor-on', { motor: 1 })
  })
  $('#on-0').click(event => {
    socket.emit('motor-on', { motor: 0 })
  })
  $('#on-1').click(event => {
    socket.emit('motor-on', { motor: 1 })
  })
}

/* Listens for 'motor off' commands from client */
function motorOff(socket) {
  $('#off-universal').click(event => {
    socket.emit('motor-off', { motor: 0 })
    socket.emit('motor-off', { motor: 1 })
  })
  $('#off-0').click(event => {
    socket.emit('motor-off', { motor: 0 })
  })
  $('#off-1').click(event => {
    socket.emit('motor-off', { motor: 1 })
  })
}

/* Listens for 'adjust-speed' commands from client */
function adjustSpeed(socket) {
  // SLIDER--> Motor-0
  var slider0 = document.getElementById("speed-0");
  var output0 = document.getElementById("speedValue-0");
  output0.innerHTML = slider0.value;
  slider0.onchange = function () {
    output0.innerHTML = this.value;
    var data_0 = {
      motor: 0,
      speed: this.value
    }
    socket.emit('adjust-speed', data_0)
  }

  // SLIDER--> Motor-1
  var slider1 = document.getElementById("speed-1");
  var output1 = document.getElementById("speedValue-1");
  output1.innerHTML = slider1.value;
  slider1.onchange = function () {
    output1.innerHTML = this.value;
    var data_1 = {
      motor: 1,
      speed: this.value
    }
    socket.emit('adjust-speed', data_1)
  }
}

/* Listens to tune crossfade slider --> makes one motor faster than the other */
function tune(socket) {
  // SLIDER--> Crossfade
  var crossfade = document.getElementById("crossfade");
  var output_crossfade = document.getElementById("crossfade-value");
  output_crossfade.innerHTML = 0;
  crossfade.onchange = function () {
    if (this.value <= 68) {
      output_crossfade.innerHTML = this.value;
    } else {
      output_crossfade.innerHTML = `+${this.value}`;
    }
    var data = {
      offset: this.value
    }
    socket.emit('tune', data)
  }
}

/* Listens to the coupled speed slider --> Treats both motors as one motor */
function coupled(socket) {
  // SLIDER--> coupled motors
  var coupled_slider = document.getElementById("coupled");
  var output_coupled = document.getElementById("coupled-value");
  output_coupled.innerHTML = coupled_slider.value;
  coupled_slider.onchange = function () {
    output_coupled.innerHTML = this.value;
    socket.emit('adjust-speed', {
      motor: 0,
      speed: this.value
    })
    socket.emit('adjust-speed', {
      motor: 1,
      speed: this.value
    })
  }
}

export {
  motorOn,
  motorOff,
  adjustSpeed,
  tune,
  coupled
};