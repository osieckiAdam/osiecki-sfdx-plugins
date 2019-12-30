# osiecki-sfdx-plugins

A plugin for the Salesforce CLI built by Adam Osiecki

[![Version](https://img.shields.io/npm/v/osiecki-sfdx-plugins.svg)](https://npmjs.org/package/osiecki-sfdx-plugins)
[![CircleCI](https://circleci.com/gh/osieckiAdam/osiecki-sfdx-plugins/tree/master.svg?style=shield)](https://circleci.com/gh/osieckiAdam/osiecki-sfdx-plugins/tree/master)
[![Codecov](https://codecov.io/gh/osieckiAdam/osiecki-sfdx-plugins/branch/master/graph/badge.svg)](https://codecov.io/gh/osieckiAdam/osiecki-sfdx-plugins)
[![Downloads/week](https://img.shields.io/npm/dw/osiecki-sfdx-plugins.svg)](https://npmjs.org/package/osiecki-sfdx-plugins)
[![License](https://img.shields.io/npm/l/osiecki-sfdx-plugins.svg)](https://github.com/osieckiAdam/osiecki-sfdx-plugins/blob/master/package.json) [![Greenkeeper badge](https://badges.greenkeeper.io/osieckiAdam/osiecki-sfdx-plugins.svg)](https://greenkeeper.io/)

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

- [`sfdx oa:apex:log:delete [-c] [-a] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-oaapexlogdelete--c--a--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx oa:apex:log:delete [-c] [-a] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

delete ApexLog entries from Your org

```
USAGE
  $ sfdx oa:apex:log:delete [-c] [-a] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --async                                                                       do not wait for successful
                                                                                    completion of the job. If ommited
                                                                                    will poll for number of processed
                                                                                    records until complete

  -c, --checkonly                                                                   use this parameter to only check
                                                                                    number of debug logs without
                                                                                    deleting them

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
```

_See code: [lib\commands\oa\apex\log\delete.js](https://github.com/osieckiAdam/osiecki-sfdx-plugins/blob/v0.1.3/lib\commands\oa\apex\log\delete.js)_

<!-- commandsstop -->
