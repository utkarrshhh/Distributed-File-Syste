import crypto from "crypto";
import { createFile, getFilesByUserId } from "../repository/files.repository.ts";
import { FileMetadata } from "../types/files.types.ts";
import { generateUploadUrl } from "../../../infrastructure/aws/s3/s3.presigned.ts";

export const createFileMetaData = async (
    userId: string,
    fileId: string,
    s3Key: string,
    fileName: string,
    contentType: string,
    fileSize: number
  ): Promise<FileMetadata> => {
  
    const file: FileMetadata = {
      userId,
      fileId,
      fileName,
      contentType,
      fileSize,
      s3Key,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };
  
    return await createFile(file);
  };
  
export const getUserFiles = async (
    userId:string
):Promise<FileMetadata[]>=>{
    return await getFilesByUserId(userId);
}

export const createUploadUrl = async (
    userId: string,
    fileName: string,
    contentType: string,
    fileSize: number
  ) => {
    // 1. Generate unique file ID
    const fileId = crypto.randomUUID();
  
    // 2. Generate S3 object key
    const s3Key = `users/${userId}/files/${fileId}`;
  
    // 3. Generate presigned URL
    const uploadUrl = await generateUploadUrl(
      s3Key,
      contentType
    );
  
    // 4. Return information needed by frontend
    return {
      fileId,
      fileName,
      contentType,
      fileSize,
      s3Key,
      uploadUrl,
    };
  };