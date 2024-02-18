import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { LoggerService } from '../../../../services/Logger.service';
import { InstallService } from './install.service';
import { InstallCommandOptions } from './install.types';

@SubCommand({
  name: 'install',
  description: 'installs modules dependencies',
  aliases: ['i'],
  arguments: '[dependencies]',
})
export class InstallCommand extends CommandRunner {
  constructor(
    private readonly installService: InstallService,
    private readonly logService: LoggerService,
  ) {
    super();
  }

  async run(passedParam: string[], options?: InstallCommandOptions) {
    try {
      if (passedParam.length) {
        if (options.module) {
          await this.installService.installTomModule(
            passedParam,
            options.module,
            options.dev,
          );
        } else {
          await this.installService.installGlobally(passedParam, options.dev);
        }
      } else {
        if (options.module) {
          await this.installService.installFromModule(options.module);
        } else {
          await this.installService.installAll();
        }
      }
    } catch (e) {
      this.logService.error(e);
    }
  }

  @Option({
    name: 'module',
    flags: '-m, --module [string]',
    description: 'module name',
  })
  parseModule(val: string) {
    return val;
  }

  @Option({
    name: 'dev',
    flags: '-d, --dev',
    description: 'install as dev dependency',
  })
  parseDev() {
    return true;
  }
}
