import { BaseService } from '../../services/base.service';
import { Injectable, Logger } from '@nestjs/common';
import { ProgressService } from '../../services/progress.service';

@Injectable()
export class RemoveService {
  private readonly progress: ProgressService;

  constructor(
    private readonly baseService: BaseService,
    private readonly logService: Logger,
  ) {
    this.progress = new ProgressService('Removing dependencies');
  }

  async removeFromModule(params: string[], module?: string, keep = false) {
    const file = await this.baseService.findModulePath(module);

    await this.removeDeps(params, file, keep);

    this.logService.log(`Removed ${params.length} dependencies successfully`);
  }

  async removeAllFromModule(module: string, keep = false) {
    const modulePath = await this.baseService.findModulePath(module);

    const depsTotalCount = await this.removeAllDeps(modulePath, keep);

    if (depsTotalCount) {
      this.logService.log(
        `Removed ${depsTotalCount} dependencies from ${module} module successfully`,
      );
    }
  }

  async removeAll(keep = false) {
    const lockedData = this.baseService.readLockFile();
    let depsTotalCount = 0;
    for (const modulePath in lockedData) {
      this.logService.log(`Removing ${modulePath} dependencies...`);
      depsTotalCount += await this.removeAllDeps(modulePath, keep);
    }
    if (depsTotalCount) {
      this.logService.log(`Removed all dependencies successfully`);
    }
  }

  private async removeDeps(
    params: string[],
    modulePath?: string,
    keep = false,
  ) {
    for (const dependency of params) {
      const { data } = await this.baseService.removeDep(dependency, modulePath);
      if (!keep) this.baseService.writeDepsToFile(data, modulePath);
      this.progress.increment();
    }
  }

  private async removeAllDeps(modulePath: string, keep = false) {
    const lockedData = this.baseService.readLockFile();

    if (!lockedData[modulePath]) {
      this.logService.log(`${modulePath} has no installed dependencies`);
      return;
    }

    let depsTotalCount = 0;
    const moduleDepsCount = lockedData[modulePath].hasOwnProperty(
      'dependencies',
    )
      ? Object.keys(lockedData[modulePath].dependencies).length
      : 0;
    this.progress.start(moduleDepsCount);
    if (moduleDepsCount) {
      depsTotalCount += moduleDepsCount;
      await this.removeDeps(
        Object.keys(lockedData[modulePath].dependencies),
        modulePath,
        keep,
      );
    }
    const moduleDevDepsCount = lockedData[modulePath].hasOwnProperty(
      'devDependencies',
    )
      ? Object.keys(lockedData[modulePath].devDependencies).length
      : 0;
    this.progress.setTotal(moduleDepsCount + moduleDevDepsCount);
    if (moduleDevDepsCount) {
      depsTotalCount += moduleDevDepsCount;
      await this.removeDeps(
        Object.keys(lockedData[modulePath].devDependencies),
        modulePath,
        keep,
      );
    }
    this.progress.stop();
    return depsTotalCount;
  }
}
