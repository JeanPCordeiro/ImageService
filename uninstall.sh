#!/bin/bash

echo
echo "Decommission imageservice stack"
echo

echo "Remove S3 buckets content"
aws s3 rb s3://imageservice-s3 --force
aws s3 rb s3://imageservice-s3-resized --force


echo
echo "Remove imageservice Stack"
sam delete --stack-name imageservice --debug --no-prompts --region us-east-1

aws s3 rb s3://imageservice-deploy --force  
