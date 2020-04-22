import { WebpackFilemanager } from '../src/index';
import commander from '../src/commander';

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
      const mockGlobalOptions = {
        parallel: 1
      };
      
      const del = sinon.stub(commander, 'del');
      await WebpackFilemanager.handleCommand(mockCommands, mockGlobalOptions);
      
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
            commands: { del: { ...mockOptions.events.start.del } },
            globalOptions: {}
          }
        ];
        const realResult = WebpackFilemanager.translateHooks(mockOptions);
        
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
            },
            globalOptions: {
              parallel: 1
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
            },
            globalOptions: {
              parallel: 1
            }
          }
        ];
        const realResult = WebpackFilemanager.translateHooks(mockOptions);
        
        expect(realResult).eql(expectResult);
      });
  });
  
  describe('Test apply method', () => {
    let webpackFilemanager = null;
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
      webpackFilemanager = new WebpackFilemanager(mockOptions);
      webpackFilemanager.apply(mockCompiler);
      
      expect(mockCompiler.hooks.beforeRun.tapAsync.calledWithMatch(
        'REGISTER_beforeRun')).equals(true);
    });
    
    it(
      `It will throw an error, when called 'compiler.hooks[hookName][hookType]' with an invalid 'hookType'`,
      () => {
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
        webpackFilemanager = new WebpackFilemanager(mockOptions);
        const result = webpackFilemanager.apply(mockCompiler);
        
        expect(result).instanceOf(Error);
      });
  });
});
