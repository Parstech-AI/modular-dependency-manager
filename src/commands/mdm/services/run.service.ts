import { exec, spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../services/Logger.service';

@Injectable()
export class RunService {
  constructor(private readonly logService: LoggerService) {}

  exec(command: string) {
    return new Promise((resolve, reject) => {
      exec(command, async (err, stdout, stderr) => {
        if (err) {
          reject(err);
          return;
        }

        if (stderr) reject(stderr);
        else resolve(stdout);
      });
    });
  }

  run(command: string, options?: string[]) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, options);

      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        this.logService.log(chunk);
      });

      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk) => {
        this.logService.error(chunk);
      });

      child.on('close', (code, signal) => {
        if (signal) reject(code);
        else resolve(true);
      });
    });
  }
}
