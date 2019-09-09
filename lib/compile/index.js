"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _parseAbi = _interopRequireDefault(require("./parse-abi"));

var _solc = _interopRequireDefault(require("./solc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function compile(_ref) {
  var contracts = _ref.contracts;
  var data = [];
  Object.keys(contracts).forEach(function (contractName) {
    var contract = contracts[contractName];
    var fileName = contract.fileName;
    var devdoc = contract.devdoc;
    var author = devdoc.author,
        title = devdoc.title;
    data.push({
      author: author,
      title: title,
      fileName: fileName.replace(process.env.PWD, ''),
      name: contractName,
      abiDocs: (0, _parseAbi.default)(contract)
    });
  });
  return data;
}

function _default(opts) {
  opts._.forEach(function (file) {
    if (!_fs.default.existsSync(file)) {
      process.stderr.write("".concat(file, ": No such file or directory\n"));
      process.exit(1);
    }
  });

  return (0, _solc.default)(opts._).then(function (_ref2) {
    var contracts = _ref2.contracts;
    return compile(_objectSpread({}, opts, {
      contracts: contracts
    }));
  }).catch(function () {
    console.error("solmd: Failed to compile contracts at ".concat(opts._)); // eslint-disable-line no-console

    process.exit(1);
  });
}