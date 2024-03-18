# Serverless ImageService POV

(C) JP.Cordeiro for CATS

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

This repo contains AWS SAM templates that deploy a Proof Of Value for a serverless Image Services application.
This application takes an image from a S3 Bucket, compresses it, stores the result on another S3 Bucket and then stores the results on DynamoDB for logging.

This application uses an event-based architecture, with Amazon EventBridge as the serverless event bus.


```bash
.
├── README.MD             <-- This instructions file
├── template.yaml         <-- SAM template for Application
├── install.sh            <-- script to launch stack
├── uninstall.sh          <-- script to remove stack
├── test.sh               <-- script to test 
├── compress              <-- Source code for Compress (using Sharp) Lambda function 
│   └── app.mjs           <-- lambda compression code
│   └── package.json      <-- NodeJS dependencies and scripts

```

## Requirements

* AWS and AWS SAM CLI configured with Administrator permission
* [NodeJS 20.x installed](https://nodejs.org/en/download/)
* You can use GitPod (https://www.gitpod.io/) as you development environment with all this requirements.

## Installation Instructions

1. Clone the repo onto your local development machine using `git clone`.

1. Then run:
``` 
sam build -u
sam deploy --guided --capabilities CAPABILITY_NAMED_IAM
```
Follow the prompts in the deploy process to set the stack name, AWS Region, unique bucket names, DynamoDB domain endpoint, and other parameters.


You can also use install and uninstall scripts to fully automate the processus.

## How it works

* Upload JPG or PNG files to the INput bucket.
* After a few seconds you will see the index in DynamoDB has been updated with labels and entities for the object and the files moved to the Resized bucket.

==============================================

This application features are extracted from [Serverless Document Repository repo](https://github.com/aws-samples/s3-to-lambda-patterns/tree/master/decoupled-docrepo) provided by Amazon.


SPDX-License-Identifier: MIT-0
