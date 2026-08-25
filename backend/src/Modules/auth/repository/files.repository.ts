import { GetCommand,PutCommand,QueryCommand } from "@aws-sdk/lib-dynamodb";
import {dynamoDB} from "../../../infrastructure/aws/dynamodb/dynamodb.client.ts";
import { FileMetadata } from "../types/files.types.ts";
const TABLE_NAME = process.env.DYNAMODB_FILES_TABLE_NAME;
if (!TABLE_NAME) {
  throw new Error("FILES_TABLE_NAME is not defined");
}

export const createFile = async (
    file: FileMetadata
  ): Promise<FileMetadata> => {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
  
        Item: file,
      })
    );
  
    return file;
  };

export const getFilesByUserId = async (
    userId: string
  ): Promise<FileMetadata[]> => {
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE_NAME,
  
        KeyConditionExpression: "userId = :userId",
  
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );
  
    return (result.Items as FileMetadata[]) || [];
  };