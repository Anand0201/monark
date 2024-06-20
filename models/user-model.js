import mongoose from "mongoose";

const schema = mongoose.Schema({
    emailAddress: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  contactNumber: { type: String, required: true },
  currentEducation: { type: String, required: true },
  occupation: { type: String, required: true },
  volunteeringExperience: { type: String, required: true },
  skills: { type: String, required: true },
  idNumber: { type: String, required: true },
});

const user = mongoose.model('userdataform', schema);
export default user;