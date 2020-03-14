const chai = require('chai');
const expect = chai.expect;
const utils = require('../src/utils');

describe('test utils', () => {
  it('test checkType method', () => {
    const isObject = utils.checkType.isObject({});
    expect(isObject).to.be.true;
  });
});