import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
mongoose.set('strictQuery', true); 
mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

const app = express();
app.use(express.json());

app.listen(3001, () => {
  console.log('Server listening on port 3001');
})

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);