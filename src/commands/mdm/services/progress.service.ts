import { Bar } from 'cli-progress';

export class ProgressService {
  private bar: Bar;

  constructor(title: string) {
    this.bar = new Bar({
      format: `${title} | {bar} | {percentage}% || {value}/{total} Chunks`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });
  }

  start(total: number, startValue = 0) {
    this.bar.start(total, startValue);
  }

  increment(value?: number) {
    this.bar.increment(value);
  }

  setTotal(value: number) {
    this.bar.setTotal(value);
  }

  stop() {
    this.bar.stop();
  }
}
