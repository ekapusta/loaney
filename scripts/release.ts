import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { output } from '@nrwl/workspace';
import { execSync } from 'child_process';

/**
 * Read data
 *
 * @param path Path to file
 */
function read(path: string): { version: string } {
  return JSON.parse(readFileSync(path).toString());
}

/**
 * Return a new version for NX workspace
 */
function getVersion(): string {
  const config = read('package.json');

  const [major, minor, patch] = config.version.split('.').map((part) => Number(part));
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

  return version;
}

/**
 * Write version on package.json
 *
 * @param path Path to package.json
 * @param version New version
 */
function write(path: string, version: string): void {
  const config = read(path);
  config.version = version;
  writeFileSync(path, JSON.stringify(config, null, 2));
}

/**
 * Update versions
 */
function updateVersion(version: string, libs: string[]): void {
  ['package.json', ...libs.map((lib) => join('libs', lib, 'package.json'))].forEach((path) => write(path, version));
}

function createGitRelease(version: string): void {
  const branch = `release/v${version}`;
  execSync(`git checkout -b ${branch}`);
  execSync('git add .');
  execSync(`git commit -m "version up v${version}"`);
  execSync('git checkout develop');
  execSync(`git merge ${branch} --no-ff`);
  execSync(`git branch --delete ${branch}`);
  execSync(`git checkout main`);
  execSync(`git rebase develop`);
  execSync(`git tag ${version}`);
  execSync(`git push -u origin main develop`);
  execSync(`git push --tags`);
}

/**
 * Publish libs
 * @param libs
 */
function publishNpm(libs: string[]): void {
  const workspace = process.cwd();
  for (const lib of libs) {
    execSync(`nx build ${lib.replace(new RegExp('/', 'g'), '-')}`);
  }

  for (const lib of libs) {
    execSync(`npm publish --access public`, {
      cwd: join(workspace, 'dist/libs', lib),
    });
  }
}

function release(libs: string[]): void {
  try {
    output.log({ title: 'Starting a new release.' });

    const version = getVersion();
    updateVersion(version, libs);
    output.log({ title: 'New version was updated on packages.' });

    createGitRelease(version);
    output.log({ title: 'Release was merged on main branch.' });

    publishNpm(libs);
    output.log({ title: 'Release was published on npm.' });

    output.log({ title: 'New version creation completed successfully.' });
  } catch (e) {
    output.error({ title: 'Creation a new release did not complete successfully' + '\n' + e });
  }
}

release(['core', 'components', 'testing']);
