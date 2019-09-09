"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _solc = _interopRequireDefault(require("solc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function findImports(path) {
  var output = '';
  var relPath = path.replace('file://', '');

  if (_fs.default.existsSync(relPath) == true) {
    output = _fs.default.readFileSync(relPath);
  } else {
    output = _fs.default.readFileSync('node_modules/' + relPath);
  }

  return {
    contents: output.toString()
  };
}

function _default(src) {
  return new Promise(function (resolve) {
    var sources = {};
    sources[src] = {
      urls: ["file://".concat(src)]
    };

    var output = _solc.default.compileStandardWrapper(JSON.stringify({
      language: 'Solidity',
      sources: sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'asm', 'ast', 'bin', 'bin-runtime', 'clone-bin', 'interface', 'opcodes', 'srcmap', 'srcmap-runtime', 'devdoc', 'userdoc']
          }
        }
      }
    }), findImports);

    var res = JSON.parse(output);
    resolve({
      contracts: Object.keys(res.contracts).reduce(function (o, k) {
        var file = k.split(':')[0];
        var fileFragments = file.split('/');
        var contractName = fileFragments[fileFragments.length - 1].split('.sol')[0];
        var contract = res.contracts[k][contractName];
        var fileName = "".concat(process.env.PWD, "/").concat(k.split(':')[0]);
        return _objectSpread({}, o, _defineProperty({}, contractName, _objectSpread({}, contract, {
          fileName: fileName,
          abi: contract.abi,
          devdoc: contract.devdoc,
          userdoc: contract.userdoc
        })));
      }, {})
    });
  });
}