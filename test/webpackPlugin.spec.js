import FileManager from '../src/webpackPlugin';
import * as utils from '../src/utils';
import * as handler from '../src/handler';

const sinon = require('sinon');
const expect = require('chai').expect;

describe('Test webpack plugin file', () => {
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
            hookName: 'beforeCompile',
            hookType: 'tapAsync',
            registerName: 'REGISTER_beforeCompile',
            commands: { ...mockOptions.events.start }
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
              hookName: 'beforeCompile',
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
            hookName: 'beforeCompile',
            registerName: 'REGISTER_beforeCompile',
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
    let mockCompiler = null;
    beforeEach(() => {
      mockCompiler = {
        hooks: {
          beforeCompile: {
            tapAsync: sinon.stub()
          }
        }
      };
    });
    
    it(`'compiler.hooks[hookName][hookType]' should be called`, () => {
      const mockOptions = {
        events: {
          start: {
            del: {
              items: ['./dist']
            }
          }
        }
      };
      const fileManager = new FileManager(mockOptions);
      fileManager.apply(mockCompiler);
      
      expect(mockCompiler.hooks.beforeCompile.tapAsync.calledWithMatch(
        'REGISTER_beforeCompile')).equals(true);
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
              hookName: 'beforeCompile',
              commands: {
                del: {
                  items: ['./dist1']
                }
              }
            }
          ]
        };
        const fileManager = new FileManager(mockOptions);
        
        fileManager.apply(mockCompiler);
        expect(handlerError.called).equals(true);
        handlerError.restore();
      });
  });
  
  
  it('Test hooksRegisterCallback methods', () => {
    const handleCommand = sinon.stub(handler, 'handleCommand');
    const fileManager = new FileManager();
    const hooksRegisterCb = fileManager.hooksRegisterCallback([]);
    expect(typeof hooksRegisterCb).equals('function');
  
    hooksRegisterCb(sinon.stub(), sinon.stub());
    expect(handleCommand.called).equals(true);
    handleCommand.restore();
    // expect(stub.called).equals(true);
  });
  
  describe('Test webpackPlugin constructor', () => {
    it(`this opts will be '{}', when params is not object`, () => {
      const fileManager = new FileManager();
      expect(fileManager.opts).to.eql({});
    });
    it(`this opts will pass through params, when params is an object`, () => {
      const fileManager = new FileManager({
        events: {}
      });
      expect(fileManager.opts).to.eql({ events: {} });
    });
  });
});
