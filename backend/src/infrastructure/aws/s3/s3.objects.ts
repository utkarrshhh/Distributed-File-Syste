import { HeadObjectCommand,DeleteObjectCommand, Bucket$ } from "@aws-sdk/client-s3";

import { s3 } from "./s3.client.ts";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME is not defined");
}

export const checkObjectExists = async (
  s3Key: string
): Promise<boolean> => {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
      })
    );

    return true;

  } catch (error) {
    return false;
  }
};

export const deleteObject = async(
    s3Key:string,

):Promise<void> => {
    const command = new DeleteObjectCommand({
        Bucket:BUCKET_NAME,
        Key:s3Key
    });
    await s3.send(command);
}