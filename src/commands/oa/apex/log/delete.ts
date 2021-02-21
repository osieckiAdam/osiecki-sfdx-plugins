import { core, flags, SfdxCommand } from '@salesforce/command';
import { Batch } from '@salesforce/core/node_modules/@types/jsforce';
import { AnyJson } from '@salesforce/ts-types';

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('osiecki-sfdx-plugins', 'delete');

export default class Delete extends SfdxCommand {
  public static description = messages.getMessage('deleteCommandDescription');
  public static examples = [
    `
sfdx oa:apex:log:delete
    Number of ApexLog records to be deleted: 100
    Delete job is started. Id of the job: 7501w000002WA2EAAW
    Processed records: 100 / 100
    Job is finished, status of the job is: Completed
    Total processing time was 2154 ms
    All records were deleted sucessfully`,
    `
sfdx oa:apex:log:delete -c -u username@your.org
    Number of ApexLog records to be deleted: 10`,
    `
sfdx oa:apex:log:delete --async
    Number of ApexLog records to be deleted: 7
    Delete job is started. Id of the job: 7501w000002WEuKAAW
    To poll status of the job, run command 'sfdx force:data:bulk:status -i 7501w000002WEsi'`,
    `
sfdx oa:apex:log:delete --json'
    {
      "status": 0,
      "result": {
        "numberOfQueriedLogs": 3,
        "jobID": "7501w000002WnWcAAK"
      }
    }`,
    `
sfdx oa:apex:log:delete -s "Internal Salesforce.com Error,success"
    Query: SELECT Id FROM ApexLog WHERE Status IN ('Internal Salesforce.com Error','success') does not return any record`,
    `
sfdx oa:apex:log:delete -m
    Query: SELECT Id FROM ApexLog WHERE LogUserId = '0054J000005OInNQAW' does not return any record`,
    `
oa:apex:log:delete -c -n test1@user.org,test2@user.org
    Query: SELECT Id FROM ApexLog WHERE LogUser.Username IN ('test1@user.org','test2@user.org') does not return any record`
  ];

  protected static requiresUsername = true;
  protected static flagsConfig = {
    checkonly: flags.boolean({ char: 'c', description: messages.getMessage('checkOnlyFlagDescription') }),
    async: flags.boolean({ char: 'a', description: messages.getMessage('asyncFlagDescription') }),
    status: flags.array({ char: 's', description: messages.getMessage('statusFlagDescription') }),
    name: flags.array({ char: 'n', description: messages.getMessage('nameFlagDescription') }),
    my: flags.boolean({ char: 'm', description: messages.getMessage('myFlagDescription') })
  };
  private queryString: string;

  public async run(): Promise<AnyJson> {

    let response: AnyJson = ({ numberOfQueriedLogs: 0 });
    const conn = this.org.getConnection();

    const apexLogRecords = await this.getApexLogs(conn);

    if (apexLogRecords && apexLogRecords.length > 0) {
      this.ux.log(messages.getMessage('recordsLenghtMessage', [apexLogRecords.length]));
      if (this.flags.checkonly) {
        response = ({ numberOfQueriedLogs: apexLogRecords.length });
      } else {
        const batch = this.createBatch(conn, apexLogRecords);
        response = await this.trackBatchProgress(batch, apexLogRecords.length);
      }
    } else {
      this.ux.log(messages.getMessage('query') + this.queryString + ' ' + messages.getMessage('doesNotReturnAnyRecord'));
      response = ({ numberOfQueriedLogs: 0 });
    }
    return response;
  }

  public async getApexLogs(conn: core.Connection) {

    let query = this.org.getConnection()
      .sobject('ApexLog')
      .find({}, ['Id']);

    const whereClause = await this.buildWhereClause(conn);
    if (whereClause) {
      query = query.where(whereClause);
    }
    this.queryString = await query.toSOQL((err, soql) => {
      return soql;
    });

    const response = query.execute({ autoFetch: true, maxFetch: 20000 }, async (err, records) => {
      return records;
    });
    return response;
  }

  private async buildWhereClause(conn: core.Connection): Promise<string> {

    const whereClause: string[] = new Array<string>();
    if (this.flags.my) {
      const identitystr = (await conn.identity()).user_id;
      whereClause.push("LogUserId = '" + identitystr + "'");
    } else if (this.flags.name) {
      const formatedNames = this.flags.name.reduce((acc, currval) => {
        return acc + '\'' + currval + '\',';
      }, '').slice(0, -1);
      whereClause.push(`LogUser.Username IN (${formatedNames})`);
    }

    if (this.flags.status) {
      const formatedStatuses = this.flags.status.reduce((acc, currval) => {
        return acc + '\'' + currval + '\',';
      }, '').slice(0, -1);
      whereClause.push(`Status IN (${formatedStatuses})`);
    }

    if (whereClause.length) {
      return whereClause.join(' AND ');
    }
    return '';
  }

  private createBatch(conn: core.Connection, records: Array<{ Id?: string; }>): Batch {
    return conn.bulk.createJob('ApexLog', 'delete').createBatch().execute(records);
  }

  private async trackBatchProgress(batch: Batch, totalNumberOfRecords: number) {
    let jobId: string;
    interface JobResultItem {
      id: string;
      success: boolean;
      errors: AnyJson[];
    }

    const failedRecords: JobResultItem[] = new Array();
    const response = await new Promise<AnyJson>((resolve, reject) => {
      batch.on('queue', batchDetails => {

        jobId = batchDetails.jobId;
        this.ux.log(messages.getMessage('jobStartedMessage', [jobId]));
        if (this.flags.async) {
          this.ux.log(messages.getMessage('jobStartedMessageAsync', [jobId, this.org.getConnection().getUsername()]));
          resolve({ numberOfQueriedLogs: totalNumberOfRecords, jobID: jobId });
        } else {
          batch.poll(2000, 10000000);
          if (!this.flags.json) {
            batch.on('progress', batchInfo => {
              this.logProgress(batchInfo.numberRecordsProcessed, totalNumberOfRecords);
            });
          }
          batch.on('response', records => {
            records.forEach((element: JobResultItem) => {
              if (!element.success) {
                failedRecords.push(element);
              }
            });
            if (!this.flags.json) {
              this.logProgress(records.length, totalNumberOfRecords);
            }
            this.ux.log(messages.getMessage('jobFinishedMessage'));
            if (failedRecords.length > 0) {
              this.ux.log(messages.getMessage('failedRecordsMessage', [failedRecords.length]));
            } else {
              this.ux.log(messages.getMessage('successMessage'));
            }
            resolve({ numberOfQueriedLogs: totalNumberOfRecords, jobID: jobId, numberOfFailedRecords: failedRecords.length });
          });
          batch.on('error', res => {
            console.log(res);
            reject(res);
          });
        }
      });
    });
    return response;
  }

  private logProgress(processedItems: string, totalItems: number): void {
    process.stdout.write('\x1Bc\rProcessed records: ' + processedItems + ' / ' + totalItems);
  }
}
