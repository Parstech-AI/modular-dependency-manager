import * as fs from 'fs';

export class ConfigService {
  readonly configFilePath = './.mdmrc';
  readonly packageJsonFilePath = './package.json';
  readonly mainDependencyFilePath = './dependencies.json';
  private pathToModules = './src/@modules';
  private dependencyFileName = 'dependencies.json';
  private dependencyLockFileName = 'dependency-lock.json';

  constructor() {
    this.setConfigsFromRCFile();
  }

  getPath(path: string) {
    return `${this.pathToModules}${path}${this.dependencyFileName}`;
  }

  readLockFile() {
    try {
      const lockFile = fs.readFileSync(`./${this.dependencyLockFileName}`, {
        encoding: 'utf-8',
      });
      return JSON.parse(lockFile);
    } catch (e) {
      return {};
    }
  }

  writeLockFile(json: object) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `./${this.dependencyLockFileName}`,
        JSON.stringify(json, null, 2),
        (err) => {
          if (err) reject(err);
          else resolve(true);
        },
      );
    });
  }

  private setConfigsFromRCFile() {
    try {
      const config = fs.readFileSync(this.configFilePath, {
        encoding: 'utf8',
      });
      if (!config) return;
      const parsedConfig = JSON.parse(config);
      if (parsedConfig.pathToModules)
        this.pathToModules = parsedConfig.pathToModules;
      if (parsedConfig.dependencyFileName)
        this.dependencyFileName = parsedConfig.dependencyFileName;
      if (parsedConfig.dependencyLockFileName)
        this.dependencyLockFileName = parsedConfig.dependencyLockFileName;
    } catch (e) {
      return;
    }
  }
}
