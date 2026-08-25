import { Request, Response } from "express";
import { createUploadUrl, createFileMetaData ,getUserFiles} from "../service/files.service.js";
import { checkObjectExists } from "../../../infrastructure/aws/s3/s3.objects.js";
export const createUploadUrlController = async (
  req: Request,
  res: Response
) => {
  try {
    const { fileName, contentType, fileSize } = req.body;

    const userId = req.userId;

    const result = await createUploadUrl(
      userId,
      fileName,
      contentType,
      fileSize
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Upload URL generation failed:", error);

    return res.status(500).json({
      message: "Failed to generate upload URL",
    });
  }
};

export const completeUploadController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      fileId,
      s3Key,
      fileName,
      contentType,
      fileSize,
    } = req.body;

    const userId = req.userId;
    const expectedPrefix = `users/${userId}/files/${fileId}`;
    if (!(s3Key == expectedPrefix)) {
      return res.status(403).json({
        message: "You do not have access to this file or this file does not exist",
      });
    }
    const objectExists = await checkObjectExists(s3Key);

    if (!objectExists) {
      return res.status(404).json({
        message: "File was not found in S3",
      });
    }

    const file = await createFileMetaData(
      userId,
      fileId,
      s3Key,
      fileName,
      contentType,
      fileSize
    );

    return res.status(201).json({
      message: "File uploaded successfully",
      file,
    });

  } catch (error) {
    console.error("Failed to save file metadata:", error);

    return res.status(500).json({
      message: "Failed to save file metadata",
    });
  }
};


export const getUserFilesController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;

    const files = await getUserFiles(userId);

    return res.status(200).json({
      files,
    });

  } catch (error) {
    console.error("Failed to fetch files:", error);

    return res.status(500).json({
      message: "Failed to fetch files",
    });
  }
};