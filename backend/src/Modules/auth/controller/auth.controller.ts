import { Request, Response } from "express";

import {
  signup,
  login,
} from "../service/auth.service.js";


export const signupController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const user = await signup(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "User created successfully",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error instanceof Error
        ? error.message
        : "Signup failed",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await login(
      email,
      password
    );
    return res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: error instanceof Error
        ? error.message
        : "Login failed",
    });
  }
};