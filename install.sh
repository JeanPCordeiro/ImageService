#!/bin/bash

echo
echo "Provision ImageService stack"
echo

echo "Build Artifacts"
sam build

echo
echo "Deploy Stack"
aws s3api create-bucket --bucket imageservice-deploy --region us-east-1
sam deploy --capabilities CAPABILITY_NAMED_IAM --stack-name imageservice --s3-bucket imageservice-deploy --region us-east-1
