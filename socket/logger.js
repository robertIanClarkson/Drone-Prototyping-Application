var fs = require('fs');
var compassLogLocation = "./../pi/logs/compassLog.txt"

function logCompass(x, y, z) {
  fs.appendFile(compassLogLocation, `${x} ${y} ${z}`, function (err) {
    if (err) throw err;
  })
}

module.exports = {
  logCompass
}