const shelljs = jest.genMockFromModule('shelljs');

let executedCommands = [];

// A custom version of `exec` that  fakes execution of command
function exec(command) {
  executedCommands.push(command);
}

shelljs.__executedCommands = function() {
  return executedCommands;
};
shelljs.__resetCommands = function() {
  executedCommands = [];
};
shelljs.exec = exec;

module.exports = shelljs;
