import axios from 'services/axios.customize'


const fetchAccountApi = async (): Promise<IBackendRes<IFetchUser>> => {
    const url = "/api/account"
    return await axios.get(url)
}

const loginApi = async (email: string, password: string): Promise<IBackendRes<ILogin>> => {
    const url = "/api/login"
    return await axios.post(url, {
        email,
        password
    })
}

const getRoomsApi = async (
    params: IGetRoomsParams
): Promise<IBackendRes<IFetchRoom>> => {
    const url = "/api/rooms";
    return await axios.get(url, { params });
};

const getAllRooms = async (): Promise<IBackendRes<IRoom[]>> => {
    const url = "/api/rooms/all";
    return await axios.get(url);
};

const getFloorsApi = async (): Promise<IBackendRes<IFetchFloor>> => {
    const url = "/api/rooms/floor";
    return await axios.get(url);
};

const getStatusApi = async (): Promise<IBackendRes<IFetchStatus>> => {
    const url = "/api/rooms/status";
    return await axios.get(url);
}

const getRoomDetailApi = async (
    roomNumber: string
): Promise<IBackendRes<IFetchRoomDetail>> => {
    const url = `/api/rooms/${roomNumber}`;
    return await axios.get(url);
}

const getVehiclesApi = async (roomNumber: string): Promise<IBackendRes<IVehicle[]>> => {
    const url = `/api/vehicles/${roomNumber}`;
    return await axios.get(url);
}

const createVehicleApi = async (roomNumber: string,
    plateNumber: string, type: string,
    brand: string, color: string, registrationDate: string,
    isActive: boolean, note: string): Promise<IBackendRes<IVehicle>> => {
    const url = '/api/vehicles'
    return await axios.post(url, {
        roomNumber, plateNumber, type, brand, color, registrationDate, isActive, note
    })
}

const updateVehicleApi = async (plateNumber: string, type: string,
    brand: string,
    color: string,
    registrationDate: Date,
    isActive: boolean,
    note: string,
    roomNumber: string,): Promise<IBackendRes<IVehicle>> => {
    const url = `/api/vehicles/${plateNumber}`
    return await axios.put(url, {
        type,
        brand,
        color,
        registrationDate,
        isActive,
        note,
        roomNumber
    })
}

const deleteVehicleApi = async (plateNumber: string): Promise<IBackendRes<IVehicle>> => {
    const url = `/api/vehicles/${plateNumber}`
    return await axios.delete(url)
}

const createResidentApi = async (
    fullName: string,
    dateOfBirth: string,
    placeOfBirth: string,
    ethnicity: string,
    occupation: string,
    hometown: string,
    idCardNumber: string,
    residenceStatus: string,
    phone: string,
    gender: string,
    relationshipToOwner: string,
    roomNumber: string,
    status: string): Promise<IBackendRes<IResident>> => {
    const url = "api/residents"
    return await axios.post(url, {
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
    })
}

const updateResidentApi = async (
    id: string,
    fullName: string,
    dateOfBirth: string,
    placeOfBirth: string,
    ethnicity: string,
    occupation: string,
    hometown: string,
    idCardNumber: string,
    residenceStatus: string,
    phone: string,
    gender: string,
    relationshipToOwner: string,
    roomNumber: string,
): Promise<IBackendRes<IResident>> => {
    const url = `/api/residents/${id}`
    return await axios.put(url, {
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
    })
}

const deleteResidentApi = async (id: number): Promise<IBackendRes<IResident>> => {
    const url = `/api/residents/${id}`
    return await axios.delete(url)
}

const getResidentById = async (id: number): Promise<IBackendRes<IResident>> => {
    const url = `/api/residents/${id}`
    return await axios.get(url)
}

const getAllResidentApi = async (params: IGetResidentsParams): Promise<IBackendRes<IFetchResident>> => {
    const url = '/api/residents'
    return await axios.get(url, {
        params
    })
}

const getAllRevenueItemApi = async (): Promise<IBackendRes<IRevenueItem[]>> => {
    const url = 'api/revenues'
    return await axios.get(url)
}

const createRevenueItemApi = async (name: string, unitPrice: number | string, category: string, status: string, code: string, description: string, quantityUnit: string): Promise<IBackendRes<IRevenueItem>> => {
    const url = 'api/revenues'
    return await axios.post(url, {
        name, unitPrice, category, status, code, description, quantityUnit
    })
}


const updateRevenueItemApi = async (id: number, name: string, unitPrice: number | string, category: string, status: string, description: string, quantityUnit: string): Promise<IBackendRes<IRevenueItem>> => {
    const url = `api/revenues/${id}`
    return await axios.put(url, {
        name, unitPrice, category, status, description, quantityUnit
    })
}

const deleteRevenueItemApi = async (id: number): Promise<IBackendRes<IResident>> => {
    const url = `api/revenues/${id}`
    return await axios.delete(url)
}

const getDashboardStatCardApi = async (): Promise<IBackendRes<IDashboardStatCard>> => {
    const url = 'api/dashboard'
    return await axios.get(url)
}

const getDashboardChartApi = async (): Promise<IBackendRes<IDashboardChart[]>> => {
    const url = 'api/dashboard/chart'
    return await axios.get(url)
}

const getCollectionPeriod = async (): Promise<IBackendRes<ICollectionPeriod[]>> => {
    const url = 'api/collection-periods'
    return await axios.get(url)
}

const updateUserInfo = async (email: string, username: string, avatar: File): Promise<IBackendRes<IUser>> => {
    const url = 'api/users/info';
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    if (avatar) {
        formData.append("avatar", avatar); // ảnh sẽ gửi kèm
    }

    return await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

}

const updateUserPassword = async (email: string, password: string, confirmPassword: string, newPassword: string): Promise<IBackendRes<IUser>> => {
    const url = 'api/users/password'
    return await axios.post(url, {
        email,
        password,
        confirmPassword,
        newPassword
    })

}

const createCollectionPeriod = async (name: string, startDate: string, endDate: string, type: string, code: string): Promise<IBackendRes<ICollectionPeriod>> => {
    const url = 'api/collection-periods'
    return await axios.post(url, {
        name, startDate, endDate, type, code
    })
}

const updateCollectionPeriod = async (id: string, name: string, startDate: string, endDate: string, type: string): Promise<IBackendRes<ICollectionPeriod>> => {
    const url = `api/collection-periods/${id}`
    return await axios.put(url, {
        name, startDate, endDate, type
    })
}

const deleteCollectionPeriod = async (id: string): Promise<IBackendRes<ICollectionPeriod>> => {
    const url = `api/collection-periods/${id}`
    return await axios.delete(url)
}

const createCollectionItem = async (collectionPeriodId: number, roomNumber: string, items: IItem[]): Promise<IBackendRes<ICollectionItem[]>> => {
    const url = 'api/collection-items'
    return await axios.post(url, {
        collectionPeriodId, roomNumber, items
    })
}

export {
    updateUserInfo, updateUserPassword,
    fetchAccountApi, loginApi,
    getRoomsApi, getFloorsApi,
    getStatusApi, getRoomDetailApi, getVehiclesApi, createVehicleApi,
    updateVehicleApi, deleteVehicleApi, getAllRooms,
    createResidentApi, updateResidentApi, deleteResidentApi, getResidentById, getAllResidentApi,
    getAllRevenueItemApi, createRevenueItemApi, updateRevenueItemApi, deleteRevenueItemApi,
    getDashboardStatCardApi, getDashboardChartApi,
    getCollectionPeriod, createCollectionPeriod, updateCollectionPeriod, deleteCollectionPeriod,
    createCollectionItem
}