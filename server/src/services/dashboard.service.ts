import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleGetStatCard = async () => {
    const countRooms = await prisma.room.count()
    const countResident = await prisma.resident.count()
    const countRoomsActive = await prisma.room.count({
        where: {
            status: "occupied"
        }
    })
    const totalAmount = await prisma.payment.aggregate({
        _sum: {
            paidAmount: true
        }
    })

    return {
        countRooms,
        countResident,
        countFees: totalAmount._sum.paidAmount || 0,
        countRoomsActive
    }
}

const handleGetChartRevenue = async () => {
    const revenueByMonth = await prisma.collectionPeriod.findMany({
        where: {
            type: 'monthly',
        },
        select: {
            id: true,
            name: true,       // Ví dụ: "Tháng 01/2025"
            startDate: true,
            endDate: true,
            collectionItems: {
                select: {
                    totalAmount: true,
                },
            },
        },
        orderBy: {
            startDate: 'asc',
        },
    });

    // Tính tổng theo từng kỳ thu
    const results = revenueByMonth.map(period => ({
        month: period.name,
        totalRevenue: period.collectionItems.reduce(
            (sum, item) => sum + Number(item.totalAmount),
            0
        ),
    }));

    return results
}


export { handleGetStatCard, handleGetChartRevenue }