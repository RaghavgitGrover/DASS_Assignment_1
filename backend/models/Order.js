import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  buyer: { type: String, required: true },
  seller: { type: String, required: true },
  status: { type: String, default: "Pending" }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  buyer: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  otp: { type: String, required: true },
  status: { type: String, required: true }
});

export default mongoose.model('Order', orderSchema);
