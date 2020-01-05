import { $$, expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';
import { EventEmitter } from 'events';
import * as deleteClass from '../../../../src/commands/oa/apex/log/delete';

class BatchMock extends EventEmitter { public poll() { } }
const mockSubscripton = new BatchMock();
const requestTimeout = 700;

describe('apex:log:delete, 2 records queried', () => {
  beforeEach(() => {
    // @ts-ignore
    $$.SANDBOX.stub(deleteClass.default.prototype, 'createBatch').callsFake(() => {
      return mockSubscripton;
    });
    setTimeout(() => {
      mockSubscripton.emit('queue', { jobId: '1231233' });
    }, requestTimeout);

  });

  afterEach(() => {
    mockSubscripton.removeAllListeners('queue');
    mockSubscripton.removeAllListeners('progress');
    mockSubscripton.removeAllListeners('error');
  });

  describe('apex:log:delete', () => {

    beforeEach(() => {
      setTimeout(() => {
        mockSubscripton.emit('progress', { numberRecordsProcessed: '1' });
      }, requestTimeout + 100);
      setTimeout(() => {
        mockSubscripton.emit('response', [{ id: '07L1w000007NcJtEAK', success: true, errors: [] }, { id: '07L1w000007NcJoEAK', success: true, errors: [] }]);
      }, requestTimeout + 200);
    });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com'])
      .it('runs oa:apex:log:delete -u test@org.com', ctx => {
        expect(ctx.stdout).to.contain('Number of ApexLog records to be deleted: 2');
        expect(ctx.stdout).to.contain('Delete job is started. Id of the job: 1231233');
        expect(ctx.stdout).to.contain('Processed records: 1 / 2');
        expect(ctx.stdout).to.contain('Processed records: 2 / 2');
        expect(ctx.stdout).to.contain('Job is finished');
        expect(ctx.stdout).to.contain('All records were deleted sucessfully');
      });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com', '--json'])
      .it('runs oa:apex:log:delete -u test@org.com --json', ctx => {
        expect(ctx.stdout).to.contain('"numberOfQueriedLogs": 2');
        expect(ctx.stdout).to.contain('"jobID": "1231233"');
      });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com', '-a'])
      .it('runs oa:apex:log:delete -u test@org.com -a', ctx => {
        expect(ctx.stdout).to.contain('Number of ApexLog records to be deleted: 2');
        expect(ctx.stdout).to.contain('Delete job is started. Id of the job: 1231233');
        expect(ctx.stdout).to.contain("To poll status of the job, run command 'sfdx force:data:bulk:status -i 1231233 -u test@org.com");
      });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com', '-a', '--json'])
      .it('runs oa:apex:log:delete -u test@org.com -a --json', ctx => {
        expect(ctx.stdout).to.contain('"numberOfQueriedLogs": 2');
        expect(ctx.stdout).to.contain('"jobID": "1231233"');
      });
  });

  describe('apex:log:delete, 1 record failed', () => {

    beforeEach(() => {
      setTimeout(() => {
        mockSubscripton.emit('response',
          [{ id: '07L1w000007NcJtEAK', success: true, errors: [] }, { id: '07L1w000007NcJoEAK', success: false, errors: ['test error'] }]);
      }, requestTimeout);
    });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com'])
      .it('runs oa:apex:log:delete -u test@org.com', ctx => {
        expect(ctx.stdout).to.contain('Number of failed records: 1');
      });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ id: '07L1w000007NcJtEAK', success: true, errors: [] }, { id: '07L1w000007NcJoEAK', success: false, errors: ['test error'] }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com', '--json'])
      .it('runs oa:apex:log:delete -u test@org.com --json', ctx => {
        expect(ctx.stdout).to.contain('"numberOfFailedRecords": 1');
      });
  });

  describe('apex:log:delete returns error', () => {

    beforeEach(() => {
      setTimeout(() => {
        mockSubscripton.emit('error', ('test error message'));
      }, requestTimeout);
    });

    test
      .withOrg({ username: 'test@org.com' }, true)
      .withConnectionRequest(request => {
        const requestMap = ensureJsonMap(request);
        if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
          return Promise.resolve({ done: true, records: [{ Id: '07L1w000007OMcYEAW' }, { Id: '07L1w000007OMchEAG' }] });
        }
        return Promise.resolve({ records: [] });
      })
      .stdout()
      .command(['oa:apex:log:delete', '-u', 'test@org.com'])
      .it('runs oa:apex:log:delete -u test@org.com', ctx => {
        expect(ctx.stdout).to.contain('test error message');
      });
  });
});

describe('apex:log:delete, check only', () => {

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
        return Promise.resolve({ done: true, records: [{ id: '07L1w000007NcJtEAK', success: true, errors: [] }, { id: '07L1w000007NcJoEAK', success: false, errors: ['test error'] }] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['oa:apex:log:delete', '-u', 'test@org.com', '-c'])
    .it('runs oa:apex:log:delete -u test@org.com -c', ctx => {
      expect(ctx.stdout).to.contain('Number of ApexLog records to be deleted: 2');
    });

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
        return Promise.resolve({ done: true, records: [{ id: '07L1w000007NcJtEAK', success: true, errors: [] }, { id: '07L1w000007NcJoEAK', success: false, errors: ['test error'] }] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['oa:apex:log:delete', '-u', 'test@org.com', '-c', '--json'])
    .it('runs oa:apex:log:delete -u test@org.com -c --json', ctx => {
      expect(ctx.stdout).to.contain('"numberOfQueriedLogs": 2');
    });
});

describe('apex:log:delete, zero logs queried', () => {

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
        return Promise.resolve({ done: true, records: [] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['oa:apex:log:delete', '-u', 'test@org.com'])
    .it('runs oa:apex:log:delete -u test@org.com', ctx => {
      expect(ctx.stdout).to.contain('There are no Apex logs on Your org!');
    });

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match('q=SELECT%20Id%20FROM%20ApexLog')) {
        return Promise.resolve({ done: true, records: [] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['oa:apex:log:delete', '-u', 'test@org.com', '--json'])
    .it('runs oa:apex:log:delete -u test@org.com --json', ctx => {
      expect(ctx.stdout).to.contain('"numberOfQueriedLogs": 0');
    });
});
