import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  contactNo: { type: String, required: true },
  password: { type: String, required: true },
  sellerReviews: { type: [String], default: [] }  
});

export default mongoose.model('User', userSchema);
