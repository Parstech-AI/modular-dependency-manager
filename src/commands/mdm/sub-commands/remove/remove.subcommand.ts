import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { RemoveCommandOptions } from './remove.types';
import { RemoveService } from './remove.service';

@SubCommand({
  name: 'remove',
  description: 'removes modules dependencies',
  aliases: ['r'],
  arguments: '[dependencies]',
})
export class RemoveCommand extends CommandRunner {
  constructor(
    private readonly removeService: RemoveService,
    private readonly logService: Logger,
  ) {
    super();
  }

  async run(passedParams: string[], options?: RemoveCommandOptions) {
    try {
      if (passedParams.length) {
        await this.removeService.removeFromModule(
          passedParams,
          options.module,
          options.keep,
        );
      } else {
        if (options.module) {
          await this.removeService.removeAllFromModule(
            options.module,
            options.keep,
          );
        } else {
          await this.removeService.removeAll(options.keep);
        }
      }
    } catch (e) {
      this.logService.error(e);
    }
  }

  @Option({
    name: 'module',
    flags: '-m, --module [string]',
    description: 'module to remove dependencies from',
  })
  parseModule(val: string) {
    return val;
  }

  @Option({
    name: 'keep',
    flags: '-k, --keep',
    description: "don't remove dependencies from modules dependency files",
  })
  parseKeep() {
    return true;
  }
}
