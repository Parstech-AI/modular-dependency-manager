import { Command, CommandRunner } from 'nest-commander';
import { InitCommand } from './sub-commands/init/init.subcommand';
import { RunCommand } from './sub-commands/run/run.subcommand';
import { InstallCommand } from './sub-commands/install/install.subcommand';
import { RemoveCommand } from './sub-commands/remove/remove.subcommand';

@Command({
  name: 'mdm',
  description: 'modular dependency manager',
  subCommands: [InstallCommand, RemoveCommand, InitCommand, RunCommand],
})
export class MdmCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run() {}
}
