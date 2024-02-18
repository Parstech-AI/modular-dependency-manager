import { CommandRunner, RootCommand } from 'nest-commander';

@RootCommand({
  name: 'mdm',
  description: 'modular dependency manager',
})
export class MdmCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run() {}
}
