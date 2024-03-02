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
      await this.baseService.writeDepsToFile(moduleData as object, file);
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
      const moduleData = await this.baseService.installDep(dep, ver, dev);
      await this.baseService.writeDepsToFile(
        moduleData as object,
        this.baseService.mainDependencyFilePath,
      );
      this.progress.increment();
    }
    this.progress.stop();
    this.logService.log(`added ${params.length} dependencies successfully`);
  }

  async installFromModule(module: string) {
    const file = await this.baseService.findModulePath(module);

    const depsCount = await this.readAndInstall(file);

    this.logService.log(
      `added ${depsCount} dependencies from ${module} module successfully`,
    );
  }

  async installAll() {
    const files = await this.baseService.findDepFiles();

    let totalDepsCount = 0;
    for (const file of files) {
      this.logService.log(`Installing ${file} dependencies...`);

      const depsCount = await this.readAndInstall(file);
      totalDepsCount += depsCount;

      if (!depsCount) {
        this.logService.log(`this module has no dependencies!`);
      }
    }

    this.logService.log(`Installing global dependencies...`);

    const depsCount = await this.readAndInstall(
      this.baseService.mainDependencyFilePath,
    );
    totalDepsCount += depsCount;

    if (!depsCount) {
      this.logService.log(`no global dependencies found!`);
    }

    this.logService.log(`added ${totalDepsCount} from all modules`);
  }

  private async readAndInstall(file: string) {
    const deps = this.baseService.extractDeps(file);
    const depsCount = deps.dependencies.length + deps.devDependencies.length;

    if (!depsCount) return 0;

    this.progress.start(depsCount);
    await this.installDeps(deps.dependencies, false, file);
    await this.installDeps(deps.devDependencies, true, file);
    this.progress.stop();

    return depsCount;
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
