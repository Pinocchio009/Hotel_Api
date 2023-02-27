import express from 'express';
import { getAllRooms, getRoom, createRoom, updateRoom, deleteRoom } from '../Controllers/RoomControllers';

const router = express.Router();

router
  .get('/', getAllRooms)
  .get('/:id', getRoom)
  .post('/', createRoom)
  .put('/:id', updateRoom)
  .delete('/:id', deleteRoom);

export default router;
