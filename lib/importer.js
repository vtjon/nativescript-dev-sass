var path = require("path");

module.exports = function(url, prev, done) {
  if (url[0] === '~' && url[1] !== '/') {
    url = path.resolve('node_modules', url.substr(1));
  }

  return { file: url };
}