import { flat } from '../src/utils';

const expect = require('chai').expect;

describe('Test utils', () => {
  it('Test flat method', () => {
    expect(flat([1, 2, [3, [4]]])).eql([1, 2, 3, 4]);
  });
});
