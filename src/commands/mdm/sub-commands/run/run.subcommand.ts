import { CommandRunner, SubCommand } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { RunService } from '../../services/run.service';

@SubCommand({
  name: 'run',
  description: 'run your package manager commands',
  arguments: '<package-manager-command>',
})
export class RunCommand extends CommandRunner {
  constructor(
    private readonly runService: RunService,
    private readonly logService: Logger,
  ) {
    super();
  }

  async run(passedParams: string[]) {
    try {
      await this.runService.run(`npm run ${passedParams.join(' ')}`);
    } catch (e) {
      this.logService.error(e);
    }
  }
}
