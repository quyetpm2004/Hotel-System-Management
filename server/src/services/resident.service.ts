import { PrismaClient, ResidentsGender, ResidentsRelationshipToOwner, ResidentsResidenceStatus, ResidentsStatus } from "@prisma/client";
const prisma = new PrismaClient();


const handleCreateResident = async (
    fullName: string,
    dateOfBirth: Date,
    placeOfBirth: string,
    ethnicity: string,
    occupation: string,
    hometown: string,
    idCardNumber: string,
    residenceStatus: ResidentsResidenceStatus,
    phone: string,
    gender: ResidentsGender,
    relationshipToOwner: ResidentsRelationshipToOwner,
    roomNumber: string,
    status: "living"
) => {
    try {
        const newResident = await prisma.resident.create({
            data: {
                fullName,
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
                status
            }
        });
        return newResident;
    } catch (error) {
        console.error("Error creating resident:", error);
        throw new Error("Failed to create resident");
    }
};

const handleUpdateResident = async (id: number,
    fullName: string,
    dateOfBirth: Date,
    placeOfBirth: string,
    ethnicity: string,
    occupation: string,
    hometown: string,
    idCardNumber: string,
    residenceStatus: ResidentsResidenceStatus,
    phone: string,
    gender: ResidentsGender,
    relationshipToOwner: ResidentsRelationshipToOwner,
    roomNumber: string,
    status: ResidentsStatus,
) => {
    try {
        const updatedResident = await prisma.resident.update({
            where: { id },
            data: {
                fullName,
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
                status
            },
        });
        return updatedResident;
    } catch (error) {
        console.error("Error updating resident:", error);
        throw new Error("Failed to update resident");
    }
};

const handleDeleteResident = async (id: number) => {
    try {
        const deletedResident = await prisma.resident.delete({
            where: { id },
        });
        return deletedResident;
    } catch (error) {
        console.error("Error deleting resident:", error);
        throw new Error("Failed to delete resident");
    }
};

const handleGetAllResidents = async () => {
    try {
        const residents = await prisma.resident.findMany({
            include: {
                rooms: true, // lấy thêm thông tin phòng (nếu cần)
            },
        });
        return residents;
    } catch (error) {
        console.error("Error fetching residents:", error);
        throw new Error("Failed to fetch residents");
    }
};

const handleGetResidentById = async (id: number) => {
    try {
        const resident = await prisma.resident.findUnique({
            where: { id },
            include: {
                rooms: true, // lấy thêm thông tin phòng (nếu cần)
            },
        });
        return resident;
    } catch (error) {
        console.error("Error fetching resident by ID:", error);
        throw new Error("Failed to fetch resident by ID");
    }
};

const handleGetResidentBySearch = async (
    searchName: string,
    searchRoom: string,
    searchIdCard: string,
    page: string,
    limit: string
) => {
    try {
        const where: any = {};

        if (searchName) {
            where.fullName = { contains: searchName };
        }
        if (searchRoom) {
            where.roomNumber = searchRoom;
        }
        if (searchIdCard) {
            where.idCardNumber = { contains: searchIdCard };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [residents, total] = await Promise.all([
            prisma.resident.findMany({
                where,
                skip,
                take,
                orderBy: { roomNumber: "asc" },
            }),
            prisma.resident.count({ where }), // ✅ sửa lại model
        ]);

        return {
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
            results: residents,
        };
    } catch (error) {
        console.error("Error fetching residents:", error);
        throw new Error("Failed to fetch residents");
    }
};


export {
    handleCreateResident,
    handleUpdateResident,
    handleDeleteResident,
    handleGetAllResidents,
    handleGetResidentById,
    handleGetResidentBySearch
};
