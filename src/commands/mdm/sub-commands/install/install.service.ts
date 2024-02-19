import { Injectable } from '@nestjs/common';
import { BaseService } from '../../services/base.service';
import { ProgressService } from '../../services/progress.service';
import { LoggerService } from '../../../../services/Logger.service';

@Injectable()
export class InstallService {
  private readonly progress: ProgressService;

  constructor(
    private readonly baseService: BaseService,
    private readonly logService: LoggerService,
  ) {
    this.progress = new ProgressService('Installing dependencies');
  }

  async installTomModule(params: string[], module: string, dev = false) {
    const file = await this.baseService.findModulePath(module);
    this.progress.start(params.length);
    for (const dependency of params) {
      const [dep, ver] = this.baseService.splitVersion(dependency);
      const moduleData = await this.baseService.installDep(dep, ver, dev, file);
      this.baseService.writeDepsToFile(moduleData as object, file);
      this.progress.increment();
    }
    this.progress.stop();

    this.logService.log(
      `added ${params.length} dependencies to ${module} module successfully`,
    );
  }

  async installGlobally(params: string[], dev = false) {
    this.progress.start(params.length);
    for (const dependency of params) {
      const [dep, ver] = this.baseService.splitVersion(dependency);
      await this.baseService.installDep(dep, ver, dev);
      this.progress.increment();
    }
    this.progress.stop();
    this.logService.log(`added ${params.length} dependencies successfully`);
  }

  async installFromModule(module: string) {
    const file = await this.baseService.findModulePath(module);

    const deps = this.baseService.extractDeps(file);

    const totalDepsCount =
      deps.dependencies.length + deps.devDependencies.length;

    this.progress.start(totalDepsCount);
    await this.installDeps(deps.dependencies, false, file);
    await this.installDeps(deps.devDependencies, true, file);
    this.progress.stop();

    this.logService.log(
      `added ${totalDepsCount} dependencies from ${module} module successfully`,
    );
  }

  async installAll() {
    const files = await this.baseService.findDepFiles();

    let totalDepsCount = 0;
    for (const file of files) {
      this.logService.log(`Installing ${file} dependencies...`);

      const deps = this.baseService.extractDeps(file);
      const depsCount = deps.dependencies.length + deps.devDependencies.length;
      totalDepsCount += depsCount;

      if (!depsCount) {
        this.logService.log(`this module has no dependencies!`);
        continue;
      }

      this.progress.start(depsCount);
      await this.installDeps(deps.dependencies, false, file);
      await this.installDeps(deps.devDependencies, true, file);
      this.progress.stop();
    }

    await this.writeMainDepsToLockFile();

    const lockedData = this.baseService.readLockFile();
    if (lockedData.global) {
      this.logService.log(`Installing global dependencies...`);

      const depsCount = this.baseService.getDepsCount(lockedData.global);
      totalDepsCount += depsCount;

      this.progress.start(depsCount);
      if ('dependencies' in lockedData.global) {
        await this.installDeps(Object.entries(lockedData.global.dependencies));
      }
      if ('devDependencies' in lockedData.global) {
        await this.installDeps(
          Object.entries(lockedData.global.devDependencies),
          true,
        );
      }
      this.progress.stop();
    }

    this.logService.log(`added ${totalDepsCount} from all modules`);
  }

  private async writeMainDepsToLockFile() {
    const { dependencies, devDependencies } = this.baseService.readFile(
      this.baseService.mainDependencyFilePath,
    );
    const lockedData = this.baseService.readLockFile();
    const moduleData = lockedData.global ?? {};
    moduleData.devDependencies ||= {};
    Object.assign(moduleData.devDependencies, devDependencies);
    moduleData.dependencies ||= {};
    Object.assign(moduleData.dependencies, dependencies);
    Object.assign(lockedData, {
      global: moduleData,
    });
    await this.baseService.writeLockFile(lockedData);
  }

  private async installDeps(
    deps: [string, string][],
    dev = false,
    modulePath?: string,
  ) {
    for (const [dep, ver] of deps) {
      await this.baseService.installDep(dep, ver as string, dev, modulePath);
      this.progress.increment();
    }
  }
}
