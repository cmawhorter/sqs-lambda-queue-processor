'use strict';

var genericErrorHandler = function(req, res, statusCode, errorMessage) {
  res.writeHead(statusCode || 500, errorMessage || 'Error', {'Content-Type': 'text/plain'});
  res.end();
};

var notFoundHandler = function(req, res) {
  genericErrorHandler(req, res, 404, 'Not Found');
};

var notAcceptableHandler = function(req, res) {
  genericErrorHandler(req, res, 406, 'Body Not Acceptable; JSON Only');
};

var badRequestHandler = function(req, res) {
  genericErrorHandler(req, res, 400, 'Could Not Parse JSON Body');
};

module.exports = {
  generic: genericErrorHandler,
  notFound: notFoundHandler,
  notAcceptable: notAcceptableHandler,
  badJson: badRequestHandler,
};
