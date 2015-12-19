'use strict';

module.exports = {
  isContentTypeJson: function(headerValue) {
    headerValue = headerValue || '';
    var type = headerValue.split(';')[0].trim().toLowerCase();
    return type === 'application/json';
  },
};
