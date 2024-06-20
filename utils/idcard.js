import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import sharp from "sharp";
import admin from "firebase-admin";
import { configDotenv } from "dotenv";
configDotenv();
const { privatekey } = JSON.parse(process.env.private_key);

const serviceA = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: privatekey,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain
};

admin.initializeApp({
    credential: admin.credential.cert(serviceA),
    storageBucket: 'monarkfoundation-8c0a8.appspot.com'
});

const capitalizeFirstLetter2 = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const createCircularImage = async (imageBuffer, diameter) => {
  const radius = diameter / 2;
  return await sharp(imageBuffer)
    .resize(diameter, diameter)
    .composite([{
      input: Buffer.from(
        `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
      ),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();
};

const idcard = async (
  imageBuffer,
  bloodgroup,
  district,
  dateofbirth,
  contactNumber,
  id_Number,
  fullName
) => {
  console.log(bloodgroup, district, dateofbirth, contactNumber, id_Number, fullName);

  let card = "./Monark_Foundation.pdf";
  const existing = fs.readFileSync(card);
  const pdfDoc = await PDFDocument.load(existing);

  const firstPage = pdfDoc.getPages()[0];
  
  // Create circular image
  const maxDimension = 230;
  const circularImageBuffer = await createCircularImage(imageBuffer, maxDimension);
  const image = await pdfDoc.embedPng(circularImageBuffer);

  const x = 183;
  const y = 405;

  firstPage.drawImage(image, {
    x,
    y,
    width: maxDimension,
    height: maxDimension,
  });

  firstPage.drawText('Fullname', {
    x: 76,
    y: 339,
    size: 19,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(':', {
    x: 275,
    y: 339,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(String(capitalizeFirstLetter2(fullName)), {
    x: 300,
    y: 339,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(String(id_Number), {
    x: 300,
    y: 299,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(capitalizeFirstLetter2(bloodgroup), {
    x: 300,
    y: 257,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(capitalizeFirstLetter2(district), {
    x: 300,
    y: 215,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(capitalizeFirstLetter2(dateofbirth), {
    x: 300,
    y: 172,
    size: 24,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(capitalizeFirstLetter2(contactNumber), {
    x: 300,
    y: 130,
    size: 24,
    color: rgb(1, 1, 1),
  });

  const pdfBytes = await pdfDoc.save();
  const bucket = admin.storage().bucket();
  const icardUpload = bucket.file(`MonarkIcards/${fullName}/${fullName}.pdf`);
  await icardUpload.save(pdfBytes);
  const icardURL = await icardUpload.getSignedUrl({
    action: 'read',
    expires: '03-01-2500'
  });

  return icardURL[0];
};

export default idcard;
