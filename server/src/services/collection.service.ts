import { CollectionItem, CollectionPeriodsType, Prisma, PrismaClient } from '@prisma/client';
import prisma from 'config/prismaClient'

const handleGetCollectionPeriods = async () => {
    const periods = await prisma.collectionPeriod.findMany({
        include: {
            collectionItems: true,
            payments: true,
        },
    });

    return periods.map((p) => {
        // Tổng số tiền phải thu
        const totalDue = p.collectionItems.reduce(
            (sum, item) => sum + Number(item.totalAmount),
            0
        );

        // Tổng số tiền đã đóng
        const totalPaid = p.payments.reduce(
            (sum, pay) => sum + Number(pay.paidAmount),
            0
        );

        // Gom tổng phải thu theo căn
        const roomDue = new Map<string, number>();
        p.collectionItems.forEach((ci) => {
            const cur = roomDue.get(ci.roomNumber) ?? 0;
            roomDue.set(ci.roomNumber, cur + Number(ci.totalAmount));
        });

        // Gom tổng đã trả theo căn
        const roomPaid = new Map<string, number>();
        p.payments.forEach((pay) => {
            const cur = roomPaid.get(pay.roomNumber) ?? 0;
            roomPaid.set(pay.roomNumber, cur + Number(pay.paidAmount));
        });

        return {
            id: p.id,
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
            code: p.code,
            type: p.type,
            totalDue,
            totalPaid,
            paidRooms: roomPaid.size,
            totalRooms: roomDue.size,
        };
    });
};


const handleUpdateCollectionPeriod = async (id: number, name: string, startDate: string, endDate: string, type: CollectionPeriodsType) => {
    const updatedItem = await prisma.collectionPeriod.update({
        where: { id },
        data: {
            name, startDate: new Date(startDate),
            endDate: new Date(endDate), type
        }
    });
    return updatedItem;
}

const handleDeleteCollectionPeriod = async (id: number) => {
    await prisma.collectionPeriod.delete({ where: { id } });
}

const handleCreateCollectionPeriod = async (name: string, code: string, startDate: string, endDate: string, type: CollectionPeriodsType) => {
    const newItem = await prisma.collectionPeriod.create({
        data: {
            name,
            code,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            type
        }
    });
    return newItem;
}

const handleCreateCollectionItem = async (collectionPeriodId: number, roomNumber: string, items: CollectionItem[]) => {


    let rooms: string[] = [];

    if (roomNumber === "All") {
        // Lấy tất cả room_number trong bảng Room
        const allRooms = await prisma.room.findMany({
            select: { room_number: true },
        });
        rooms = allRooms.map((r) => r.room_number);
    } else {
        rooms = [roomNumber];
    }

    // Duyệt qua tất cả phòng và revenueItems
    const data = [];
    for (const room of rooms) {
        for (const item of items) {
            const quantity = new Prisma.Decimal(item.quantity);
            const unitPrice = new Prisma.Decimal(item.unitPrice); // unitPrice là Decimal

            const totalAmount = quantity.mul(unitPrice); // total cũng là Decimal

            data.push({
                collectionPeriodId,
                roomNumber: room,
                revenueItemId: item.revenueItemId,
                quantity,
                quantityUnit: item.quantityUnit,
                unitPrice,
                totalAmount,
                note: item.note ?? null,
            });
        }
    }

    // Lưu nhiều record 1 lần
    const created = await prisma.collectionItem.createMany({
        data,
        skipDuplicates: true, // tránh tạo trùng
    });

    return created;
}


const handleGetCollectionItems = async (collectionPeriodId: number) => {
    const items = await prisma.collectionItem.findMany({
        where: { collectionPeriodId }
    });

    return items

};

const handleUpdateCollectionItems = async (id: number, quantity: number, unitPrice: number, note?: string) => {
    const updatedItem = await prisma.collectionItem.update({
        where: { id },
        data: {
            quantity: new Prisma.Decimal(quantity),
            unitPrice: new Prisma.Decimal(unitPrice),
            totalAmount: new Prisma.Decimal(quantity).mul(new Prisma.Decimal(unitPrice)),
            note
        }
    });
    return updatedItem;
}



export { handleGetCollectionPeriods, handleUpdateCollectionPeriod, handleDeleteCollectionPeriod, handleCreateCollectionPeriod, handleCreateCollectionItem, handleGetCollectionItems };