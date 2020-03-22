import { sleepAsync } from './utils';

function rollupPlugin(opts) {
  console.info(opts);
  return {
    name: 'file-manager',
    async generateBundle() {
      console.info('generateBundle... wait');
      await sleepAsync(1);
      console.info('generateBundle');
    },
    async buildStart() {
      console.info('build start... wait');
      await sleepAsync(2);
      console.info('build start');
    }
  };
}
export default rollupPlugin;
