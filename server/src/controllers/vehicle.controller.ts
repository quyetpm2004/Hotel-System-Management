import { Request, Response } from "express";
import 'dotenv/config'
import {
    handleGetVehiclesByRoom,
    handleCreateVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle
} from "services/vehicle.service";

// GET vehicles by roomNumber
const getVehicle = async (req: Request, res: Response) => {
    const { roomNumber } = req.params;
    try {
        const vehicles = await handleGetVehiclesByRoom(roomNumber);
        return res.status(200).json({
            success: true,
            message: "Vehicle fetched successfully",
            data: vehicles
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// CREATE vehicle
const createVehicle = async (req: Request, res: Response) => {
    const { roomNumber, plateNumber, type, brand, color, registrationDate, isActive, note } = req.body;
    try {
        const newVehicle = await handleCreateVehicle(
            roomNumber,
            plateNumber,
            type,
            brand,
            color,
            new Date(registrationDate),
            isActive,
            note
        );
        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: newVehicle
        });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// UPDATE vehicle
const updateVehicle = async (req: Request, res: Response) => {
    const { plateNumber } = req.params;
    const { type,
        brand,
        color,
        registrationDate,
        isActive,
        note,
        roomNumber } = req.body;
    try {
        const updatedVehicle = await handleUpdateVehicle(
            plateNumber,
            type,
            brand,
            color,
            registrationDate,
            isActive,
            note,
            roomNumber);
        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updatedVehicle
        });
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// DELETE vehicle
const deleteVehicle = async (req: Request, res: Response) => {
    const { plateNumber } = req.params;
    try {
        const deletedVehicle = await handleDeleteVehicle(plateNumber);
        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: deletedVehicle
        });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

export {
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
