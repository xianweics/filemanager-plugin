import FileManager from '../src/webpackPlugin';
import commander from '../src/commander';
import * as utils from '../src/utils';

const sinon = require('sinon');
const expect = require('chai').expect;

describe('Test webpack plugin file', () => {
  it(
    `Test handleCommand method. 'commander.del' method should be called, when 'handleCommand' is called with valid parameters`,
    async () => {
      const mockCommands = {
        del: {
          items: ['./dist']
        }
      };
      
      const del = sinon.stub(commander, 'del');
      const webpackFilemanager = new FileManager(mockCommands);
      await webpackFilemanager.handleCommand(mockCommands);
      
      expect(del.withArgs('./dist').called).equals(true);
      del.restore();
    });
  
  describe('Test translateHooks method', () => {
    it(
      `It will return expectable result, when the length of 'customHooks' equals to 0`,
      () => {
        const mockOptions = {
          events: {
            start: {
              del: {
                items: ['./dist']
              }
            },
            end: null,
            other: null
          }
        };
        const expectResult = [
          {
            hookType: 'tapAsync',
            hookName: 'beforeRun',
            registerName: 'REGISTER_beforeRun',
            commands: { del: { ...mockOptions.events.start.del } }
          }
        ];
        
        const fileManager = new FileManager(mockOptions);
        const realResult = fileManager.translateHooks();
        
        expect(realResult).eql(expectResult);
      });
    
    it(
      `It will return expectable result, when the length of 'customHooks' is greater than 0`,
      () => {
        const mockOptions = {
          customHooks: [
            {
              hookType: 'tapAsync',
              hookName: 'beforeRun',
              commands: {
                del: {
                  items: ['./dist1']
                }
              }
            },
            {
              hookType: 'tap',
              hookName: 'compile',
              registerName: 'customName',
              commands: {
                del: {
                  items: ['./dist2']
                }
              }
            }
          ],
          options: {
            parallel: 1
          }
        };
        const expectResult = [
          {
            hookType: 'tapAsync',
            hookName: 'beforeRun',
            registerName: 'REGISTER_beforeRun',
            commands: {
              del: {
                items: ['./dist1']
              }
            }
          },
          {
            hookType: 'tap',
            hookName: 'compile',
            registerName: 'customName',
            commands: {
              del: {
                items: ['./dist2']
              }
            }
          }
        ];
        const fileManager = new FileManager(mockOptions);
        const realResult = fileManager.translateHooks();
        
        expect(realResult).eql(expectResult);
      });
  });
  
  describe('Test apply method', () => {
    let fileManager = null;
    let mockCompiler = null;
    beforeEach(() => {
      mockCompiler = {
        hooks: {
          beforeRun: {
            tapAsync: sinon.stub()
          }
        }
      };
    });
    
    it(`'compiler.hooks[hookName][hookType]' should be called`, async () => {
      const mockOptions = {
        events: {
          start: {
            del: {
              items: ['./dist']
            }
          }
        }
      };
      fileManager = new FileManager(mockOptions);
      fileManager.apply(mockCompiler);
      
      expect(mockCompiler.hooks.beforeRun.tapAsync.calledWithMatch(
        'REGISTER_beforeRun')).equals(true);
    });
    
    it(
      `It will throw an error, when called 'compiler.hooks[hookName][hookType]' with an invalid 'hookType'`,
      () => {
        const handlerError = sinon.stub(utils.logger, 'error');
        expect(handlerError.called).equals(false);
        const mockOptions = {
          customHooks: [
            {
              hookType: 'otherTap',
              hookName: 'beforeRun',
              commands: {
                del: {
                  items: ['./dist1']
                }
              }
            },
            {
              hookType: 'tap',
              hookName: 'beforeRun',
              commands: {
                del: {
                  items: ['./dist1']
                }
              }
            }
          ]
        };
        fileManager = new FileManager(mockOptions);
        fileManager.apply(mockCompiler);
        
        expect(handlerError.called).equals(true);
        handlerError.restore();
      });
  });
});
