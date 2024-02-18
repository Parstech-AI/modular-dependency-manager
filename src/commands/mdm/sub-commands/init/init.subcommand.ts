import { CommandRunner, SubCommand } from 'nest-commander';
import { LoggerService } from '../../../../services/Logger.service';
import { InitService } from './init.service';

@SubCommand({
  name: 'init',
  description: 'writes main dependency file from package.json',
})
export class InitCommand extends CommandRunner {
  constructor(
    private readonly initService: InitService,
    private readonly logService: LoggerService,
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
