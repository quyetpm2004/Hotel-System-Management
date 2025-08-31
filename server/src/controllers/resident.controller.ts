

import { Request, Response } from "express";
import {
    handleCreateResident,
    handleUpdateResident,
    handleDeleteResident,
    handleGetAllResidents,
    handleGetResidentById,
    handleGetResidentBySearch,
} from "services/resident.service";

// Tạo resident mới
export const createResident = async (req: Request, res: Response) => {
    try {
        const { fullName,
            dateOfBirth,
            placeOfBirth,
            ethnicity,
            occupation,
            hometown,
            idCardNumber,
            residenceStatus,
            phone,
            gender,
            relationshipToOwner,
            roomNumber,
            status } = req.body;
        const newResident = await handleCreateResident(fullName,
            new Date(dateOfBirth),
            placeOfBirth,
            ethnicity,
            occupation,
            hometown,
            idCardNumber,
            residenceStatus,
            phone,
            gender,
            relationshipToOwner,
            roomNumber,
            status);
        return res.status(201).json({
            success: true,
            message: "Create new resident succeed",
            data: newResident
        });
    } catch (error: any) {
        console.error("Error creating resident:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create resident",
            error: error?.message ?? error
        });
    }
};

// Lấy toàn bộ residents
export const getAllResidents = async (req: Request, res: Response) => {
    try {
        const residents = await handleGetAllResidents();
        return res.status(200).json({
            success: true,
            message: "Get all resident succeed",
            data: residents
        });
    } catch (error: any) {
        console.error("Error fetching residents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetching resident",
            error: error?.message ?? error
        });
    }
};

// Lấy resident theo id
export const getResidentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resident = await handleGetResidentById(Number(id));
        if (!resident) {
            return res.status(404).json(
                {
                    message: "Resident not found",
                    success: false,
                    error: "Not found"
                }
            );
        }
        return res.status(200).json({
            success: true,
            message: "Fetch resident success",
            data: resident,
        });
    } catch (error: any) {
        console.error("Error fetching residents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetching resident",
            error: error?.message ?? error
        });
    }
};

// Cập nhật resident
export const updateResident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullName,
            dateOfBirth,
            placeOfBirth,
            ethnicity,
            occupation,
            hometown,
            idCardNumber,
            residenceStatus,
            phone,
            gender,
            relationshipToOwner,
            roomNumber,
            status } = req.body;
        const updatedResident = await handleUpdateResident(Number(id), fullName,
            new Date(dateOfBirth),
            placeOfBirth,
            ethnicity,
            occupation,
            hometown,
            idCardNumber,
            residenceStatus,
            phone,
            gender,
            relationshipToOwner,
            roomNumber,
            status);
        return res.status(200).json({
            success: true,
            message: "Update resident succeed",
            data: updatedResident
        });
    } catch (error: any) {
        console.error("Error fetching residents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update resident",
            error: error?.message ?? error
        });
    }
};

// Xóa resident
export const deleteResident = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await handleDeleteResident(Number(id));
        res.status(200).json({
            success: true,
            message: "Resident deleted successfully",
            data: {}
        });
    } catch (error: any) {
        console.error("Error fetching residents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete resident",
            error: error?.message ?? error
        });
    }
};

export const getResidentBySearch = async (req: Request, res: Response) => {
    try {
        const { searchName, searchRoom, searchIdCard, page, limit } = req.query;

        const data = await handleGetResidentBySearch(
            searchName ? String(searchName) : "",
            searchRoom ? String(searchRoom) : "",
            searchIdCard ? String(searchIdCard) : "",
            page ? String(page) : "1",
            limit ? String(limit) : "20"
        );

        return res.status(200).json({
            success: true,
            message: "Residents fetched successfully",
            data: data,
        });
    } catch (error) {
        console.error("Error fetching residents:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
    }
};
