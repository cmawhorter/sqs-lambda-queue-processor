'use strict';

module.exports = function(data, errorHandler) {
  try {
    return JSON.parse(data);
  }
  catch (err) {
    var ret = errorHandler(err);
    if (void 0 !== ret) {
      return ret;
    }
  }
}
