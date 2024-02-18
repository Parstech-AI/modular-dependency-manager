import { Injectable } from '@nestjs/common';
import { BaseService } from '../../services/base.service';
import { LoggerService } from '../../../../services/Logger.service';

@Injectable()
export class InitService {
  constructor(
    private readonly baseService: BaseService,
    private readonly logService: LoggerService,
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
