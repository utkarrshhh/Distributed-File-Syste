import crypto from "crypto";
import { createFile, getFilesByUserId,getFileById ,deleteFileById} from "../repository/files.repository.ts";
import { FileMetadata } from "../types/files.types.ts";
import { generateUploadUrl,generateDownloadUrl } from "../../../infrastructure/aws/s3/s3.presigned.ts";
import { deleteObject } from "../../../infrastructure/aws/s3/s3.objects.ts";


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

export const getFile = async (
    userId: string,
    fileId: string
  ): Promise<FileMetadata | null> => {
    return await getFileById(userId, fileId);
  };

export const createDownloadUrl = async (
    userId:string,
    fileId:string
):Promise<string> =>{
    const file = await getFile(userId,fileId);
    if(!file){
        throw new Error("File not found");
    }
    const downloadUrl = await generateDownloadUrl(
        file.s3Key
    );
    return downloadUrl;

}

export const deleteFile = async (
    userId: string,
    fileId: string
  ): Promise<void> => {
  
    // 1. Find the file belonging to this user
    const file = await getFileById(userId, fileId);
  
    // 2. File doesn't exist or doesn't belong to this user
    if (!file) {
      throw new Error("File not found");
    }
  
    // 3. Delete the actual file from S3
    await deleteObject(file.s3Key);
  
    // 4. Delete the metadata from DynamoDB
    await deleteFileById(userId, fileId);
  };