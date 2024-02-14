import { Logger, Module } from '@nestjs/common';
import { MdmCommand } from './commands/mdm/mdm.command';
import { InstallService } from './commands/mdm/sub-commands/install/install.service';
import { InstallCommand } from './commands/mdm/sub-commands/install/install.subcommand';
import { RemoveCommand } from './commands/mdm/sub-commands/remove/remove.subcommand';
import { RemoveService } from './commands/mdm/sub-commands/remove/remove.service';
import { AskService } from './commands/mdm/services/ask.service';
import { BaseService } from './commands/mdm/services/base.service';

@Module({
  providers: [
    MdmCommand,
    InstallCommand,
    RemoveCommand,
    BaseService,
    RemoveService,
    InstallService,
    AskService,
    Logger,
  ],
})
export class AppModule {}
