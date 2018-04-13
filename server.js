'use strict';
require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const moment = require('moment');
const helmet = require('helmet');

/* local imports */
const cat = require('./server/models/schema');
const db = require('./server/models/database');
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
//         if (username !==process.env.USERNAME || password !==process.env.PASSWORD) {
//             done(null, false, {message: 'Incorrect credentials'});
//             return;
//         }
//         return done(null, {});
//     }
// ));

// app.use(passport.initialize());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods',
        'POST, GET, PATCH, DELETE');
    // res.format({
    //     'text/plain': () => {
    //         res.send('hey, i am text');
    //     },

    //     'text/html': () => {
    //         res.send('<p>hey, i am html</p>');
    //     },
    //     'text/pdf': () => {
    //         res.send('i\'m pdf');
    //     },
    //     'application/json': () => {
    //         res.send({ message: 'hey, i am json' });
    //     },

    //     'default': () => {
    //         // log the request and respond with 406
    //         res.status(406).send('Not Acceptable');
    //     },
    // });
    next();
});

// route location
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// app.get('/*', (req, res) => {
//     const param1 = req.path;
//     const queryparams = req.query;
//     const ip = req.connection.remoteAddress || req.ip ||
//         req.headers['x-forwarded-for'] || req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;

//     res.send('Got to root with path: ' + param1 +
//         '<br> with query params: ' + JSON.stringify(queryparams) +
//         '<br> cookies: ' + JSON.stringify(req.cookies) +
//         '<br> timestamp: ' + moment().format('') +
//         '<br> user-agent: ' + req.headers['user-agent'] +
//         '<br> ip-address: ' + ip
//     );
// });

http.createServer((req, res) => {
    res.writeHead(301, {'Location': 'https://localhost:' + httpsPort + req.url});
    res.end();
}).listen(8080);

db.connect(dbURL, app, httpsPort);
// app.listen(port, () => console.log(`server running on port ${port}`));
