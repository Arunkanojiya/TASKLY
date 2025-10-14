import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './DB/db.js';
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import adminRoutes from './routes/admin.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const allowedOrigins = [
  'http://localhost:5173',              // local dev
  'https://taskly-navy-seven.vercel.app' // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// app.use(cors({
//   origin: 'https://taskly-navy-seven.vercel.app',
//   localhost: 'http://localhost:5173',
//   credentials: true
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/admin', adminRoutes);

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;