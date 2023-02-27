import { Request, Response } from "express";
import RoomModel, { IRoom } from "../Models/RoomModel";



export const getAllRooms = async (req: Request, res: Response) => {
  try {
    let rooms: IRoom[] = await RoomModel.find();
    if (rooms.length === 0)
      return res.status(404).json({
        success: false,
        message: "No rooms found",
      });
    res.status(200).json({
      message: "room found",
      room: rooms,
    });
  } catch (error) {
    res.status(500).send('error.message');
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    let id = { _id: req.params.id };
    let room: IRoom | null = await RoomModel.findOne(id);
    if (!room) return res.status(404).send("room not found");
    res.status(200).json({
      Message: "room found",
      room: room,
    });
  } catch (error) {
    res.status(500).send('error.message');
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    let room: IRoom = req.body;
    let created: IRoom = await RoomModel.create(room);
    if (!created)
      return res.status(400).json({
        message: " room no gree book",
      });
    return res.status(201).json({
      success: true,
      message: "room booked",
      room: created,
    });
  } catch (error) {
    res.status(500).send('error.message');
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    let id = { _id: req.params.id };
    let room: IRoom = req.body;
    let update: IRoom | null = await RoomModel.findOneAndUpdate(id, room, {
      new: true,
    });
    if (!update)
      return res.status(400).json({
        message: "room not found",
      });
    return res.status(200).json({
      message: " Room updated",
      room: update,
    });
  } catch (error) {
    res.status(500).send('error.message');
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    let id = { _id: req.params.id };
    let deleted: IRoom | null = await RoomModel.findOneAndDelete(id);
    if (!deleted) return res.status(400).send("room")
  }
  catch(error){
    res.status(404).send('error.message')
  }
}

