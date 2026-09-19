import { PutObjectCommand,GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "./s3.client.js";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME is not defined");
}

export const generateUploadUrl = async (
  s3Key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(
    s3,
    command,
    {
      expiresIn: 300,
    }
  );

  return uploadUrl;
};

export const generateDownloadUrl = async (
    s3Key:string
) => {
    const command = new GetObjectCommand({
        Bucket:BUCKET_NAME,
        Key:s3Key,
    })
    const downloadUrl = await getSignedUrl(s3,command,{expiresIn:300})
    return downloadUrl;
}