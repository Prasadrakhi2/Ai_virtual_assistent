import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors'

import connectDB from './config/db.js';
import authRouter from './routes/user.rout.js';
import userRouter from './routes/userAuth.rout.js';
import geminiResponse from './gemini.js';

const app = express();

// connect with frontend
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// starting url = type of middleware
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    connectDB();
    console.log(`server is started at http://localhost:${PORT}`);
})