var express = require('express');
var router = express.Router();
const Motor = require('../pi/motor');

let motor_0;
let motor_1; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cube Interface' })
});

/* POST on */
router.post('/on', function(req, res, next) {
  if(req.body.motor == 0) {
    motor_0.setOn().then(() => {
      res.sendStatus(200)
    });
  } else if(req.body.motor == 1) {
    motor_1.setOn().then(() => {
      res.sendStatus(200)
    });
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

/* POST tune */
router.post('/tune', function(req, res, next) {
  var mid = 68;
  motor_0.tune(mid - req.body.offset);
  motor_1.tune(req.body.offset - mid);
  console.log('Server: POST --> tune');
  res.sendStatus(200);
});

module.exports = router;
