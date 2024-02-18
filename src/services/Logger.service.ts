import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements ILoggerService {
  log(message: any): any {
    console.log(message);
  }

  info(message: any): any {
    console.info(message);
  }

  warn(message: any): any {
    console.warn(message);
  }

  error(message: any): any {
    console.error(message);
  }
}
