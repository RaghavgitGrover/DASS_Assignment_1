import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  query: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const supportSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  conversation: { type: [conversationSchema], default: [] }
});

export default mongoose.model('Support', supportSchema);
