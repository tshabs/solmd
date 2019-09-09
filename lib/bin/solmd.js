#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _minimist = _interopRequireDefault(require("minimist"));

var Solmd = _interopRequireWildcard(require("../index"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist.default)(process.argv.slice(2));

if (typeof args.help !== 'undefined' || args._.length === 0) {
  var _JSON$parse = JSON.parse(_fs.default.readFileSync(_path.default.join(__dirname, '../../package.json')).toString()),
      version = _JSON$parse.version;

  process.stdout.write("solmd v".concat(version, "\n\nusage: solmd <solidity> [--dest] <target>\n\nparameters:\n\n--dest     Destination of markdown output\n--no-toc   Do not generate table of contents, defaults false\n\n  "));
  process.exit();
} else {
  Solmd.default.build(args).catch(function (err) {
    console.error(err); // eslint-disable-line no-console

    process.exit(1);
  });
}