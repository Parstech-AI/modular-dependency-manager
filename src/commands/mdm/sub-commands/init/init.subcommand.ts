import { CommandRunner, SubCommand } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { InitService } from './init.service';

@SubCommand({
  name: 'init',
  description: 'writes main dependency file from package.json',
})
export class InitCommand extends CommandRunner {
  constructor(
    private readonly initService: InitService,
    private readonly logService: Logger,
  ) {
    super();
  }

  async run() {
    try {
      this.initService.initializeMainDependencyFile();
    } catch (e) {
      this.logService.error(e);
    }
  }
}
