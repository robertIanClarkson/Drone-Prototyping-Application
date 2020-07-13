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

/* POST up */
router.post('/adjust-speed', function(req, res, next) {
  console.log(req.params)
  console.log(req.body)
  res.sendStatus(200)
  console.log('Server: POST --> adjust-speed')
});

/* POST test */
router.post('/test', function(req, res, next) {
  console.log('Server: POST --> test')
  myPi.test()
  res.sendStatus(200)
});

module.exports = router;
