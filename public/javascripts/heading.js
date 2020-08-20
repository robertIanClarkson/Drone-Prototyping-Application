var userHeading = 0;

function setHeading(socket) {
  var slider = document.getElementById("set-heading");
  var output = document.getElementById("set-heading-val");
  output.innerHTML = slider.value;
  slider.onchange = function () {
    output.innerHTML = this.value;
    userHeading = this.value;
  }
}

function holdHeading(socket, heading) {
  if(heading < (userHeading + 180)) {
    // turn CCW
    socket.emit('tune', {offset: 69})
    $('#direction').text('CCW')
  } else if(heading > (userHeading + 180)) {
    // turn CW
    socket.emit('tune', {offset: 67})
    $('#direction').text('CW')
  } else {
    // hold
    socket.emit('tune', {offset: 68})
    $('#direction').text('HOLD')
  }
}

export {
  setHeading,
  holdHeading
}