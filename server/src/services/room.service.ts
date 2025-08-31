import { Prisma, Room, RoomsStatus } from "@prisma/client";
import prisma from "config/prismaClient";

const handleGetRooms = async (name: string, floor: string, status: string, page: string, limit: string) => {
    try {
        const where: any = {};

        if (name) {
            where.room_number = { contains: name };
        }
        if (floor) {
            where.floor = Number(floor);
        }
        if (status) {
            where.status = String(status);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [rooms, total] = await Promise.all([
            prisma.room.findMany({
                where,
                skip,
                take,
                orderBy: { room_number: "asc" },
            }),
            prisma.room.count({ where }),
        ]);

        return {
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
            results: rooms,
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw new Error("Failed to fetch rooms");
    }
}

const handleCreateRoom = async (roomNumber: string, floor: number, area: number, status: RoomsStatus) => {
    try {
        const newRoom = await prisma.room.create({
            data: {
                room_number: roomNumber,
                floor,
                area,
                status
            },
        });
        return newRoom;
    } catch (error) {
        console.error("Error creating room:", error);
        throw new Error("Failed to create room");
    }
}

const handleUpdateRoom = async (room_number: string, status: RoomsStatus) => {
    try {
        const updatedRoom = await prisma.room.update({
            where: { room_number },
            data: {
                status,
            },
        });
        return updatedRoom;
    } catch (error) {
        console.error("Error updating room:", error);
        throw new Error("Failed to update room");
    }
}

const handleDeleteRoom = async (room_number: string) => {
    try {
        const deletedRoom = await prisma.room.delete({
            where: { room_number },
        });
        return deletedRoom;
    } catch (error) {
        console.error("Error deleting room:", error);
        throw new Error("Failed to delete room");
    }
}

const handleGetFloorRooms = async () => {
    // Lấy ra tất cả các tầng để tôi làm select theo tầng
    try {
        const floors = await prisma.room.findMany({
            distinct: ['floor'],
            select: {
                floor: true,
            },
        });
        return floors.map(floor => floor.floor);
    } catch (error) {
        console.error("Error fetching floors:", error);
        throw new Error("Failed to fetch floors");
    }
}

const handleGetStatusRooms = async () => {
    // Lấy ra tất cả các trạng thái của phòng để tôi làm select theo trạng thái
    try {
        const statuses = await prisma.room.findMany({
            distinct: ['status'],
            select: {
                status: true,
            },
        });
        return statuses.map(status => status.status);
    } catch (error) {
        console.error("Error fetching room statuses:", error);
        throw new Error("Failed to fetch room statuses");
    }
}

const handleGetRoomDetail = async (roomNumber: string) => {
    try {
        const room = await prisma.room.findUnique({
            where: { room_number: roomNumber },
            include: {
                residents: true,
                vehicles: true,
            }
        });

        if (!room) {
            // không log ra error system, chỉ trả về null hoặc object báo lỗi
            return null;
        }

        const owner = room.residents.find(resident => resident.relationshipToOwner === "owner");

        const countMotorbike = room.vehicles.filter(vehicle => vehicle.type === "motorbike").length;
        const countCar = room.vehicles.filter(vehicle => vehicle.type === "car").length;

        return {
            room,
            owner,
            countVehicles: {
                motorbike: countMotorbike,
                car: countCar,
            },
            residents: room.residents
        };
    } catch (error) {
        // chỉ log lỗi thực sự (database, kết nối, query sai, ...)
        console.error("Unexpected error fetching room detail:", error);
        throw new Error("Failed to fetch room detail");
    }
}


const handleGetAllRooms = async () => {
    try {
        const rooms = await prisma.room.findMany()
        return rooms ?? [123]
    } catch (error) {
        console.log(error)
        return []
    }
}

export { handleCreateRoom, handleDeleteRoom, handleGetRooms, handleUpdateRoom, handleGetFloorRooms, handleGetStatusRooms, handleGetRoomDetail, handleGetAllRooms };