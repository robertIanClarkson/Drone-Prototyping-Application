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

export {
  zeroAccel
}