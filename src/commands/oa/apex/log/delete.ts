import { SfdxCommand, flags, core } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('osiecki-sfdx-plugins', 'delete');

export default class Delete extends SfdxCommand {

    public static description = messages.getMessage('deleteCommandDescription');
    protected static requiresUsername = true;
    protected static flagsConfig = {
        checkonly: flags.boolean({ char: 'c', description: messages.getMessage('checkOnlyFlagDescription') }),
        async: flags.boolean({ char: 'a', description: messages.getMessage('asyncFlagDescription') })
    };
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
    To poll status of the job, run command 'sfdx force:data:bulk:status -i 7501w000002WEsi'`
    ];

    public async run(): Promise<AnyJson> {
        let resultsLength = 0;
        const that = this;
        const conn = this.org.getConnection();

        conn
            .sobject("ApexLog")
            .find({}, ["Id"])
            .limit(100)
            .sort({ LogLength: -1 })
            .execute({ autoFetch: true, maxFetch: 10000 }, function (err, records) {
                if (err) {
                    return console.error(err);
                }
                resultsLength = records.length;

                let job = conn.bulk.createJob("ApexLog", "delete");
                if (records.length > 0) {
                    that.ux.log(messages.getMessage('recordsLenghtMessage', [records.length]));
                    if (!that.flags.checkonly) {
                        let batch = job.createBatch();
                        batch.execute(records);
                        batch.on("queue", batchInfo => {
                            that.ux.log(messages.getMessage("jobStartedMessage", [batchInfo.jobId]));
                            if (that.flags.async) {
                                return that.ux.log(messages.getMessage("jobStartedMessageAsync", [batchInfo.jobId, that.flags.targetusername]));
                            }
                            batch.poll(2000, 10000000);
                        });
                        batch.on("progress", response => {
                            batch.check().then(batchInfo => {
                                process.stdout.write(
                                    "\x1Bc\rProcessed records: " +
                                    //@ts-ignore
                                    batchInfo.numberRecordsProcessed +
                                    " / " +
                                    records.length
                                );
                            });
                        });
                        batch.on("response", response => {
                            batch.check().then(batchDetails => {
                                that.ux.log(
                                    //@ts-ignore
                                    messages.getMessage("jobFinishedMessage", [batchDetails.state, batchDetails.totalProcessingTime])
                                );
                                //@ts-ignore
                                if (batchDetails.numberRecordsFailed !== "0") {
                                    that.ux.log(
                                        //@ts-ignore
                                        messages.getMessage("failedRecordsMessage", [batchDetails.numberRecordsFailed])
                                    );
                                } else {
                                    that.ux.log(messages.getMessage("successMessage"));
                                }
                            });
                        });
                        batch.on("error", response => {
                            return console.error(response);
                        });
                    }
                } else {
                    that.ux.log(messages.getMessage('noLogsMessage'));
                }
            });
        return { numberOfQueriedLogs: resultsLength };
    }
}
