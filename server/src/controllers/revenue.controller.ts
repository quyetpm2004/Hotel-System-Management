import { Request, Response } from "express";
import 'dotenv/config';
import {
    handleCreateRevenueItem,
    handleUpdateRevenueItem,
    handleDeleteRevenueItem,
    handleGetRevenueItemsByCategory,
    handleGetAllRevenueItem,
} from "services/revenue.service";

// GET RevenueItems by category
const getRevenueItemsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const items = await handleGetRevenueItemsByCategory(category as any);
        return res.status(200).json({
            success: true,
            message: "Revenue items fetched successfully",
            data: items
        });
    } catch (error) {
        console.error("Error fetching revenue items:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// CREATE RevenueItem
const createRevenueItem = async (req: Request, res: Response) => {
    const { name, unitPrice, category, status, code, description, quantityUnit } = req.body;
    try {
        const newRevenueItem = await handleCreateRevenueItem(
            name,
            unitPrice,
            category,
            status,
            code,
            description,
            quantityUnit
        );
        return res.status(201).json({
            success: true,
            message: "Revenue item created successfully",
            data: newRevenueItem
        });
    } catch (error) {
        console.error("Error creating revenue item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// UPDATE RevenueItem (theo code)
const updateRevenueItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, unitPrice, category, status, description, quantityUnit } = req.body;
    try {
        const updatedRevenueItem = await handleUpdateRevenueItem(
            id,
            name,
            unitPrice,
            category,
            status,
            description,
            quantityUnit
        );
        return res.status(200).json({
            success: true,
            message: "Revenue item updated successfully",
            data: updatedRevenueItem
        });
    } catch (error) {
        console.error("Error updating revenue item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

// DELETE RevenueItem (theo code)
const deleteRevenueItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedRevenueItem = await handleDeleteRevenueItem(id);
        return res.status(200).json({
            success: true,
            message: "Revenue item deleted successfully",
            data: deletedRevenueItem
        });
    } catch (error) {
        console.error("Error deleting revenue item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

const getAllRevenueItem = async (req: Request, res: Response) => {
    try {
        const items = await handleGetAllRevenueItem()
        return res.status(200).json({
            success: true,
            message: "Fetch All revenue item successfully",
            data: items
        });
    } catch (error) {
        console.error("Error deleting revenue item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

export {
    getRevenueItemsByCategory,
    createRevenueItem,
    updateRevenueItem,
    deleteRevenueItem,
    getAllRevenueItem
};
