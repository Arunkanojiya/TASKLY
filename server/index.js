import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './DB/db.js';
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import adminRoutes from './routes/admin.routes.js';
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;
;
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/admin', adminRoutes);

connectDB();
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

export default app;