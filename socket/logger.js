var fs = require('fs');
var compassLogLocation = "/home/pi/Desktop/Cube-Interface/pi/logs/compassLog.txt"

function logCompass(x, y, z) {
  fs.appendFile(compassLogLocation, `${x} ${y} ${z}\n`, function (err) {
    if (err) throw err;
  })
}

module.exports = {
  logCompass
}
