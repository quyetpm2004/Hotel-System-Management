import { PrismaClient, VehiclesType } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE Vehicle
const handleCreateVehicle = async (
    roomNumber: string,
    plateNumber: string,
    type: VehiclesType,
    brand: string,
    color: string,
    registrationDate: Date,
    isActive: boolean,
    note?: string
) => {
    try {
        const newVehicle = await prisma.vehicle.create({
            data: {
                roomNumber,
                plateNumber,
                type,
                brand,
                color,
                registrationDate,
                isActive,
                note,
            },
        });
        return newVehicle;
    } catch (error) {
        console.error("Error creating vehicle:", error);
        throw new Error("Failed to create vehicle");
    }
};

// UPDATE Vehicle (theo plateNumber)
const handleUpdateVehicle = async (
    plateNumber: string,
    type: VehiclesType,
    brand: string,
    color: string,
    registrationDate: Date,
    isActive: boolean,
    note: string,
    roomNumber: string,

) => {
    try {
        const updatedVehicle = await prisma.vehicle.update({
            where: { plateNumber },
            data: {
                type,
                brand,
                color,
                registrationDate,
                isActive,
                note,
                roomNumber
            },
        });
        return updatedVehicle;
    } catch (error) {
        console.error("Error updating vehicle:", error);
        throw new Error("Failed to update vehicle");
    }
};

// DELETE Vehicle (theo plateNumber)
const handleDeleteVehicle = async (plateNumber: string) => {
    try {
        const deletedVehicle = await prisma.vehicle.delete({
            where: { plateNumber },
        });
        return deletedVehicle;
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        throw new Error("Failed to delete vehicle");
    }
};

// GET Vehicles by roomNumber
const handleGetVehiclesByRoom = async (roomNumber: string) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { roomNumber },
        });
        return vehicles;
    } catch (error) {
        console.error("Error fetching vehicles by room:", error);
        throw new Error("Failed to fetch vehicles by room");
    }
};

export {
    handleCreateVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    handleGetVehiclesByRoom,
};
