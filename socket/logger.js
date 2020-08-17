var fs = require('fs');
var compassLogLocation = "./"

export function logCompass(x, y, z) {
  fs.appendFile('./../pi/logs/compassLog.js', `${x} ${y} ${z}`, function (err) {
    if (err) throw err;
  })
}