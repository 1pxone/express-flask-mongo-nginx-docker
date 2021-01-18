import express from 'express';
import bodyParser from 'body-parser';
import { catchAll, notFound } from './error';
import { userRouter } from './routes/user.router';
// import helmet from 'helmet';
import cors from 'cors';
import * as path from 'path';
export const app = express();
import { authRouter } from './routes/auth.router';

// app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join('public')));
// app.get('/', (_req, res) => {
//     res.json({ message: 'It works!' });
// });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(notFound);
app.use(catchAll);
