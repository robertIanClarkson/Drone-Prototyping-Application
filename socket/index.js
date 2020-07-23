const socketIo = require( 'socket.io' )

const init = ( app, server ) => {
  const io = socketIo( server )

  app.set( 'io', io )

  io.on( 'connection', socket => {
    console.log( 'client connected' )

    socket.on( 'disconnect', data => {
      console.log( 'client disconnected' )
    })

    socket.on( 'transmit-data', data => {
      let i = 0;
      var transmit = setInterval(() => {
        io.emit('new-data', {data: i})
        i++
      }, 2000);
    })
  })
}

module.exports = { init }