function setHeading(socket) {
  var slider = document.getElementById("set-heading");
  var output = document.getElementById("set-heading-val");
  output.innerHTML = slider.value;
  slider.onchange = function () {
    output.innerHTML = this.value;
    var data = {
      heading: this.value
    }
    socket.emit('set-heading', data)
  }
}

export {
  setHeading
}