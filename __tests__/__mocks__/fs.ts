import * as path from 'path';

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
// eslint-disable-next-line no-underscore-dangle
function __setMockFiles(newMockFiles) {
    mockFiles = Object.create(null);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const file in newMockFiles) {
        const dir = path.dirname(file);

        if (!mockFiles[dir]) {
            mockFiles[dir] = [];
        }
        mockFiles[dir].push(path.basename(file));
    }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
    console.log(directoryPath);
    return mockFiles[directoryPath] || [];
}

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
fs.__setMockFiles = __setMockFiles;
// @ts-ignore
fs.readdirSync = readdirSync;

module.exports = fs;
