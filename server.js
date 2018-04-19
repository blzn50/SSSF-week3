'use strict';
require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const moment = require('moment');
const helmet = require('helmet');

/* local imports */
require('./server/models/schema');
require('./server/models/users');
const db = require('./server/models/database');
require('./server/config/passport');
const api = require('./server/routes/api');

const port = 5500;
const httpsPort = 8000;
const dbURL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const app = express();

// Parsers
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 1000000 }));
app.use(cookieParser());

// angular output static folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(helmet());

// passport.use(new LocalStrategy(
//     (username, password, done) => {
//         console.log('here we go:' + username + password);
//         console.log('comapre to:' + process.env.USERNAME + process.env.PASSWORD);
//         if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
//             done(null, false, { message: 'Incorrect credentials' });
//             return;
//         }
//         return done(null, {});
//     }
// ));

app.use(passport.initialize());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods',
        'POST, GET, PATCH, DELETE');
    next();
});

// route location
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/api/cats',
//     failureRedirect: '/test',
//     session: false,
// }));

// app.get('/test', (req, res) => {
//     res.send('redirection from login error');
// });

// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ 'message': err.name + ': ' + err.message });
    }
});

http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:' + httpsPort + req.url });
    res.end();
}).listen(8080);

db.connect(dbURL, app, httpsPort);
// app.listen(port, () => console.log(`server running on port ${port}`));
