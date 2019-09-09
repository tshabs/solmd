"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _template = _interopRequireDefault(require("./template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(_ref) {
  var args = _ref.args,
      data = _ref.data;
  return new Promise(function (resolve, reject) {
    // write to dest stream
    var writeStream;

    try {
      writeStream = _fs.default.createWriteStream(args.dest, {
        flags: 'w'
      });
    } catch (err) {
      reject(err);
    }

    writeStream.on('error', function (err) {
      reject(err);
    });
    writeStream.on('finish', function () {
      resolve();
    }); // build the table of contents

    if (!args.notoc) {
      data.forEach(function (contract) {
        // contract name
        writeStream.write("* [".concat(contract.name, "](#").concat(contract.name.toLowerCase(), ")\n")); // methods (sub-bullets)

        contract.abiDocs.forEach(function (docItem) {
          if (typeof docItem.name !== 'undefined') {
            writeStream.write("  * [".concat(docItem.name, "](#").concat(docItem.type, "-").concat(docItem.name.toLowerCase(), ")\n"));
          }
        });
      });
    } // create docs for each contract from template


    data.forEach(function (contract) {
      var md = (0, _template.default)(contract);
      writeStream.write(md);
    });
    writeStream.end();
  });
}