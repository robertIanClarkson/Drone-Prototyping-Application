var express = require('express');
var router = express.Router();

var motor_0 = require('../pi/motor');
var motor_1 = require('../pi/motor');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cube Interface' })
});

/* POST refresh */
router.post('/refresh', function(req, res, next) {
  res.send({
    motor0: {
      isOn: motor_0.getOnStatus(),
      speed: motor_0.getSpeed()
    },
    motor1: {
      isOn: motor_1.getOnStatus(),
      speed: motor_1.getSpeed()
    }
  })
  console.log('Server: POST --> refresh')
});

/* POST on */
router.post('/on', function(req, res, next) {
  if(req.body.motor == 0) {
    motor_0.setOn();
    res.sendStatus(200)
  } else if(req.body.motor == 1) {
    motor_1.setOn();
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
  console.log('Server: POST --> on')
});

/* POST off */
router.post('/off', function(req, res, next) {
  if(req.body.motor == 0) {
    motor_0.setOff();
    res.sendStatus(200)
  } else if(req.body.motor == 1) {
    motor_1.setOff();
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
  console.log('Server: POST --> on')
});

/* POST adjust-speed */
router.post('/adjust-speed', function(req, res, next) {
  if(req.body.motor == 0) {
    motor_0.setSpeed(req.body.speed)
    res.sendStatus(200)
  } else if(req.body.motor == 1) {
    motor_1.setSpeed(req.body.speed)
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }
  console.log('Server: POST --> adjust-speed')
});

module.exports = router;
