import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import contactsRouter from './routes/contactsRouter.js';

const app = express();
const DB_URI = process.env.DB_URI;

async function run() {
    try {
        await mongoose.connect(DB_URI);
        console.log();

        console.log('Database connection successful');
    } finally {
        await mongoose.disconnect();
    }
}
run().catch(process.exit(1));

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

app.listen(3000, () => {
    console.log('Server is running. Use our API on port: 3000');
});
