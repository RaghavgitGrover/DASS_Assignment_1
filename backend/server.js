import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import axios from "axios";

import User from './models/User.js';
import Item from './models/Item.js';
import Order from './models/Order.js';
import Support from './models/Support.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI).then(() => console.log("Connection to MongoDB successful")).catch((error) => console.error("Failed to connect to MongoDB:", error));

const isValidIIITEmail = (email) => {
  const iiitEmailRegex = /^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/;
  return iiitEmailRegex.test(email);
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(query, referenceData, model, userEmail) {
  const userSupport = await Support.findOne({ user: userEmail });
  const userHistory = userSupport ? userSupport.conversation : [];
  const systemPrompt = `Reference Data:
Users: ${JSON.stringify(referenceData.users)}
Items: ${JSON.stringify(referenceData.items)}
Orders: ${JSON.stringify(referenceData.orders)}
Support History for ${userEmail}: ${JSON.stringify(userHistory)}

You are a support assistant. Provide responses in a helpful and formal manner. Use bullet points, numbering, and proper punctuation. If the user asks about topics outside support (e.g., OTP or passwords), politely inform them that you can only assist with order-related or website issues.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];
  const chatCompletion = await groq.chat.completions.create({
    messages,
    model,
  });
  return chatCompletion.choices[0]?.message?.content || "";
}

app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNo, password } = req.body;
    if (!isValidIIITEmail(email)) return res.status(400).json({ message: "Invalid email domain. Must be students.iiit.ac.in or research.iiit.ac.in" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, age, contactNo, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } 
  catch (error) {
    console.error("An error occured in signup", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; 

const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) return res.status(400).json({ error: "Missing reCAPTCHA token" });
    try {
        const recaptchaResponse = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, 
            {
                params: { 
                    secret: RECAPTCHA_SECRET_KEY, 
                    response: recaptchaToken 
                }
            }
        );
        const { success, score, action } = recaptchaResponse.data;
        if (!success || score < 0.5 || action !== 'login') return res.status(403).json({ error: "Bot detection failed" });
        req.recaptchaScore = score;
        next();
    } 
    catch (error) {
        console.error("An error occured in reCAPTCHA verification:", error);
        res.status(500).json({ error: "Server verification error" });
    }
};

app.post("/api/login", verifyRecaptcha, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Credentials don't match" });
        if (req.recaptchaScore < 0.7) {
            return res.status(403).json({ 
                error: "Additional verification required",
                suspiciousLogin: true 
            });
        }
        res.json({ 
            message: "Login successful", 
            score: req.recaptchaScore 
        });
    } 
    catch (error) {
        console.error("An error occured in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/api/profile', async (req, res) => {
    try {
        const currentUser = req.query.currentUser;
        const user = await User.findOne({ email: currentUser });
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' }); 
    } 
    catch (error) {
        console.error("An error occurred while fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put('/api/profile', async (req, res) => {
    try {
        const currentUser = req.query.currentUser;
        const { firstName, lastName, age, contactNo, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email: currentUser });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (age) user.age = age;
        if (contactNo) user.contactNo = contactNo;
        if (oldPassword && newPassword) {
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) return res.status(400).json({ message: 'Incorrect old password' });
            user.password = await bcrypt.hash(newPassword, 10);
        }
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } 
    catch (error) {
        console.error("An error occurred during profile update:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/api/item', async (req, res) => {
  try {
    const { name, seller } = req.query;
    const item = await Item.findOne({ name, seller });
    if (item) res.json(item);
    else res.status(404).json({ message: 'Item not found' });
  } 
  catch (error) {
    console.error("An error occured while fetching item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } 
  catch (error) {
    console.error("An error occured while fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { name, price, description, category, seller } = req.body;
    const existingItem = await Item.findOne({ name, price, description, category, seller });
    if (existingItem) return res.status(400).json({ message: "Item with identical details is already listed." });
    const newItem = new Item({ name, price, description, category, seller });
    await newItem.save();
    res.status(201).json(newItem);
  } 
  catch (error) {
    console.error("An error occured while creating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } 
  catch (error) {
    console.error("An error occured while fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { orderNumber, buyer, items, otp, status } = req.body;
    if (!orderNumber || !buyer || !items || !otp || !status) return res.status(400).json({ message: "Missing required fields." });
    const newOrder = new Order({ orderNumber, buyer, items, otp, status });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } 
  catch (error) {
    console.error("An error occured while creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/updateOrderStatus', async (req, res) => {
  try {
    const { orderNumber, status, itemIndex } = req.body;
    const order = await Order.findOne({ orderNumber });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (itemIndex !== null && typeof itemIndex === 'number') {
      if (!order.items[itemIndex]) return res.status(404).json({ message: 'Item not found.' });
      order.items[itemIndex].status = status;
      const allItemsDelivered = order.items.every(item => item.status === 'Delivered');
      if (allItemsDelivered) order.status = 'Delivered';
    } 
    else order.status = status;
    await order.save();
    res.json({ message: 'Order status updated successfully.' });
  } 
  catch (error) {
    console.error("An error occured in update order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/support", async (req, res) => {
  try {
    const { userEmail, question, model } = req.body;
    if (!userEmail || !question || !model) return res.status(400).json({ message: "Missing userEmail, question or model." });
    const usersData = await User.find({});
    const itemsData = await Item.find({});
    const ordersData = await Order.find({});
    const referenceData = {
      users: usersData,
      items: itemsData,
      orders: ordersData,
    };
    const llmResponse = await getGroqChatCompletion(question, referenceData, model, userEmail);
    let userSupport = await Support.findOne({ user: userEmail });
    if (!userSupport) userSupport = new Support({ user: userEmail, conversation: [] });
    userSupport.conversation.push({ query: question, response: llmResponse });
    if (userSupport.conversation.length > 5) userSupport.conversation = userSupport.conversation.slice(-5);
    await userSupport.save();
    res.json({
      message: "Support response received",
      response: llmResponse,
      conversation: userSupport.conversation,
    });
  } catch (error) {
    console.error("An error occured during support:", error);
    res.status(500).json({ message: "Error processing support request." });
  }
});


app.get("/api/supportHistory", async (req, res) => {
  try {
    const currentUser = req.query.currentUser;
    const userSupport = await Support.findOne({ user: currentUser });
    if (!userSupport) return res.status(404).json({ message: "No support history found for user." });
    res.json({ conversation: userSupport.conversation });
  } 
  catch (error) {
    console.error("An error while fetching support history:", error);
    res.status(500).json({ message: "Error fetching support history." });
  }
});



app.use((err, req, res, next) => {
  console.error("A global error:", err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  console.log("Route not found:", req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
