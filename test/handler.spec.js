import { cacheSingle, handleCommand } from '../src/handler';
import commander from '../src/commander';
import * as masterCluster from '../src/masterCluster';

const sinon = require('sinon');
const expect = require('chai').expect;

describe('Test handler file', () => {
  it(
    `Test cacheSingle method: 'cacheSingle' should be the same as the previous one that created`,
    () => {
      const cs = cacheSingle();
      expect(cs).eql(cacheSingle());
    });
  
  describe('Test handleCommand', () => {
    it(
      `'globalOptions' with 'parallel' pass the parameter, 'masterCluster' method should be called`,
      async () => {
        const mockMasterCluster = sinon.stub(masterCluster, 'default');
        await handleCommand({
          del: {
            items: ['./cache']
          },
          copy: {},
          move: null
        }, {
          parallel: true
        });
        
        expect(mockMasterCluster.called).equals(true);
        mockMasterCluster.restore();
      }
    );
    it(
      `'globalOptions' without 'parallel' pass the parameter, 'commander' method should be called`,
      async () => {
        const commanderDel = sinon.stub(commander, 'del');
        await handleCommand({
          del: {
            items: ['./cache']
          }
        }, {
          cache: false
        });
        expect(commanderDel.called).equals(true);
        commanderDel.restore();
      }
    );
    
    it(
      `'globalOptions with truly cache pass the parameter and handleCommand function runs twice,
      cache would be effected and commander action would only run once`,
      async () => {
        const commanderCopy = sinon.stub(commander, 'copy');
        await handleCommand({
          copy: {
            items: [
              {
                source: './cache',
                destination: './cache'
              }]
          }
        });
        
        await handleCommand({
          copy: {
            items: [
              {
                source: './cache',
                destination: './cache'
              }]
          }
          
        }, { cache: true });
        expect(commanderCopy.calledOnce).equals(true);
        commanderCopy.restore();
      }
    );
  });
});
