// npm run start:dev
import express from "express"; // Обёртка вместо http
import multer from "multer"; // изображения
import mongoose from "mongoose"; // Live Server
import cors from "cors"; // Чтобы можно было запрашивать данные с разных доменов

import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    postUpdateValidation,
} from "./validations.js";
import { PostController, UserController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
mongoose
    .connect(
        "mongodb+srv://admin:wwwwww@cluster0.4uxkvso.mongodb.net/blog?retryWrites=true&w=majority&appName=AtlasApp"
    )
    .then(() => {
        console.log("DB OK");
    })
    .catch((error) => {
        console.log("DB error", error);
    });

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, "uploads");
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({
    storage,
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Для отображения картинки по адрессной строке
// ------------------------- Component  ---------------------------------

app.get("/", (req, res) => {
    res.send("Hi!");
});

// --------------------------  Auth --------------------------------------

app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

// --------------------------  Posts --------------------------------------
app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);

app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postUpdateValidation, PostController.update);

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

// ------------------------- Live Server ---------------------------------
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
