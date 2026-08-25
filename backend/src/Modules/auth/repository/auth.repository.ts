console.log("DYNAMODB_USERS_TABLE =", process.env.DYNAMODB_USERS_TABLE_NAME);
import {
    QueryCommand,
    GetCommand,
    PutCommand,
  } from "@aws-sdk/lib-dynamodb";
  
  import { dynamoDB } from "../../../infrastructure/aws/dynamodb/dynamodb.client.js";
  
  import { User } from "../types/user.types.ts";
  const TABLE_NAME = process.env.DYNAMODB_USERS_TABLE_NAME;
  
  export const queryUserIdByEmail = async (
    email: string
): Promise<string | null> => {

  const result = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLE_NAME,

      IndexName: "email-index",

      KeyConditionExpression: "email = :email",

      ExpressionAttributeValues: {
        ":email": email,
      },
    })
  );

  const user = result.Items?.[0];

  if (!user) {
    return null;
  }

  return user.userId;

  };

  export const findUserById = async (
    userId: string
  ): Promise<User | null> => {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE_NAME,
  
        Key: {
          userId,
        },
      })
    );
  
    return (result.Item as User) || null;
  };


  export const createUser = async (
    user: User
  ): Promise<User> => {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
      }),
    );
    return user;
  };