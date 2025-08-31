import { handleCreateCollectionItem, handleCreateCollectionPeriod, handleDeleteCollectionPeriod, handleGetCollectionPeriods, handleUpdateCollectionPeriod } from "services/collection.service";
import { Request, Response } from "express";

const getCollectionPeriod = async (req: Request, res: Response) => {
    const items = await handleGetCollectionPeriods();
    return res.status(200).json({
        message: "Collection items retrieved successfully",
        success: true,
        data: items,
    });
}

const updateCollectionPeriod = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, startDate, endDate, type } = req.body;
    try {
        const updatedItem = await handleUpdateCollectionPeriod(id, name, startDate, endDate, type);
        return res.status(200).json({
            data: updatedItem,
            message: "Collection item updated successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: String(error),
            message: "Failed to update collection item",
            success: false,
        });
    }
}

const deleteCollectionPeriod = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        await handleDeleteCollectionPeriod(id);
        return res.status(200).json({
            data: [],
            message: "Collection item deleted successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: String(error),
            message: "Failed to delete collection item",
            success: false,
        });
    }
}

const createCollectionPeriod = async (req: Request, res: Response) => {
    const { name, code, startDate, endDate, type } = req.body;
    try {
        const newItem = await handleCreateCollectionPeriod(name, code, startDate, endDate, type);
        return res.status(201).json({
            data: newItem,
            message: "Collection item created successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: String(error),
            message: "Failed to create collection item",
            success: false,
        });
    }
}

const createCollectionItem = async (req: Request, res: Response) => {
    const { collectionPeriodId, roomNumber, items } = req.body;

    try {
        const newCollectionItem = await handleCreateCollectionItem(collectionPeriodId, roomNumber, items);
        return res.status(201).json({
            data: newCollectionItem,
            message: "Collection items created successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            error: String(error),
            message: "Failed to create collection items",
            success: false,
        });
    }

}

export { getCollectionPeriod, updateCollectionPeriod, deleteCollectionPeriod, createCollectionPeriod, createCollectionItem }