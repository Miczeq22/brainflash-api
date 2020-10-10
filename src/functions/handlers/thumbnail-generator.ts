import { S3EventRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import sharp from 'sharp';

export const thumbnailGenerator = async (event: S3EventRecord) => {
  const storageClient = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3ForcePathStyle: true,
  });

  const imageObject = await storageClient
    .getObject({
      Bucket: event.s3.bucket.name,
      Key: event.s3.object.key,
    })
    .promise();

  const image = sharp(imageObject.Body as Buffer);
  const imageMetadata = await image.metadata();

  if (imageMetadata.width === 300) {
    return;
  }

  const thumbnail = image.resize({
    width: 300,
  });

  const thumbnailBuffer = await thumbnail.toBuffer();

  const extension = event.s3.object.key.split('.').pop();

  await storageClient
    .putObject({
      Bucket: event.s3.bucket.name,
      Body: thumbnailBuffer,
      Key: `${event.s3.object.key.split('.')[0]}-thumbnail.${extension}`,
    })
    .promise();
};
