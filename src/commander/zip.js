import fs from 'fs';
import { handlerInfo, handlerError }  from '../utils';
import path from 'path';

const Compressing = require('compressing');
const fsExtra = require('fs-extra');
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
    const sources = glob.sync(source) || [];
    if (sources.length === 0) {
      handlerError(`zip error: '${source}' is not exist`);
      return;
    }
    if (type === 'gzip') {
      // gzip
      const hasDirectory = sources.find(source => fs.statSync(source).isDirectory());
      if (sources.length > 1 || hasDirectory) {
        handlerError(`zip error: Gzip only support compressing a single file`);
        return;
      }
      await Compressing.gzip.compressFile(source, destination);
      handlerInfo(`success: zip '${source}' to '${destination}'`);
    } else {
      // tar, zip, tgz
      const targetStream = new Compressing[type].Stream();
      for (const item of sources) {
        targetStream.addEntry(item);
      }
      targetStream.pipe(fs.createWriteStream(destination));
      handlerInfo(`success: zip '${source}' to '${destination}'`);
    }
  } catch (e) {
    handlerError(`zip error: ${e}`);
    return e;
  }
};

export default zip;
