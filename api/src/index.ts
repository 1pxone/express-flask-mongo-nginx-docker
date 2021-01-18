import mongoose from 'mongoose';
import winston from 'winston';
import { config } from './config';
import { app } from './app';
import * as http from 'http';
import { Socket, Server } from 'socket.io';

mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
// mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    winston.info('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
    winston.info('Mongoose disconnected!');
});

mongoose.connection.on('error', (err) => {
    winston.error(err.message);
    process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket: Socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(config.PORT, () => {
    Object.keys(config).forEach((key) => winston.info(`${key}: ${config[key]}`));
});
