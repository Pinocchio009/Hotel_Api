import { Request, Response, NextFunction } from 'express';
import User from '../Models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {roles} from '../roles';
 //assuming AccessControl is exported from roles file
 interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}
 interface CustomRequest extends Request {
  user?: any;
}
type UserRole = "user" | "admin" ;

export interface Permission {
  granted: boolean;
}

export interface Role {
  can(action: string): (resource: string) => Permission;
}

const UserRoles : Record<UserRole, Role> = {
  user: {
    can: (action) => {
      switch (action) {
        case "read":
          return (resource) => {
            return { granted: true };
          };
        case "update":
        case "delete":
          return (resource) => {
            return { granted: false };
          };
        default:
          return (resource) => {
            return { granted: false };
          };
      }
    },
  },
  admin: {
    can: (action) => {
      switch (action) {
        case "read":
        case "update":
          return (resource) => {
            return { granted: true };
          };
        case "delete":
          return (resource) => {
            return { granted: false };
          };
        default:
          return (resource) => {
            return { granted: false };
          };
      }
    },
}
}



async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword, role: role || "guest" });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.SECRET || '', {
      expiresIn: "1d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken
    })
  } catch (error) {
    res.status(500).send('error,message')
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))
    const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET || '', {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken
    })
  } catch (error) {
    res.status(500).send('error,message')
  }
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    res.status(500).send('error,message')
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const update = req.body
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId)
    res.status(200).json({
      data: user,
      message: 'User has been updated'
    });
  } catch (error) {
    res.status(500).send('error,message')
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User has been deleted'
    });
  } catch (error) {
    res.status(500).send('error,message')
  }
}


export const grantAccess =
  (action: string, resource: string) =>{
   return async (req: AuthenticatedRequest, res: Response) => {
    try {
     const permission = roles[req.user.role].can(action)(resource);
    // const permission = Roles.roles.can(req.user.role)[modifiedAction](resource);

     //const permission = roles[req.user.role as keyof typeof roles].can(action)(resource);

      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
    } catch (error) {
      res.status(500).send('error,message');
    }
  };
  }
export const allowIfLoggedIn = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
  } catch (error) {
    res.status(500).send('error,message');
  }
};