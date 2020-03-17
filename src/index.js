import webpackPlugin from './webpackPlugin';

class FileManagerPlugin {
  constructor (opts) {
    this.options = opts;
  }
  
  apply (compiler) {
    const options = webpackPlugin.translateHooks(this.options);
    const hookTypesMap = {
      'tap': (commands, options) => webpackPlugin.tabCallback(commands, options),
      'tapAsync': (commands, options) => webpackPlugin.tapAsyncCallback(commands, options)
    };
    for (const hookItem of options) {
      const { hookType, hookName, commands, registerName, globalOptions } = hookItem;
      if (!hookTypesMap[hookType]) continue;
      compiler.hooks[hookName][hookType](registerName, hookTypesMap[hookType](commands, globalOptions));
    }
  }
}

export default FileManagerPlugin;