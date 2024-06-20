import fs from "fs";



const idFilePath =  './image/lastId.txt';
let lastId = 2024150;

// Read the last ID from the file
if (fs.existsSync(idFilePath)) {
    const idData = fs.readFileSync(idFilePath, 'utf8');
    if (idData) {
        lastId = parseInt(idData, 10);    }
}

// Function to get the next ID
export default function getNextId() {
    lastId += 1;
    fs.writeFileSync(idFilePath, lastId.toString(), 'utf8');
    return lastId;
}
