import { handleGetChartRevenue, handleGetStatCard } from "services/dashboard.service"
import { Request, Response } from "express";

const getDashboardStatCard = async (req: Request, res: Response) => {
    try {
        const result = await handleGetStatCard()

        return res.status(200).json({
            success: true,
            message: "Stat card fetched successfully",
            data: result
        });
    } catch (error) {
        console.error("Error fetching revenue items:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const getRevenueChart = async (req: Request, res: Response) => {
    try {
        const result = await handleGetChartRevenue()

        return res.status(200).json({
            success: true,
            message: "Chart Revenue fetched successfully",
            data: result
        });
    } catch (error) {
        console.error("Error fetching revenue items:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}


export { getDashboardStatCard, getRevenueChart }