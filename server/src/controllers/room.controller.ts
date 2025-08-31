import { Request, Response } from "express";
import 'dotenv/config'
import { handleCreateRoom, handleDeleteRoom, handleGetAllRooms, handleGetFloorRooms, handleGetRoomDetail, handleGetRooms, handleGetStatusRooms, handleUpdateRoom } from 'services/room.service';
import { error } from "console";

const getRooms = async (req: Request, res: Response) => {
    const { name, floor, status, page, limit } = req.query;
    const data = await handleGetRooms(
        name ? String(name) : "",
        floor ? String(floor) : "",
        status ? String(status) : "",
        page ? String(page) : "1",
        limit ? String(limit) : "10"
    );
    try {
        return res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            data: data
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    };
}

const createRoom = async (req: Request, res: Response) => {
    const { roomNumber, floor, area, status } = req.body;

    try {
        const newRoom = await handleCreateRoom(roomNumber, +floor, +area, status);
        return res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: { newRoom }
        });
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const updateRoom = async (req: Request, res: Response) => {
    const { roomNumber, status } = req.body;

    try {
        const updatedRoom = await handleUpdateRoom(roomNumber, status);

        return res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: { updatedRoom }
        });
    } catch (error) {
        console.error("Error updating room:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const deleteRoom = async (req: Request, res: Response) => {
    const { roomNumber } = req.params;

    try {
        const deletedRoom = await handleDeleteRoom(roomNumber);

        return res.status(200).json({
            success: true,
            message: "Room deleted successfully",
            data: { deletedRoom }
        });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const getFloorRooms = async (req: Request, res: Response) => {
    try {
        const floor = await handleGetFloorRooms()
        return res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            data: { floor }
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const getStatusRooms = async (req: Request, res: Response) => {
    try {
        const statusRooms = await handleGetStatusRooms();
        return res.status(200).json({
            success: true,
            message: "Status rooms fetched successfully",
            data: { statusRooms }
        });
    }
    catch (error) {
        console.error("Error fetching status rooms:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const getRoomDetail = async (req: Request, res: Response) => {
    const { roomNumber } = req.params;
    try {
        const roomDetail = await handleGetRoomDetail(roomNumber);
        return res.status(200).json({
            success: true,
            message: "Room detail fetched successfully",
            data: roomDetail
        });
    } catch (error) {
        console.error("Error fetching room detail:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await handleGetAllRooms()
        return res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            data: rooms
        });
    } catch (error) {
        console.error("Error fetching room detail:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}


export { getRooms, createRoom, updateRoom, deleteRoom, getFloorRooms, getStatusRooms, getRoomDetail, getAllRooms };