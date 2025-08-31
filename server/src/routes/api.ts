import { fetchAccount, loginApi, registerApi } from "controllers/auth.controller";
import { createCollectionItem, createCollectionPeriod, deleteCollectionPeriod, getCollectionPeriod, updateCollectionPeriod } from "controllers/collection.period.controller";
import { getDashboardStatCard, getRevenueChart } from "controllers/dashboard.controller";
import { createResident, deleteResident, getAllResidents, getResidentById, getResidentBySearch, updateResident } from "controllers/resident.controller";
import { createRevenueItem, deleteRevenueItem, getAllRevenueItem, updateRevenueItem } from "controllers/revenue.controller";
import { createRoom, deleteRoom, getAllRooms, getFloorRooms, getRoomDetail, getRooms, getStatusRooms, updateRoom } from "controllers/room.controller";
import { getUsers, updateInfoUser, updatePassword } from "controllers/user.controller";
import { createVehicle, deleteVehicle, getVehicle, updateVehicle } from "controllers/vehicle.controller";
import { Express, Router, Request, Response } from "express";
import { checkValidJWT } from "middleware/jwt.middleware";
import fileUploadMiddleware from "middleware/multer";

const router = Router();

const apiRoutes = (app: Express) => {
    console.log("API routes loaded"); // check log

    // route authentication
    router.post("/register", registerApi);
    router.post("/login", loginApi);
    router.get("/account", fetchAccount);


    // route user
    router.get("/users", getUsers);
    router.post("/users/info", fileUploadMiddleware("avatar"), updateInfoUser);
    router.post("/users/password", updatePassword);

    // route colletion-periods
    router.get("/collection-periods", getCollectionPeriod);
    router.post("/collection-periods", createCollectionPeriod);
    router.put("/collection-periods/:id", updateCollectionPeriod);
    router.delete("/collection-periods/:id", deleteCollectionPeriod);

    // route colletion-items
    router.post("/collection-items", createCollectionItem)


    // route room
    router.get("/rooms", getRooms)
    router.get("/rooms/all", getAllRooms)
    router.put("/rooms", updateRoom)
    router.delete("/rooms/:roomNumber", deleteRoom);
    router.get("/rooms/floor", getFloorRooms)
    router.get("/rooms/status", getStatusRooms)
    router.get("/rooms/:roomNumber", getRoomDetail)


    //route vehicle
    router.get("/vehicles/:roomNumber", getVehicle)
    router.post("/vehicles", createVehicle)
    router.put("/vehicles/:plateNumber", updateVehicle)
    router.delete("/vehicles/:plateNumber", deleteVehicle)

    // route residents 
    router.get("/residents", getResidentBySearch)
    router.get("/residents/:id", getResidentById)
    router.post("/residents", createResident)
    router.put("/residents/:id", updateResident)
    router.delete("/residents/:id", deleteResident)

    // router revenue item
    router.get("/revenues", getAllRevenueItem);
    router.post("/revenues", createRevenueItem);
    router.put("/revenues/:id", updateRevenueItem);
    router.delete("/revenues/:id", deleteRevenueItem);


    // route dashboard 
    router.get("/dashboard", getDashboardStatCard)
    router.get("/dashboard/chart", getRevenueChart)


    // route room 
    router.get('/test', (req, res) => res.send('Test OK'));

    app.use("/api", checkValidJWT, router);
};

export default apiRoutes;
