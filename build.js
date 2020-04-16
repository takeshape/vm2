const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'lib');

function readFile(filename) {
	return fs.readFileSync(path.join(__dirname, 'lib', filename), 'utf8');
}

function copyFile(filename) {
	fs.copyFileSync(path.join(srcPath, filename), path.join(distPath, filename));
}

const main = readFile('main.js');
const filesInlined = new Set();

const newMain = main.replace(/'file:\/\/([a-z]+.js)'/g, (match, filename) => {
	const fileContents = readFile(filename);
	filesInlined.add(filename);
	return JSON.stringify(fileContents);
});


if (!fs.existsSync(distPath)) {
	fs.mkdirSync(distPath);
}

fs.readdirSync(srcPath).filter(filename => !filesInlined.has(filename)).map(copyFile);

fs.writeFileSync(path.join(distPath, 'main.js'), newMain);
