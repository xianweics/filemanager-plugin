const chai = require('chai');
const expect = chai.expect;
import fileManager, { createHooks, extractHooks } from '../src/rollupPlugin';

describe('Test rollup plugin file', () => {
  describe(`Test 'extractHooks' method.`, () => {
    it(
      `When configured 'events' and 'customHooks', it will return the configuration items for 'customHooks'`,
      async () => {
        const mockOptions = {
          events: {
            start: {
              del: {
                items: ['./dist']
              }
            },
            other: {}
          },
          customHooks: [
            {
              hookName: 'buildEnd',
              commands: {
                del: {
                  items: ['./dist1']
                }
              }
            }
          ]
        };
        
        const result = [
          {
            hookName: 'buildEnd',
            commands: {
              del: {
                items: ['./dist1']
              }
            },
            globalOptions: {}
          }
        ];
        const testResult = await extractHooks(mockOptions);
        expect(testResult).eql(result);
      });
    
    it(
      `No configuration 'events' and 'customHooks', it will return an empty array `,
      async () => {
        const result = await extractHooks({});
        expect(result).eql([]);
      });
    
    it('Return format hooks, when opts with valid events is given', () => {
      const result = extractHooks({
        events: {
          start: {
            del: {}
          }
        }
      });
      expect(result).eql([
        {
          hookName: 'buildStart',
          commands: { del: {} },
          globalOptions: {}
        }]);
    });
  
    it('Return format hooks, when opts with invalid events is given', () => {
      const result = extractHooks({
        events: {
          startOther: {
            del: {}
          }
        }
      });
      expect(result).eql([]);
    });
  });
  
  describe(`Test 'createHooks' method`, () => {
    it(
      `When configured 'createHooks', it will return objects whose properties are async functions`,
      async () => {
        const mockCustomHooks = [
          {
            hookName: 'buildEnd',
            commands: {
              del: {
                items: ['./dist1']
              }
            }
          }
        ];
        const testResult = await createHooks(mockCustomHooks);
        const resKeys = Object.keys(testResult);
        expect(resKeys.length).equals(1);
        for (let key of resKeys) {
          expect(typeof testResult[key] === 'function').equals(true);
        }
      }
    );
    
    it(`No 'hooks',it will return an empty object`, async () => {
      const mockHooks = [];
      const result = {};
      const testResult = await createHooks(mockHooks);
      expect(testResult).eql(result);
    });
  });
  
  describe(`Test 'rollupPlugin' method`, () => {
    it(
      `Function execution return value is an object composed of hooks and name`,
      () => {
        const mockOptions = {
          customHooks: [
            {
              hookName: 'buildStart',
              commands: {
                del: {
                  items: ['./dist2']
                }
              }
            },
            {
              hookName: 'generateBundle',
              commands: {
                del: {
                  items: ['./dist3']
                }
              }
            }
          ]
        };
        const testResult = fileManager(mockOptions);
        const resKeys = Object.keys(testResult);
        expect(resKeys.length).equals(3);
        for (let key of resKeys) {
          if (key === 'name') {
            expect(testResult[key]).equals('file-manager');
          } else {
            expect(typeof testResult[key] === 'function').equals(true);
          }
        }
      }
    );
    
    it('Return undefined, if the params do not pass an object', () => {
      const result = fileManager();
      expect(result).to.be.an('undefined');
    });
  });
});
