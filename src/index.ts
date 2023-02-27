import express, { Application } from 'express';
import { Request, Response } from 'express';
import { json } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connect from './config/db';
import RoomRoutes from './Router/RoomRoutes';
import userRoutes from './Router/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

connect();

const app: Application = express();
app.use(json());
app.use('/room', RoomRoutes);
app.use('/', userRoutes);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;
app.get('/', (req: Request, res: Response) => {
  res.send('i am coming');
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));