"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAbi;

var _helpers = _interopRequireDefault(require("../helpers"));

var _parseOutputs = _interopRequireDefault(require("./parseOutputs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parseAbi(contract) {
  return contract.abi.map(function (method) {
    var inputParams = method.inputs || [];
    var signature = method.name && "".concat(method.name, "(").concat(inputParams.map(function (i) {
      return i.type;
    }).join(','), ")");
    var devDocs = (contract.devdoc.methods || {})[signature] || {};
    var userDocs = (contract.userdoc.methods || {})[signature] || {}; // map abi inputs to devdoc inputs

    var params = devDocs.params || {};
    var inputs = inputParams.map(function (param) {
      return _objectSpread({}, param, {
        description: params[param.name]
      });
    });
    var argumentList = inputParams.reduce(function (inputString, param) {
      return "".concat(inputString).concat(param.name, ", ");
    }, '').slice(0, -2); // don't write this

    delete devDocs.params;
    var outputs = (0, _parseOutputs.default)({
      devDocs: devDocs,
      method: method
    });
    return _objectSpread({}, method, devDocs, userDocs, {
      inputs: inputs,
      argumentList: argumentList,
      outputs: outputs,
      signature: signature,
      signatureHash: signature && (0, _helpers.default)(signature)
    });
  });
}