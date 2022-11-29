import { writeFileSync } from 'fs';
import { join } from 'path';

const publishLibs = ['libs/core'];

const fileName = `${__dirname}/../package.json`;
const file: { version: string } = require(fileName);

const [major, minor, patch] = file.version.split('.').map((part) => Number(part));
const [, , releaseVersion] = process.argv;

let version: string;

switch (releaseVersion) {
  case 'major': {
    version = `${major + 1}.0.0`;
    break;
  }
  case 'minor': {
    version = `${major}.${minor + 1}.0`;
    break;
  }
  default: {
    version = `${major}.${minor}.${patch + 1}`;
    break;
  }
}

for (const lib of publishLibs) {
  const path = join(`${__dirname}/../`, lib, 'package.json');

  const fileLib: { version: string } = require(path);
  fileLib.version = version;

  writeFileSync(path, JSON.stringify(fileLib, null, 2));
}

file.version = version;
writeFileSync(fileName, JSON.stringify(file, null, 2));

console.log(file.version);
