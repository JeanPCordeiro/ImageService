#!/bin/bash

aws s3 cp bigPNG.png s3://imageservice-s3
aws s3 cp bigJPG.jpg s3://imageservice-s3
sleep 5
aws s3api list-objects-v2 --bucket imageservice-s3 --query '[Contents[].Key,Contents[].Size]' --output text
aws s3api list-objects-v2 --bucket imageservice-s3-resized --query '[Contents[].Key,Contents[].Size]' --output text
