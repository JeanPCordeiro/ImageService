//
// AWS Lambda function that takes an imange on a bucket, resizes it and puts it on another bucket
//

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import sharp from 'sharp';
import { Readable } from 'stream';

// create S3 client
const s3 = new S3Client({ region: 'us-east-1' });
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// The standard Lambda handler invoked when a S3 event occurs
export const handler = async (event) => {

  const srcBucket = event.detail.bucket.name;
  const srcKey = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '));
  const dstBucket = srcBucket + "-resized";
  const dstKey = srcKey.split('.').slice(0, -1).join('.') + '.png';

  // Get the image from the source bucket. GetObjectCommand returns a stream.
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    var response = await s3.send(new GetObjectCommand(params));
    var stream = response.Body;
    // Convert stream to buffer to pass to sharp resize function.
    if (stream instanceof Readable) {
      var content_buffer = Buffer.concat(await stream.toArray());

    } else {
      throw new Error('Unknown object stream type');
    }
  } catch (error) {
    console.log("Erreur GetObject S3 : ",error);
    return;
  }

  // Use the sharp module to resize the image and save in a buffer.
  try {
    var output_buffer = await sharp(content_buffer)
      .resize({
        width: 1024
        //height: 768
      })
      .toFormat("png", { colors: 50 })
      .toBuffer();
  } catch (error) {
    console.log("Erreur Sharp Image : ",error);
    return;
  }

  // Upload the thumbnail image to the destination bucket
  try {
    const destparams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: output_buffer,
      ContentType: "image"
    };
    const putResult = await s3.send(new PutObjectCommand(destparams));
  } catch (error) {
    console.log("Erreur PutObject S3 : ",error);
    return;
  }

  // insert log on DynamoDB
  try {
    const command = new PutCommand({
      TableName: process.env.DBTableName,
      Item: {
        Id: event.id,
        Date: event.time,
        Type: 'image',
        File: srcKey,
        Bucket: process.env.OUTBucketName,
        SourceBucket: event.detail.bucket.name
      },
    });
    const responseDB = await docClient.send(command);
  } catch (error) {
    console.log("Erreur PutCommand DynamoDB : ",error);
    return;
  }

}
