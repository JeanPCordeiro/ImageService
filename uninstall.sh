#!/bin/bash

echo
echo "Decommission imageservice stack"
echo

echo "Remove S3 buckets content"
aws s3 rm s3://imageservice-s3-tp --recursive
aws s3 rm s3://imageservice-s3-batch --recursive
aws s3 rm s3://imageservice-s3-ecs --recursive


echo
echo "Remove imageservice Stack"
sam delete --stack-name imageservice --debug --no-prompts --region eu-west-3
