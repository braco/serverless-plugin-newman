import { expect } from 'chai';
import * as Serverless from 'serverless';
import * as Sinon from 'sinon';
import NewmanPlugin from './../../src/NewmanPlugin';

describe('Newman', () => {
  let eb;
  const sandbox = Sinon.sandbox.create();
  let serverless;

  const options = { env: 'test', region: 'eu-west-1' };

  beforeEach(() => {
    serverless = new Serverless({});
    eb = new NewmanPlugin(serverless, options);
  });

  it('new Newman', () => {
    expect(eb).to.be.an.instanceOf(NewmanPlugin);
    // expect(eb.serverless.getProvider).to.have.been.called();
    expect(eb.options).to.deep.equal(options);
  });
});
