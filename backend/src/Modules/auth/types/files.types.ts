export interface FileMetadata {
    userId: string;
    fileId: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    s3Key: string;
    status: "pending" | "uploaded";
    createdAt: string;
  }