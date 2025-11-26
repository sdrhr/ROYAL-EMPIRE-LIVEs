/* Complete server.js already created with all routes and Socket.io */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const depositRoutes = require('./routes/deposit');
const withdrawRoutes = require('./routes/withdraw');
const packageRoutes = require('./routes/package');
const referralRoutes = require('./routes/referral');
const profileRoutes = require('./routes/profile');
const supportRoutes = require('./routes/support');

const app = express();
const server = http.createServer(app);

// ------------------- CORS FIX --------------------

const allowedOrigins = [
  "https://royalempireliveapp.netlify.app",
  "http://localhost:3000"
];

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://royalempireliveapp.netlify.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});
// ---------------- SOCKET.IO FIX ------------------

  const io = new Server(server, {
    cors: { 
        origin: "https://royalempireliveapp.netlify.app",
        methods: ["GET","POST"],
        credentials: true
    }
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

-


// ------------------- DATABASE ---------------------

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// -------------------- ROUTES ---------------------

app.use('/api/auth', authRoutes);
app.use('/api/user/dashboard', dashboardRoutes);
app.use('/api/user/deposit', depositRoutes);
app.use('/api/user/withdraw', withdrawRoutes);
app.use('/api/user/packages', packageRoutes);
app.use('/api/user/referrals', referralRoutes);
app.use('/api/user/profile', profileRoutes);
app.use('/api/support', supportRoutes);

// ---------------- SOCKET EVENTS ------------------

io.on('connection', socket => {
  console.log('New socket connected:', socket.id);

  socket.on('subscribeBalance', userId => {
    socket.join(userId);
  });

  socket.on('disconnect', () => console.log('Socket disconnected'));
});

// -------------------- START SERVER ---------------------

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

