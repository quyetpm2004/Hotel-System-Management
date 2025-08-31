// src/app.ts
/// <reference path="./types/index.d.ts" />
import express from "express";
import apiRoutes from "routes/api";
import 'dotenv/config'
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;


// config cors
app.use(cors({
    origin: [
        "http://localhost:5173",
    ],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static file
app.use(express.static('public'))

// config routes
apiRoutes(app)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
