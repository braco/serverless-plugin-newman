
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Newman from './../../src';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('Newman', () => {
  let eb;
  const sandbox = sinon.sandbox.create();
  const serverless = {
    cli: {},
    service: {},
    getProvider: sandbox.stub(),
  };

  beforeEach(() => {
    eb = new Newman(serverless, {});
  });

  it('new Newman', () => {
    expect(eb).to.be.an.instanceOf(Newman);
    expect(eb.serverless.getProvider).to.have.been.called();
    expect(eb.options).to.deep.equal({});
  });
});
