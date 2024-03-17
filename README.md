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
├── compress              <-- Source code for Compress (using Sharp) Lambda function 
│   └── compressJPG       <-- Converts DOCX file into text
│   └── compressPDF       <-- Converts PDF files into text
│   └── package.json      <-- NodeJS dependencies and scripts
├── parser                <-- Source code for a lambda function
│   └── parserFunction    <-- Parses input bucket 
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


You can also use provision and decommission scripts to fully automate the processus.

## How it works

* Upload JPG or PNG files to the TP or BATCH buckets.
* After a few seconds you will see the index in DynamoDB has been updated with labels and entities for the object and the files moved to the ECS bucket.

==============================================

This application features are extracted from [Serverless Document Repository repo](https://github.com/aws-samples/s3-to-lambda-patterns/tree/master/decoupled-docrepo) provided by Amazon.


SPDX-License-Identifier: MIT-0
