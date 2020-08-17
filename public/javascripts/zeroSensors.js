function zeroAccel(socket) {
  $('#zero-accel-xy').click(event => {
    socket.emit('zero-accel-xy', {})
  })

  $('#zero-accel-z').click(event => {
    socket.emit('zero-accel-z', {})
  })

  $('#zero-accel-clear').click(event => {
    socket.emit('zero-accel-clear', {})
  })
}

function zeroCompass(socket) {
  $('#zero-compass').click(event => {
    socket.emit('zero-compass', {})
    $('#zero-compass').addClass('disabled')
    $('#zero-compass-clear').addClass('disabled')
    setTimeout(function () {
      $('#zero-compass').removeClass('disabled')
      $('#zero-compass-clear').removeClass('disabled')
    }, 5000);
  })

  $('#zero-compass-clear').click(event => {
    socket.emit('zero-compass-clear')
  })
}

export {
  zeroCompass,
  zeroAccel
}