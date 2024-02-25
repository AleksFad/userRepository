import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { engine } from 'express-handlebars';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type'],
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
