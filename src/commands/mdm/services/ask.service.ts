import { InquirerService } from 'nest-commander';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AskService {
  constructor(private readonly inquirerService: InquirerService) {}

  async chooseModule(modules: string[]) {
    const { chosenModule } = await this.inquirerService.inquirer.prompt<{
      chosenModule: string;
    }>({
      name: 'chosenModule',
      message: 'multiple modules found! please choose the module you want:',
      type: 'list',
      choices: modules,
    });

    return chosenModule;
  }
}
