import chai, { expect } from 'chai';
import * as Sinon from 'sinon';
import { NewmanPlugin } from './../../src/NewmanPlugin';

describe('Newman', () => {
  let eb;
  const sandbox = Sinon.sandbox.create();
  const serverless = {
    cli: {},
    service: {},
    getProvider: sandbox.stub(),
  };

  beforeEach(() => {
    eb = new NewmanPlugin(serverless, {});
  });

  it('new Newman', () => {
    expect(eb).to.be.an.instanceOf(NewmanPlugin);
    expect(eb.serverless.getProvider).to.have.been.called();
    expect(eb.options).to.deep.equal({});
  });
});
