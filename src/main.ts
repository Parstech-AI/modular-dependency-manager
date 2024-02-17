#!/usr/bin/env node
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';
import { Logger } from '@nestjs/common';

(async () => {
  await CommandFactory.run(AppModule, new Logger());
})();
