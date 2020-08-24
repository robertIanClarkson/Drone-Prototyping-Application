let givenHeading = 0;
let startHeading = 0;
let heading = 0;
let TUNE = 0;
let MIN = -5;
let MAX = 5;
let CCW = false;
let CW = false;

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

function headingLogic_CCW(socket) {
  return new Promise((resolve, reject) => {
    if (!(heading < startHeading)) { // not turning the right way
      if (MIN <= TUNE && TUNE <= MAX) { // isnt at the tune limit
        TUNE++ // increase the tune
        console.log(`*** TUNE: ${TUNE}\n*** HEADING: ${heading}`)
        socket.emit('tune', {
          offset: TUNE
        })
        setTimeout(() => {
          resolve(headingLogic_CCW(socket))
        }, 1000);
      } else {
        reject('HIT TUNE LIMIT')
      }
    } else {
      CW = false;
      CCW = true;
      console.log('Resolve CCW')
      resolve()
    }
  })
}

function headingLogic_CW(socket) {
  return new Promise((resolve, reject) => {
    if (!(heading > startHeading)) { // not turning the right way
      if (MIN <= TUNE && TUNE <= MAX) { // isnt at the tune limit
        TUNE-- // decrease the tune
        console.log(`*** TUNE: ${TUNE}\n*** HEADING: ${heading}`)
        socket.emit('tune', {
          offset: TUNE
        })
        setTimeout(() => {
          resolve(headingLogic_CW(socket))
        }, 1000);
      } else {
        reject('HIT TUNE LIMIT')
      }
    } else {
      CW = true;
      CCW = false;
      console.log('Resolve CW')
      resolve()
    }
  })
}

function isCCW() {
  console.log((parseInt(heading) <= (parseInt(givenHeading) + 180)))
  console.log(CCW)
  console.log(CW)
  return (parseInt(heading) <= (parseInt(givenHeading) + 180))
}

function holdHeading(socket) {
  console.log(`HEADING: ${heading}`)
  if (isCCW() && !CCW) {
    console.log('Entering CCW Logic')
    headingLogic_CCW(socket).then(() => {
      holdHeading(socket)
    })
      .catch(err => {
        console.log(err)
      })
  } else if (!isCCW() && !CW) {
    console.log('Entering CW Logic')
    headingLogic_CW(socket).then(() => {
      holdHeading(socket)
    })
      .catch(err => {
        console.log(err)
      })
  } else {
    console.log('Do Nothing')
    setTimeout(() => {
      holdHeading(socket)
    }, 1000);
  }
}

export {
  setHeading,
  updateHeading,
  holdHeading
}