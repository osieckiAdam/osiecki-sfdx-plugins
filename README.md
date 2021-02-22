# osiecki-sfdx-plugins

A plugin for the Salesforce CLI built by Adam Osiecki

[![Version](https://img.shields.io/npm/v/osiecki-sfdx-plugins.svg)](https://npmjs.org/package/osiecki-sfdx-plugins)
[![CircleCI](https://circleci.com/gh/osieckiAdam/osiecki-sfdx-plugins/tree/master.svg?style=shield)](https://circleci.com/gh/osieckiAdam/osiecki-sfdx-plugins/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/osieckiAdam/osiecki-sfdx-plugins?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/osiecki-sfdx-plugins/branch/master)
[![Codecov](https://codecov.io/gh/osieckiAdam/osiecki-sfdx-plugins/branch/master/graph/badge.svg)](https://codecov.io/gh/osieckiAdam/osiecki-sfdx-plugins)
[![Downloads/week](https://img.shields.io/npm/dw/osiecki-sfdx-plugins.svg)](https://npmjs.org/package/osiecki-sfdx-plugins)
[![License](https://img.shields.io/npm/l/osiecki-sfdx-plugins.svg)](https://github.com/osieckiAdam/osiecki-sfdx-plugins/blob/master/package.json) 
[![Greenkeeper badge](https://badges.greenkeeper.io/osieckiAdam/osiecki-sfdx-plugins.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/osieckiAdam/osiecki-sfdx-plugins/badge.svg)](https://snyk.io/test/github/osieckiAdam/osiecki-sfdx-plugins)

## Setup

To install this plugin You need to have [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) installed on Your system.

**Install as plugin:**

```sh-session
$ sfdx plugins:install osiecki-sfdx-plugins
```

To check if installation was successful You can use command:

```sh-session
$ sfdx plugins
```

To update plugins You can use:

```sh-session
$ sfdx plugins:update
```

**Install from source:**

Clone the repository:

```sh-session
git clone https://github.com/osieckiAdam/osiecki-sfdx-plugins.git
```

Install using yarn:

```
yarn install
```

Link the plugin

```
sfdx plugins:link
```

<!-- install -->

## Commands

<!-- commands -->
* [`sfdx oa:apex:log:delete [-c] [-a] [-s <array>] [-n <array>] [-m] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-oaapexlogdelete--c--a--s-array--n-array--m--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx oa:data:soql:sel -f <string> [-w <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-oadatasoqlsel--f-string--w-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx oa:apex:log:delete [-c] [-a] [-s <array>] [-n <array>] [-m] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

delete ApexLog entries from Your org

```
delete ApexLog entries from Your org

USAGE
  $ sfdx oa:apex:log:delete [-c] [-a] [-s <array>] [-n <array>] [-m] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --async                                                                       do not wait for successful
                                                                                    completion of the job. If ommited
                                                                                    will poll for number of processed
                                                                                    records until complete

  -c, --checkonly                                                                   use this parameter to only check
                                                                                    number of debug logs without
                                                                                    deleting them

  -m, --my                                                                          delete only my logs

  -n, --name=name                                                                   delete only logs created by
                                                                                    specified user names

  -s, --status=status                                                               delete only logs with specified
                                                                                    statuses

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES

  sfdx oa:apex:log:delete
       Number of ApexLog records to be deleted: 100
       Delete job is started. Id of the job: 7501w000002WA2EAAW
       Processed records: 100 / 100
       Job is finished, status of the job is: Completed
       Total processing time was 2154 ms
       All records were deleted sucessfully

  sfdx oa:apex:log:delete -c -u username@your.org
       Number of ApexLog records to be deleted: 10

  sfdx oa:apex:log:delete --async
       Number of ApexLog records to be deleted: 7
       Delete job is started. Id of the job: 7501w000002WEuKAAW
       To poll status of the job, run command 'sfdx force:data:bulk:status -i 7501w000002WEsi'

  sfdx oa:apex:log:delete --json'
       {
         "status": 0,
         "result": {
           "numberOfQueriedLogs": 3,
           "jobID": "7501w000002WnWcAAK"
         }
       }

  sfdx oa:apex:log:delete -s "Internal Salesforce.com Error,success"
       Query: SELECT Id FROM ApexLog WHERE Status IN ('Internal Salesforce.com Error','success') does not return any 
  record

  sfdx oa:apex:log:delete -m
       Query: SELECT Id FROM ApexLog WHERE LogUserId = '0054J000005OInNQAW' does not return any record

  oa:apex:log:delete -c -n test1@user.org,test2@user.org
       Query: SELECT Id FROM ApexLog WHERE LogUser.Username IN ('test1@user.org','test2@user.org') does not return any 
  record
```

_See code: [src/commands/oa/apex/log/delete.ts](https://github.com/osieckiAdam/osiecki-sfdx-plugins/blob/v0.2.1/src/commands/oa/apex/log/delete.ts)_

## `sfdx oa:data:soql:sel -f <string> [-w <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generate query string for all fields from SObject (SEL * FROM SObject)

```
USAGE
  $ sfdx oa:data:soql:sel -f <string> [-w <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --from=from                                                                   (required) SObject to generate query
                                                                                    for

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -w, --where=where                                                                 Add WHERE clause to Your query

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx oa:data:soql:sel -f ApexLog
       Your query was succesfully copied to clipboard:
       SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds,
       SystemModstamp, StartTime, Location FROM ApexLog
    
  sfdx oa:data:soql:sel -f ApexLog --json
       {
         "status": 0,
         "result": {
           "query": "SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status,
           DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog"
         }
       }
    
  sfdx oa:data:soql:sel -f ApexLog -w "LogLength > 100"
       Your query was succesfully copied to clipboard:
       SELECT Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds,
       SystemModstamp, StartTime, Location FROM ApexLog WHERE Where LogLength > 100
```

_See code: [src/commands/oa/data/soql/sel.ts](https://github.com/osieckiAdam/osiecki-sfdx-plugins/blob/v0.2.1/src/commands/oa/data/soql/sel.ts)_