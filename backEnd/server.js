require('dotenv').config();

// Middleware Setup
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const passport = require('./config/passport');
const Adminlist = require('./models/adminlist');

connectDB();

const app = express();
const server = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
    cors({
        origin: ['http://localhost:3000'], // allow to server to accept request from different origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // allow session cookie from browser to pass through
    }),
);

//SET UP SESSION FOLLOW https://raz-levy.medium.com/how-to-implement-sessions-using-nodejs-and-mongodb-56266bfd19c3
app.use(
    session({
        name: 'example.sid',
        secret: 'Replace with your secret key',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 7,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_DB_URI,
        }),
    }),
);

app.use(passport.initialize());
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        console.log(req.method, req.url, req.body);
    }
    return passport.session()(req, res, next);
});

//DEFINE ROUTES FOR API
require('./routes/auth')(app);
require('./routes/cartoonpia')(app);
require('./routes/characters')(app);
require('./routes/contributions')(app);
require('./routes/favourites')(app);
require('./routes/userlist')(app);

app.get('/api/me', async (req, res) => {
    if (req.user) {
        Adminlist.findOne({ _id: req.user._id }).then((admin) => {
            if (!admin) {
                req.user.userType = 'user';
            } else {
                req.user.userType = 'admin';
            }
        });

        res.json(req.user);
        return;
    }

    res.json({});
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    if (err.statusCode === 400) {
        res.status(err.statusCode).json({
            msg: err.message,
        });
        return;
    }
    res.status(500).json({
        msg: 'Internal server error...Try again later.',
    });
    console.log(err);
});

app.use(
    session({
        resave: false,
        safeUninitalized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 10 * 10 * 24,
        },
    }),
);

// Server Configuration
const PORT = process.env.PORT;
server.use('', app);
server.listen(PORT, () => {
    console.log(
        `==> Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`,
    );
});
