"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _readImageArrayBuffer = _interopRequireDefault(require("./readImageArrayBuffer"));

var _readMeshArrayBuffer = _interopRequireDefault(require("./readMeshArrayBuffer"));

var _getFileExtension = _interopRequireDefault(require("./getFileExtension"));

var _extensionToMeshIO = _interopRequireDefault(require("./extensionToMeshIO"));

var _MimeToMeshIO = _interopRequireDefault(require("./MimeToMeshIO"));

var readArrayBuffer = function readArrayBuffer(webWorker, arrayBuffer, fileName, mimeType) {
  var extension = (0, _getFileExtension.default)(fileName);
  var isMesh = !!_extensionToMeshIO.default.has(extension) || !!_MimeToMeshIO.default.has(mimeType);

  if (isMesh) {
    return (0, _readMeshArrayBuffer.default)(webWorker, arrayBuffer, fileName, mimeType).catch(function () {
      webWorker.terminate();
      return (0, _readImageArrayBuffer.default)(null, arrayBuffer, fileName, mimeType);
    });
  } else {
    return (0, _readImageArrayBuffer.default)(webWorker, arrayBuffer, fileName, mimeType);
  }
};

var _default = readArrayBuffer;
exports.default = _default;