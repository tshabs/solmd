"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dot = _interopRequireDefault(require("dot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = "\n# {{=it.name}}\n{{? it.author }}\n{{=it.author}}{{?}}\n{{~it.abiDocs :docItem:index}}{{? docItem.type === 'event'}}## *{{=docItem.type}}* {{=docItem.name}}\n\n{{=it.name}}.{{=docItem.name}}({{=docItem.argumentList}}) {{?docItem.anonymous}}`anonymous` {{?}}`{{=docItem.signatureHash}}`\n\n{{? docItem.inputs.length > 0 }}Arguments\n\n| **type** | **name** | **description** |\n|-|-|-|{{~docItem.inputs :argument}}\n| *{{=argument.type}}* | {{=argument.name}} | {{? argument.indexed === false}}not {{?}}indexed |{{~}}{{?}}\n{{?}}{{? docItem.type === 'function'}}\n## *{{=docItem.type}}* {{=docItem.name}}\n\n{{=it.name}}.{{=docItem.name}}({{=docItem.argumentList}}) `{{=docItem.stateMutability}}` `{{=docItem.signatureHash}}`\n{{?docItem.notice}}\n**{{=docItem.notice}}**\n{{?}}\n{{?docItem.details}}> {{=docItem.details}}\n{{?}}\n{{? docItem.inputs.length > 0 }}Inputs\n\n| **type** | **name** | **description** |\n|-|-|-|{{~docItem.inputs :input}}\n| *{{=input.type}}* | {{=input.name}} | {{=input.description}} |{{~}}{{?}}\n{{? docItem.outputs.length > 0 }}\nOutputs\n\n| **type** | **name** | **description** |\n|-|-|-|{{~docItem.outputs :output}}\n| *{{=output.type}}* | {{=output.name}} | {{=output.description}} |{{~}}{{?}}{{?}}\n{{~}}\n---";
_dot.default.templateSettings.strip = false;

var _default = _dot.default.template(template);

exports.default = _default;