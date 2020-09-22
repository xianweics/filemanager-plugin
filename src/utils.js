const colors = require('colors/safe');
const isTest = process.env.NODE_ENV === 'test';
const log = console.log;
const DEFAULT_TYPE = 'all';
const streamEqual = require('stream-equal');
const fs = require('fs-extra');
const { join } = require('path');

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
  },
};

export const flat = (arr) => {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : [cur]),
    []
  );
};

export const isSameFile = async (origin, target) => {
  let flag = true;
  const error = new Error('it is not same');
  try {
    await checkSame(origin, target);
  } catch (e) {
    flag = false;
  }

  async function checkSame(origin, target) {
    const originStat = fs.statSync(origin);
    const targetStat = fs.statSync(target);
    const originIsFile = originStat.isFile();
    const targetIsFile = targetStat.isFile();
    if (originIsFile ^ targetIsFile) {
      throw error;
    }

    if (originIsFile) {
      const originStream = fs.createReadStream(origin);
      const targetStream = fs.createReadStream(target);
      const result = await streamEqual(originStream, targetStream);
      if (!result) throw error;
    } else {
      const originFiles = fs.readdirSync(origin);
      const targetFiles = fs.readdirSync(target);
      if (originFiles.length !== targetFiles.length) {
        throw error;
      }
      for (let i = 0; i < originFiles.length; i++) {
        await checkSame(
          join(origin, originFiles[i]),
          join(target, targetFiles[i])
        );
      }
    }
  }

  return flag;
};
