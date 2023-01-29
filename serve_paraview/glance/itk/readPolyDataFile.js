import createWebworkerPromise from './createWebworkerPromise';
import PromiseFileReader from 'promise-file-reader';
import mimeToIO from './MimeToPolyDataIO';
import getFileExtension from './getFileExtension';
import extensionToIO from './extensionToPolyDataIO';
import IOTypes from './IOTypes';
import config from './itkConfig';

var readPolyDataFile = function readPolyDataFile(webWorker, file) {
  var worker = webWorker;
  return createWebworkerPromise('Pipeline', worker).then(function (_ref) {
    var webworkerPromise = _ref.webworkerPromise,
        usedWorker = _ref.worker;
    worker = usedWorker;
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      var filePath = file.name;
      var mimeType = file.type;
      var extension = getFileExtension(filePath);
      var pipelinePath = null;

      if (mimeToIO.has(mimeType)) {
        pipelinePath = mimeToIO.get(mimeType);
      } else if (extensionToIO.has(extension)) {
        pipelinePath = extensionToIO.get(extension);
      }

      if (pipelinePath === null) {
        Promise.reject(Error('Could not find IO for: ' + filePath));
      }

      var args = [file.name, file.name + '.output.json'];
      var outputs = [{
        path: args[1],
        type: IOTypes.vtkPolyData
      }];
      var inputs = [{
        path: args[0],
        type: IOTypes.Binary,
        data: new Uint8Array(arrayBuffer)
      }];
      var transferables = [];
      inputs.forEach(function (input) {
        // Binary data
        if (input.type === IOTypes.Binary) {
          if (input.data.buffer) {
            transferables.push(input.data.buffer);
          } else if (input.data.byteLength) {
            transferables.push(input.data);
          }
        }
      });
      return webworkerPromise.postMessage({
        operation: 'runPolyDataIOPipeline',
        config: config,
        pipelinePath: pipelinePath,
        args: args,
        outputs: outputs,
        inputs: inputs
      }, transferables).then(function (_ref2) {
        var stdout = _ref2.stdout,
            stderr = _ref2.stderr,
            outputs = _ref2.outputs;
        return Promise.resolve({
          polyData: outputs[0].data,
          webWorker: worker
        });
      });
    });
  });
};

export default readPolyDataFile;