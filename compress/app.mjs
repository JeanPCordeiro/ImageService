//
// AWS Lambda function that takes an imange on a bucket, resizes it and puts it on another bucket
//

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Readable } from 'stream';

// create S3 client
const s3 = new S3Client({ region: 'us-east-1' });

// The standard Lambda handler invoked when a S3 event occurs
export const handler = async (event) => {

  const key = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '))
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    return;
  }

  // log end of operations
  console.log('Successfully resized ' + srcBucket + '/' + srcKey +
    ' and uploaded to ' + dstBucket + '/' + dstKey);

}
