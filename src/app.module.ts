import { Logger, Module } from '@nestjs/common';
import { MdmCommand } from './commands/mdm/mdm.command';
import { InstallService } from './commands/mdm/sub-commands/install/install.service';
import { RemoveService } from './commands/mdm/sub-commands/remove/remove.service';
import { AskService } from './commands/mdm/services/ask.service';
import { BaseService } from './commands/mdm/services/base.service';
import { InitService } from './commands/mdm/sub-commands/init/init.service';
import { RunService } from './commands/mdm/services/run.service';

@Module({
  providers: [
    ...MdmCommand.registerWithSubCommands(),
    BaseService,
    RemoveService,
    InstallService,
    InitService,
    RunService,
    AskService,
    Logger,
  ],
})
export class AppModule {}
