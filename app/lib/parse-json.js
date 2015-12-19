'use strict';

module.exports = function(data, errorHandler) {
  try {
    return JSON.parse(data);
  }
  catch (err) {
    errorHandler(err);
  }
}
