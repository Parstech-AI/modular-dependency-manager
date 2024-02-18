#!/usr/bin/env node
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

(async () => {
  await CommandFactory.run(AppModule, { version: '0.0.8' });
})();
