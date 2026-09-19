import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../../../config/jwt.js";
import {
  createUser,
  queryUserIdByEmail,
  findUserById,

} from "../repository/auth.repository.js";


export const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    // 1. Check whether the email already exists
    const existingUser = await queryUserIdByEmail(email);
  
    if (existingUser) {
      throw new Error("User already exists");
    }
  
    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
  
    // 3. Generate a unique user ID
    const userId = crypto.randomUUID();
  
    // 4. Create the user object
    const user = {
      userId,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
  
    // 5. Store user in DynamoDB
    return await createUser(user);
  };


  export const login = async (
    email: string,
    password: string
  ) => {
    const userId = await queryUserIdByEmail(email);
  
    if (!userId) {
      throw new Error("Invalid credentials");
    }
  
    const user = await findUserById(userId);
  
    if (!user) {
      throw new Error("Invalid credentials");
    }
  
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );
  
    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }
    
    const token = generateToken(userId);
    return {
    token,
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  };