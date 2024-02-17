import { Command, CommandRunner } from 'nest-commander';
import { InstallCommand } from './sub-commands/install/install.subcommand';
import { RemoveCommand } from './sub-commands/remove/remove.subcommand';
import { InitCommand } from './sub-commands/init/init.subcommand';

@Command({
  name: 'mdm',
  description: 'modular dependency manager',
  subCommands: [InstallCommand, RemoveCommand, InitCommand],
})
export class MdmCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run() {}
}
