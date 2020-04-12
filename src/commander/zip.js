const compressing = require('compressing');
const fsExtra = require('fs-extra');
import fs from 'fs';
import { handlerError, handlerInfo } from '../utils';
import path from 'path';

const glob = require('glob');

/**
 * @desc Zip file/folder. Support zip, tar, gzip.
 * @param source {string}
 * @param destination {string}
 * @param type {string}
 * @param option {Object}
 * @returns {Promise<void>}
 */
const zip = async ({ source, destination, type = 'zip' }) => {
  try {
    await fsExtra.ensureDir(path.dirname(destination));
    const targetStream = new compressing[type].Stream();
    const sources = glob.sync(source);
    if (
      (sources.length > 1 || fs.statSync(sources[0]).isDirectory()) &&
      type === 'gzip'
    ) {
      handlerError(`zip error: Gzip only support compressing a single file`);
    }
    sources.forEach(item => {
      targetStream.addEntry(item);
    });
    targetStream.pipe(fs.createWriteStream(destination)).on('error', err => {
      console.log(err);
    });
    handlerInfo(`success: zip '${source}' to '${destination}'`);
  } catch (e) {
    handlerError(`zip error: ${e}`);
  }
};

export default zip;
