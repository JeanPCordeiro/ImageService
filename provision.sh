#!/bin/bash

echo
echo "Provision myECM stack"
echo

echo "Build Artifacts"
sam build

echo
echo "Deploy Stack"
aws s3api create-bucket --bucket myecm-deploy --region us-east-1
sam deploy --capabilities CAPABILITY_NAMED_IAM --stack-name myecm --s3-bucket myecm-deploy

echo
echo "Sync S3 Acquisition WebSite"
aws s3 sync ACQsite/. s3://myecm-s3-acq

echo
echo "Build View Site"
pushd viewsite
myURL=$(aws ssm get-parameter --name ScanAPIUrl  | jq -r '.Parameter.Value')
sed -i "/.get(/c\    .get('${myURL}')" src/FeaturedDocuments.js
npm install
npm run build
popd

echo
echo "Sync S3 View WebSite"
aws s3 sync viewsite/build/. s3://myecm-s3-view
