const {isProduction} = require('./constants');
const path = window.require('path');
const electron = window.require('electron');
const fs = window.require('fs');

const rootPath = window.require('electron-root-path').rootPath;

const pathToResources = isProduction ? path.join(rootPath, 'resources/') : path.join(electron.remote.app.getAppPath(), 'src/resources/');

function createResourceStructure() {
    fs.mkdirSync(pathToResources);
}

if(isProduction) {
    if (!fs.existsSync(pathToResources)) {
        console.warn('file doesnt exist');
        createResourceStructure(pathToResources);
    }
}

function readFileFromDisk(filePath) {
    let contents = fs.readFileSync(filePath, 'utf8');
    return contents;
}

module.exports = {
    pathToResources,
    getResourceIndexList,
    getResourceIndex,
    putResourceIndex,
    readFileFromDisk,
};