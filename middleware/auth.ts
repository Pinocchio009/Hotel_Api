import { RequestHandler} from 'express';
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  user?: string;
}

const { SECRET } = process.env;

const authMiddleware:  RequestHandler = (req: AuthRequest, res: Response) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      message: 'Token not found',
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET as string) as { user: string };

    req.user = decoded.user;

  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default authMiddleware;
