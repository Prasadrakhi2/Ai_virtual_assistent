import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRouter from './routes/user.rout.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// starting url = type of middleware
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    connectDB();
    console.log(`server is started at http://localhost:${PORT}`);
})