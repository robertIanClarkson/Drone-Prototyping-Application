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
  heading = Math.floor(heading)
  if(heading == userHeading){
    // hold
    socket.emit('tune', {offset: 0})
    $('#direction').text('HOLD')
  } else if(heading < (userHeading + 180)) {
    // turn CCW
    socket.emit('tune', {offset: 2})
    $('#direction').text('CCW')
  } else if(heading >= (userHeading + 180)) {
    // turn CW
    socket.emit('tune', {offset: -2})
    $('#direction').text('CW')
  }
}

export {
  setHeading,
  holdHeading
}