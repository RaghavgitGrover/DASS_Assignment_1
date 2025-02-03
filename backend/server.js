import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Groq from "groq-sdk";

dotenv.config();

const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const isValidIIITEmail = (email) => {
    const iiitEmailRegex = /^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/;
    return iiitEmailRegex.test(email);
};

let users = [];
let items = [];
let orders = [];
let support = [];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(query, referenceData, model, userEmail) {
  const userHistory = referenceData.support.find(s => s.user === userEmail)?.conversation || [];

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



app.post("/api/login", async(req, res) => {
const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "User not found" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Credentials dont match" });
    res.json({ message: "Login successful"});
});

app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, age, contactNo, password } = req.body;
    if (!isValidIIITEmail(email)) return res.status(400).json({ message: "Invalid email domain. Must be students.iiit.ac.in or research.iiit.ac.in" });
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) return res.status(400).json({ message: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        firstName,
        lastName,
        email,
        age,
        contactNo,
        password: hashedPassword, 
        sellerReviews: [],
    };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully" });
});

app.get('/api/isUserSigned', (req, res) => {

});

app.get('/api/profile', (req, res) => {
    const currentUser = req.query.currentUser;
    const user = users.find(u => u.email === currentUser);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

app.put('/api/profile', async (req, res) => {
    const currentUser = req.query.currentUser;
    const { firstName, lastName, age, contactNo, oldPassword, newPassword } = req.body;
    const user = users.find(u => u.email === currentUser);
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
    res.json({ message: 'Profile updated successfully' });
});

app.get('/api/item', (req, res) => {
    const { name, seller } = req.query;
    const item = items.find(i => i.name === name && i.seller === seller);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Item not found' });
});

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.post('/api/items', (req, res) => {
    const { name, price, description, category, buyer, seller } = req.body;
    const existingItem = items.find(item => 
        item.name === name &&
        item.price === price &&
        item.description === description &&
        item.category === category &&
        item.seller === seller
    );
    if (existingItem) return res.status(400).json({ message: "Item with identical details is already listed." });
    const newItem = {
        name,
        price,
        description,
        category,
        seller
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const { orderNumber, buyer, items, otp, status } = req.body;
    if (!orderNumber || !buyer || !items || !otp || !status) return res.status(400).json({ message: "Missing required fields." });
    const newOrder = {
        orderNumber,
        buyer,
        items,
        otp,
        status,
    };
    orders.push(newOrder);
    console.log('Orders:', orders);
    orders.forEach(order => console.log('Order items:', order.items));
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

app.post('/api/updateOrderStatus', (req, res) => {
    const { orderNumber, status, itemIndex } = req.body;
    const order = orders.find(order => order.orderNumber === orderNumber);
    if (order) {
        if (itemIndex !== null && typeof itemIndex === 'number') {
            const item = order.items[itemIndex];
            if (item) {
                item.status = status;
                const allItemsDelivered = order.items.every(item => item.status === 'Delivered');
                if (allItemsDelivered) order.status = 'Delivered';
            } 
            else return res.status(404).json({ message: 'Item not found.' });
        } 
        else order.status = status;
        return res.json({ message: 'Order status updated successfully.' });
    }
    return res.status(404).json({ message: 'Order not found.' });
});

app.post('/api/support', async (req, res) => {
  try {
    const { userEmail, question, model } = req.body;
    if (!userEmail || !question || !model) return res.status(400).json({ message: "Missing userEmail, question or model." });
    const referenceData = { users, items, orders, support };
    const llmResponse = await getGroqChatCompletion(question, referenceData, model, userEmail);
    let userSupport = support.find(s => s.user === userEmail);
    if (!userSupport) {
      userSupport = { user: userEmail, conversation: [] };
      support.push(userSupport);
    }
    userSupport.conversation.push({ query: question, response: llmResponse });
    if (userSupport.conversation.length > 5) userSupport.conversation = userSupport.conversation.slice(-5);
    res.json({ message: "Support response received", response: llmResponse, conversation: userSupport.conversation });
  } 
  catch (error) {
    console.error("Support endpoint error:", error);
    res.status(500).json({ message: "Error processing support request." });
  }
});







app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});