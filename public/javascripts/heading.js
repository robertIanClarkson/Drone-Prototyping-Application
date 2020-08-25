import { tune } from "./motors";

let givenHeading = 197;
// let startHeading = 0;
// let heading = 0;
let TUNE = 0;
let MAX = 5;

function setHeading(socket) {
  var slider = document.getElementById("set-heading");
  var output = document.getElementById("set-heading-val");
  output.innerHTML = slider.value;
  slider.onchange = function () {
    output.innerHTML = this.value;
    givenHeading = parseInt(this.value);
    // startHeading = $('#compass-heading').text()
    console.log(`New Heading Given`)
    console.log(`*** givenHeading: ${givenHeading}`)
    // console.log(`*** startHeading: ${startHeading}`)
  }
}

function updateHeading(values) {
  $('#compass-heading').text(values.heading)
  // heading = values.heading
}

function needsCCW(heading) {
  return ((givenHeading + 180) > heading)
}

function needsCW(heading) {
  return ((givenHeading + 180) <= heading)
}

function holdHeading(socket, heading) {
  if (TUNE != MAX && needsCCW(heading)) {
    TUNE += 1
  } else if (TUNE != -MAX && needsCW(heading)) {
    TUNE -= 1
  } else {
    console.log('do nothing')
  }
  socket.emit('tune', {
    offset: TUNE
  })
}

export {
  setHeading,
  updateHeading,
  holdHeading
}
