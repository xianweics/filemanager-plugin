const expect = require('chai').expect;
import { checkType } from '../src/utils';

describe('test utils', () => {
  it('test checkType method', () => {
    const isObject = checkType.isObject({});
    expect(isObject).equals(true);
  });
});
