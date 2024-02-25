const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');
import { engine } from 'express-handlebars';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;


// i18next
//     .use(Backend)
//     .use(i18nextMiddleware.LanguageDetector)
//     .init({
//         fallbackLng: 'en',
//         backend: {
//             loadPath: __dirname + '/../resources/locales/{{lng}}/{{ns}}.json',
//         },
//         detection: {
//             order: ['querystring', 'cookie'],
//             caches: ['cookie'],
//         },
//     });
// app.use(i18nextMiddleware.handle(i18next));

// Enable CORS
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
