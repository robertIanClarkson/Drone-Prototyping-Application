let givenHeading = 197;
let startHeading = 0;
let heading = 0;
let TUNE = 0;
let MAX = 5;

function setHeading(socket) {
  var slider = document.getElementById("set-heading");
  var output = document.getElementById("set-heading-val");
  output.innerHTML = slider.value;
  slider.onchange = function () {
    output.innerHTML = this.value;
    givenHeading = this.value;
    startHeading = $('#compass-heading').text()
    console.log(`New Heading Given\n*** givenHeading: ${givenHeading}\n*** startHeading: ${startHeading}\n`)
    holdHeading(socket)
  }
}

function updateHeading(values) {
  $('#compass-heading').text(values.heading)
  heading = values.heading
}

function getPosition(val) {
  return val / 360;
}

function getTune() {
  return Math.round((getPosition(parseInt(heading)) - getPosition(parseInt(givenHeading))) * 2.0 * MAX);
}

function holdHeading(socket) {
  // console.log(`HEADING: ${heading}`)
  setInterval(() => {
    socket.emit('tune', {
      offset: getTune()
    })
  }, 500)
}

export {
  setHeading,
  updateHeading,
  holdHeading
}
