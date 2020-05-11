const colors = require('colors/safe');
const Progress = require('cli-progress');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;
const DEFAULT_TYPE = 'all';

export const logger = {
  BUILTIN_LOGS: ['all', 'error'],
  type: DEFAULT_TYPE,

  setType(type) {
    this.type = this.BUILTIN_LOGS.includes(type) ? type : DEFAULT_TYPE;
    return this;
  },
  info(msg) {
    if (isTest || this.type !== 'all') return;
    log(colors.green(msg));
  },
  error(msg) {
    if (isTest) return;
    log(colors.red(msg));
    process.exitCode = 1;
  }
};

export const progress = ({ taskName = 'Task', total = 0, start = 0 }) => {
  let progress = new Progress.Bar(
    {
      format: `${taskName}  ${colors.cyan(
        '{bar}'
      )} {percentage}% | {value}/{total}`
    },
    Progress.Presets.shades_classic
  );

  let count = start;
  progress.start(total, count);

  return {
    setSpeed(speed) {
      count += speed;
      count = count >= total ? total : count;
      progress.update(count);
      if (count >= total) {
        progress.stop();
        progress = null;
        console.info();
      }
    }
  };
};
