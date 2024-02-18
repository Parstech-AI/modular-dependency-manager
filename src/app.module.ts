import { Module } from '@nestjs/common';
import { InstallService } from './commands/mdm/sub-commands/install/install.service';
import { MdmCommand } from './commands/mdm/mdm.command';
import { BaseService } from './commands/mdm/services/base.service';
import { RemoveService } from './commands/mdm/sub-commands/remove/remove.service';
import { InitService } from './commands/mdm/sub-commands/init/init.service';
import { RunService } from './commands/mdm/services/run.service';
import { AskService } from './commands/mdm/services/ask.service';
import { LoggerService } from './services/Logger.service';
import { InstallCommand } from './commands/mdm/sub-commands/install/install.subcommand';
import { RemoveCommand } from './commands/mdm/sub-commands/remove/remove.subcommand';
import { InitCommand } from './commands/mdm/sub-commands/init/init.subcommand';
import { RunCommand } from './commands/mdm/sub-commands/run/run.subcommand';

@Module({
  providers: [
    MdmCommand,
    InstallCommand,
    RemoveCommand,
    InitCommand,
    RunCommand,
    BaseService,
    RemoveService,
    InstallService,
    InitService,
    RunService,
    AskService,
    LoggerService,
  ],
})
export class AppModule {}
