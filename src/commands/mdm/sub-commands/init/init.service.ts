import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../services/base.service';

@Injectable()
export class InitService {
  constructor(
    private readonly baseService: BaseService,
    private readonly logService: Logger,
  ) {}

  initializeMainDependencyFile() {
    const deps = this.readDependenciesFromPackageJson();
    this.baseService.writeDepsToFile(
      deps,
      this.baseService.mainDependencyFilePath,
    );
    this.logService.log('Initialized dependencies.json successfully.');
  }

  private readDependenciesFromPackageJson() {
    const { dependencies, devDependencies } = this.baseService.readFile(
      this.baseService.packageJsonFilePath,
    );
    return { dependencies, devDependencies };
  }
}
