export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        success: string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }


    interface IMeta {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }

    interface ILogin {
        user: IUser;
        access_token: string;
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }
    interface IUser {
        email: string;
        id: number | string;
        username: string;
        role: string;
        avatar: string;
    }
    interface IFetchUser {
        user: IUser
    }


    interface IUserTable {
        _id: string,
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IRoom {
        room_number: string;
        floor: number;
        area: number;
        status: $Enums.RoomsStatus;
    }

    interface IFetchRoom {
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        }
        results: IRoom[];
    }

    interface IFetchResident {
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        }
        results: IResident[];
    }


    interface IGetRoomsParams {
        name: string;
        floor: string;
        status: string;
        page: string;
        limit: string;
    }

    interface IFetchFloor {
        floor: number[]
    }

    interface IFetchStatus {
        statusRooms: $Enums.RoomsStatus[]
    }

    interface IFetchRoomDetail {
        room: IRoom;
        owner: IResident;
        countVehicles: {
            motorbike: number;
            car: number;
        }
        residents: IResident[]
    }

    interface IResident {
        id: number;
        fullName: string;
        dateOfBirth: Date; // ISO string, ví dụ: "1990-01-01"
        placeOfBirth: string;
        ethnicity: string;
        occupation: string;
        hometown: string;
        idCardNumber: string;
        residenceStatus: string; // hoặc enum nếu bạn có
        phone: string;
        gender: string; // hoặc enum nếu bạn có
        relationshipToOwner: string; // hoặc enum nếu bạn có
        roomNumber: string;
        status: string; // hoặc enum nếu bạn có
        rooms: IRoom;
    }

    interface IGetResidentsParams {
        searchName: string;
        searchRoom: string;
        searchIdCard: string;
        page: string;
        limit: string;
    }

    interface IVehicle {
        id: number,
        roomNumber: string,
        plateNumber: string,
        type: string,
        brand: string,
        color: string,
        registrationDate: Date,
        isActive: boolean,
        note: string
    }

    interface IFetchVehicle {
        vehicles: IVehicle[]
    }

    interface IRevenueItem {
        id: number,
        name: string,
        unitPrice: number,
        category: string,
        status: string,
        code: string,
        description: string,
        quantityUnit: string
    }

    interface IDashboardStatCard {
        countRooms: number,
        countResident: number,
        countFees: number,
        countRoomsActive: number
    }

    interface IDashboardChart {
        month: string,
        totalRevenue: number
    }

    interface ICollectionPeriod {
        id: number,
        name: string,
        startDate: string,
        endDate: string,
        type: string,
        code: string,
        totalDue: number,
        totalPaid: number,
        paidRooms: number,
        totalRooms: number,
    }

    interface ICollectionItem {
        id: number,
        collectionPeriodId: number,
        roomNumber: string,
        revenueItemId: number,
        quantity: number,
        quantityUnit: string,
        unitPrice: number,
        totalAmount: number,
        note: string,
    }

    interface IItem {
        revenueItemId: number,
        quantity: number,
        quantityUnit: string,
        unitPrice: number,
        note: string,
    }
}

