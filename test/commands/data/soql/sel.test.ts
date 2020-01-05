import { expect, test } from '@salesforce/command/lib/test';
import { ensureString } from '@salesforce/ts-types';

describe('data:soql:gen', () => {

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      if (ensureString(request).includes('/describe')) {
        return Promise.resolve({
          fields: [{ name: 'Id' }, { name: 'LogUserId' }, { name: 'LogLength' }, { name: 'LastModifiedDate' }, { name: 'Request' },
          { name: 'Operation' }, { name: 'Application' }, { name: 'Status' }, { name: 'DurationMilliseconds' }, { name: 'SystemModstamp' },
          { name: 'StartTime' }, { name: 'Location' }]
        });
      }

    })
    .stdout()
    .command(['oa:data:soql:sel', '-f', 'ApexLog', '-u', 'test@org.com'])
    .it('runs oa:data:soql:sel -f ApexLog -u test@org.com', ctx => {
      expect(ctx.stdout).to.contain('SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog');
    });

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      if (ensureString(request).includes('/describe')) {
        return Promise.resolve({
          fields: [{ name: 'Id' }, { name: 'LogUserId' }, { name: 'LogLength' }, { name: 'LastModifiedDate' }, { name: 'Request' },
          { name: 'Operation' }, { name: 'Application' }, { name: 'Status' }, { name: 'DurationMilliseconds' }, { name: 'SystemModstamp' },
          { name: 'StartTime' }, { name: 'Location' }]
        });
      }

    })
    .stdout()
    .command(['oa:data:soql:sel', '-f', 'ApexLog', '-u', 'test@org.com', '--json'])
    .it('runs oa:data:soql:sel -f ApexLog -u test@org.com', ctx => {
      expect(ctx.stdout).to.contain('"query": "SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog"');
    });

  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      if (ensureString(request).includes('/describe')) {
        return Promise.reject({
          errorCode: 'NOT_FOUND', message: 'The requested resource does not exist'
        });
      }

    })
    .stdout()
    .command(['oa:data:soql:sel', '-f', 'ApexzLog', '-u', 'test@org.com'])
    .it('runs oa:data:soql:sel -f Apexz Log -u test@org.com', ctx => {
      expect(ctx.stdout).to.contain('The requested resource does not exist');
    });
});
