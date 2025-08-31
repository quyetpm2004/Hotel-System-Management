
import { PrismaClient, RevenueItemsCategory, RevenueItemsStatus } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE RevenueItem
const handleCreateRevenueItem = async (
    name: string,
    unitPrice: number,
    category: RevenueItemsCategory,
    status: RevenueItemsStatus,
    code: string,
    description?: string,
    quantityUnit?: string,
) => {
    try {
        const newRevenueItem = await prisma.revenueItem.create({
            data: {
                name,
                unitPrice,
                category,
                status,
                code,
                description,
                quantityUnit,
            },
        });
        return newRevenueItem;
    } catch (error) {
        console.error("Error creating revenue item:", error);
        throw new Error("Failed to create revenue item");
    }
};

// UPDATE RevenueItem (theo code)
const handleUpdateRevenueItem = async (
    id: string,
    name: string,
    unitPrice: number,
    category: RevenueItemsCategory,
    status: RevenueItemsStatus,
    description?: string,
    quantityUnit?: string,
) => {
    try {
        const updatedRevenueItem = await prisma.revenueItem.update({
            where: { id: +id },
            data: {
                name,
                unitPrice,
                category,
                status,
                description,
                quantityUnit,
            },
        });
        return updatedRevenueItem;
    } catch (error) {
        console.error("Error updating revenue item:", error);
        throw new Error("Failed to update revenue item");
    }
};

// DELETE RevenueItem (theo code)
const handleDeleteRevenueItem = async (id: string) => {
    try {
        const deletedRevenueItem = await prisma.revenueItem.delete({
            where: { id: +id },
        });
        return deletedRevenueItem;
    } catch (error) {
        console.error("Error deleting revenue item:", error);
        throw new Error("Failed to delete revenue item");
    }
};

// GET RevenueItems by category
const handleGetRevenueItemsByCategory = async (category: RevenueItemsCategory) => {
    try {
        const items = await prisma.revenueItem.findMany({
            where: { category },
        });
        return items;
    } catch (error) {
        console.error("Error fetching revenue items by category:", error);
        throw new Error("Failed to fetch revenue items by category");
    }
};

const handleGetAllRevenueItem = async () => {
    try {
        const items = await prisma.revenueItem.findMany()
        return items
    } catch (error) {
        console.error("Error fetching revenue items by category:", error);
        throw new Error("Failed to fetch revenue items by category");
    }
}

export {
    handleCreateRevenueItem,
    handleUpdateRevenueItem,
    handleDeleteRevenueItem,
    handleGetRevenueItemsByCategory,
    handleGetAllRevenueItem
};
