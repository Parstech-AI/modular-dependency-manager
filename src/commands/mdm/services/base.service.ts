import { glob } from 'glob';
import * as fs from 'fs';
import { exec } from 'child_process';
import { ConfigService } from './config.service';
import { AskService } from './ask.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService extends ConfigService {
  constructor(private readonly askService: AskService) {
    super();
  }

  readFile(path: string) {
    try {
      const file = fs.readFileSync(path, {
        encoding: 'utf-8',
      });
      return JSON.parse(file);
    } catch (e) {
      return {};
    }
  }

  splitVersion(dependency: string): [dependency: string, version?: string] {
    const [dep, ver] = dependency.split('@');
    return [dep, ver];
  }

  async findDepFiles(module?: string) {
    const finalPath = module
      ? this.getPath(`/**/${module}/`)
      : this.getPath('/**/');

    return await glob(finalPath);
  }

  async findModulePath(module: string) {
    let file: string;
    const files = await this.findDepFiles(module);
    if (files.length > 1) {
      file = await this.askService.chooseModule(files);
    } else {
      file = files[0];
    }
    return file;
  }

  writeDepsToFile(deps: object, file: string) {
    fs.writeFileSync(file, JSON.stringify(deps, null, 2));
  }

  extractDeps(file: string): {
    dependencies: [string, string][];
    devDependencies: [string, string][];
  } {
    const data = this.readFile(file);
    return {
      dependencies: data.dependencies ? Object.entries(data.dependencies) : [],
      devDependencies: data.devDependencies
        ? Object.entries(data.devDependencies)
        : [],
    };
  }

  getDepsCount(json: object) {
    const depsCount =
      'dependencies' in json ? Object.keys(json.dependencies).length : 0;
    const devDepsCount =
      'devDependencies' in json ? Object.keys(json.devDependencies).length : 0;

    return depsCount + devDepsCount;
  }

  getInstalledDepVersion(dependency: string, dev = false) {
    const packageJson = this.readFile(this.packageJsonFilePath);
    const dependencies = packageJson[dev ? 'devDependencies' : 'dependencies'];
    if (dependency in dependencies) return dependencies[dependency];
    else throw 'dependency is not listed in package.json';
  }

  installDep(
    dependency: string,
    version?: string,
    dev = false,
    modulePath?: string,
  ): Promise<object | string> {
    return new Promise((resolve, reject) => {
      exec(
        `npm i --save ${dev ? '-D' : ''} ${dependency}${version ? `@${version}` : ''}`,
        async (err, stdout, stderr) => {
          if (err) {
            reject(err);
            return;
          }

          if (stderr) reject(stderr);
          else {
            const installedVersion = await this.getInstalledDepVersion(
              dependency,
              dev,
            );
            resolve(
              this.addToLockFile(dependency, installedVersion, dev, modulePath),
            );
          }
        },
      );
    });
  }

  removeDep(
    dependency: string,
    modulePath?: string,
  ): Promise<{
    module: 'global' | string;
    data: object;
  }> {
    return new Promise((resolve, reject) => {
      exec(`npm r ${dependency}`, (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }

        if (stderr) reject(stderr);
        else resolve(this.removeFromLockFile(dependency, modulePath));
      });
    });
  }

  private addToLockFile(
    dependency: string,
    version?: string,
    dev = false,
    module = 'global',
  ): object {
    const lockedData = this.readLockFile();
    const data = { [dependency]: version };
    const moduleData = lockedData[module] ?? {};
    if (dev) {
      Object.assign(moduleData, {
        devDependencies: data,
      });
    } else {
      Object.assign(moduleData, {
        dependencies: data,
      });
    }
    Object.assign(lockedData, {
      [module]: moduleData,
    });
    this.writeLockFile(lockedData);
    return moduleData;
  }

  private removeFromLockFile(
    dependency: string,
    module?: string,
  ): {
    module: 'global' | string;
    data: object;
  } {
    const lockedData = this.readLockFile();
    let foundModule: string | null = null;

    function removeLockedDep(mdl: string) {
      if (
        lockedData[mdl].hasOwnProperty('devDependencies') &&
        lockedData[mdl].devDependencies.hasOwnProperty(dependency)
      ) {
        foundModule = mdl;
        delete lockedData[mdl].devDependencies[dependency];
        if (!Object.keys(lockedData[mdl].devDependencies).length) {
          delete lockedData[mdl].devDependencies;
        }
      } else if (
        lockedData[mdl].hasOwnProperty('dependencies') &&
        lockedData[mdl].dependencies.hasOwnProperty(dependency)
      ) {
        foundModule = mdl;
        delete lockedData[mdl].dependencies[dependency];
        if (!Object.keys(lockedData[mdl].dependencies).length) {
          delete lockedData[mdl].dependencies;
        }
      }
    }

    if (module) {
      removeLockedDep(module);
    } else {
      for (const modulePath in lockedData) {
        removeLockedDep(modulePath);
      }
    }

    if (!Object.keys(lockedData[module]).length) delete lockedData[module];
    if (foundModule) this.writeLockFile(lockedData);
    return { module: foundModule, data: lockedData[foundModule] ?? {} };
  }
}
