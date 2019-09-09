import fs from 'fs';
import solc from 'solc';

function findImports(path) {
  let output = '';
  const relPath = path.replace('file://', '');

  if (fs.existsSync(relPath) === true) {
    output = fs.readFileSync(relPath);
  } else {
    output = fs.readFileSync(`node_modules/${relPath}`);
  }
  return { contents: output.toString() };
}

export default function (src) {
  return new Promise((resolve, reject) => {
    const sources = {};
    sources[src] = {
      urls: [`file://${src}`],
    };
    const output = solc.compileStandardWrapper(JSON.stringify({
      language: 'Solidity',
      sources,
      settings: {
        outputSelection: {
          '*': {
            '*': [
              'abi',
              'asm',
              'ast',
              'bin',
              'bin-runtime',
              'clone-bin',
              'interface',
              'opcodes',
              'srcmap',
              'srcmap-runtime',
              'devdoc',
              'userdoc',
            ],
          },
        },
      },
    }), findImports);
    try {
      const res = JSON.parse(output);
      resolve({
        contracts: Object.keys(res.contracts).reduce((o, k) => {
          const file = k.split(':')[0];
          const fileFragments = file.split('/');
          const contractName = fileFragments[fileFragments.length - 1].split('.sol')[0];
          const contract = res.contracts[k][contractName];
          const fileName = `${process.env.PWD}/${k.split(':')[0]}`;
          return {
            ...o,
            [contractName]: {
              ...contract,
              fileName,
              abi: contract.abi,
              devdoc: contract.devdoc,
              userdoc: contract.userdoc,
            },
          };
        }, {}),
      });
    } catch (e) {
      reject(output); // return the bullshit from solc (at least we can know whats going on)
    }
  });
}
