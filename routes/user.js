import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import user from "../models/user-model.js";
import idcard from "../utils/idcard.js";
import getNextId from "../utils/idcounter.js";

const router = express.Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('form');
});

router.post('/sendmessage', upload.single('photo'), async (req, res) => {
    try {
        const { bloodGroup, district, dob, contactNumber, fullName, emailAddress, gender, nationality, address, currentEducation, occupation, volunteeringExperience, skills } = req.body;
        const imagepath = req.file.path;

        // Check if user already exists
        const existuser = await user.findOne({ fullName: fullName, contactNumber: contactNumber });
        if (existuser) {
            return res.render('form', { message: 'User already exists' });
        }

        const imageBuffer = fs.readFileSync(imagepath);
        const idNumber = getNextId();
        const submituser = new user({
            emailAddress,
            fullName,
            dob,
            gender,
            nationality,
            address,
            district,
            bloodGroup,
            contactNumber,
            currentEducation,
            occupation,
            volunteeringExperience,
            skills,
            idNumber
        });

        const eventCoordinatorPdfBytes = await idcard(imageBuffer, bloodGroup, district, dob, contactNumber, idNumber, fullName);
        // const pdfPath = `upload/${fullName}-Monark_Foundation-id.pdf`;
        // fs.writeFileSync(pdfPath, eventCoordinatorPdfBytes);

        await submituser.save();
        console.log('submit successfully');

        res.json({ pdfUrl: eventCoordinatorPdfBytes });
    } catch (error) {
        console.error('Error in /send-message:', error);
        res.status(500).send('An error occurred');
    }
});

export default router;
