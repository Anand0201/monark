import express from "express";
import router from "./routes/user.js";
import mongoose from "mongoose";
import cors from "cors"
import { configDotenv } from "dotenv";
configDotenv();
const app = express();
const port  = 1222

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use('/upload', express.static('upload'));

mongoose.connect('mongodb+srv://anandjethava538:Anand123@cluster0.ujbaulb.mongodb.net/monark')

app.set('view engine', 'ejs' )
app.use(router);

app.listen(port, () => 
    console.log(`Server is running on port ${port}`)
);