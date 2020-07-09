var express = require('express');
var router = express.Router();

var myPi = require('../pi/pi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cube Interface' })
});

/* POST refresh */
router.post('/refresh', function(req, res, next) {
  res.send({
    status: myPi.getStatus(),
    value: myPi.getValue()
  })
  console.log('Server: POST --> refresh')
});

/* POST on */
router.post('/on', function(req, res, next) {
  myPi.setOn()
  res.sendStatus(200)
  console.log('Server: POST --> on')

});

/* POST off */
router.post('/off', function(req, res, next) {
  myPi.setOff()
  res.sendStatus(200)
  console.log('Server: POST --> off')

});

/* POST down */
router.post('/down', function(req, res, next) {
  myPi.setDown()
  res.sendStatus(200)
  console.log('Server: POST --> down')

});

/* POST up */
router.post('/up', function(req, res, next) {
  myPi.setUp()
  res.sendStatus(200)
  console.log('Server: POST --> up')
});

/* POST test */
router.post('/test', function(req, res, next) {
  console.log('Server: POST --> test');

  /***************************/
  var rpio = require('rpio');
 
  var pin = 12;           /* P12/GPIO18 */
  var range = 1024;       /* LEDs can quickly hit max brightness, so only use */
  var max = 128;          /*   the bottom 8th of a larger scale */
  var clockdiv = 8;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */
  var interval = 5;       /* setInterval timer, speed of pulses */
  var times = 5;          /* How many times to pulse before exiting */
   
  /*
   * Enable PWM on the chosen pin and set the clock and range.
   */
  rpio.open(pin, rpio.PWM);
  rpio.pwmSetClockDivider(clockdiv);
  rpio.pwmSetRange(pin, range);
   
  /*
   * Repeatedly pulse from low to high and back again until times runs out.
   */
  var direction = 1;
  var data = 0;
  var pulse = setInterval(function() {
          rpio.pwmSetData(pin, data);
          if (data === 0) {
                  direction = 1;
                  if (times-- === 0) {
                          clearInterval(pulse);
                          rpio.open(pin, rpio.INPUT);
                          return;
                  }
          } else if (data === max) {
                  direction = -1;
          }
          data += direction;
  }, interval, data, direction, times);
  /***************************/

  res.sendStatus(200);
});

module.exports = router;
