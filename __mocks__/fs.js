const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = {};
function __setMockFile(filename, content) {
  mockFiles[filename] = content;
}

// A custom version of `readFileSync` that reads from the special mocked out
// file set via __setMockFile
function readFileSync(filename) {
  if (typeof(mockFiles[filename]) === 'undefined') {
    throw {
      code: 'ENOENT'
    };
  }
  return mockFiles[filename];
}

fs.__setMockFile = __setMockFile;
fs.readFileSync = readFileSync;

module.exports = fs;
