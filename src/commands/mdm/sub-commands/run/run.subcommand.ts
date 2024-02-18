import { Command, CommandRunner } from 'nest-commander';
import { LoggerService } from '../../../../services/Logger.service';
import { RunService } from '../../services/run.service';

@Command({
  name: 'run',
  description: 'run your package manager commands',
  arguments: '<package-manager-command>',
})
export class RunCommand extends CommandRunner {
  constructor(
    private readonly runService: RunService,
    private readonly logService: LoggerService,
  ) {
    super();
  }

  async run(passedParams: string[]) {
    try {
      const result = await this.runService.run(
        `npm run ${passedParams.join(' ')}`,
      );
      this.logService.log(result);
    } catch (e) {
      this.logService.error(e);
    }
  }
}
