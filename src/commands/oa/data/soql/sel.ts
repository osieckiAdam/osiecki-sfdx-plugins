import { core, flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import clipboardy = require('clipboardy');

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('osiecki-sfdx-plugins', 'sel');

export default class Sel extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    `sfdx oa:data:soql:sel -f ApexLog
    Your query was succesfully copied to clipboard:
    SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds,
    SystemModstamp, StartTime, Location FROM ApexLog
    `,
    `sfdx oa:data:soql:sel -f ApexLog --json
    {
      "status": 0,
      "result": {
        "query": "SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status,
        DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog"
      }
    }
    `,
    `sfdx oa:data:soql:sel -f ApexLog -w "LogLength > 100"
    Your query was succesfully copied to clipboard:
    SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds,
    SystemModstamp, StartTime, Location FROM ApexLog WHERE Where LogLength > 100
    `
  ];

  protected static requiresUsername = true;
  protected static flagsConfig = {
    from: flags.string({ char: 'f', required: true, description: messages.getMessage('fromFlagDescription') }),
    where: flags.string({ char: 'w', description: messages.getMessage('whereFlagDescription') })
  };

  public async run(): Promise<AnyJson> {
    let query: string = '';
    if (this.flags.from) {
      this.ux.log(this.flags.from);
    }
    const conn = this.org.getConnection();
    await conn.sobject(this.flags.from).find().where(this.flags.where)
      .toSOQL((err, res) => {
        if (err) {
          this.ux.log(err.message);
        } else {
          query += res;
          clipboardy.writeSync(res);
          this.ux.log('Your query was succesfully copied to clipboard:\n' + res);
        }
      });
    return { query };
  }
}
