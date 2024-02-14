import { Command, CommandRunner } from 'nest-commander';
import { InstallCommand } from './sub-commands/install/install.subcommand';
import { RemoveCommand } from './sub-commands/remove/remove.subcommand';

@Command({
  name: 'mdm',
  description: 'modular dependency manager',
  subCommands: [InstallCommand, RemoveCommand],
})
export class MdmCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run() {}
}
