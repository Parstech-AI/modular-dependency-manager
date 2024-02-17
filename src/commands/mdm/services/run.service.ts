import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RunService {
  run(command: string) {
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
}
