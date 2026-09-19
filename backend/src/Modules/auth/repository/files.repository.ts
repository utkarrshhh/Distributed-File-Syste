import { GetCommand,PutCommand,QueryCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {dynamoDB} from "../../../infrastructure/aws/dynamodb/dynamodb.client.js";
import { FileMetadata } from "../types/files.types.js";
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

export const getFileById = async (
    userId:string,
    fileId:string
):Promise<FileMetadata | null>=>{
    const result = await dynamoDB.send(
        new GetCommand({
            TableName:TABLE_NAME,
            Key:{
                userId,
                fileId,
            },
        }),
    );
    return (result.Item as FileMetadata) || null;
}


export const deleteFileById = async (
    userId:string,
    fileId:string
):Promise<void> =>{
    await dynamoDB.send(
        new DeleteCommand({
            TableName:TABLE_NAME,
            Key:{
                userId,
                fileId,
            },
        }),
    );
};