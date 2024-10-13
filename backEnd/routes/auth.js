const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('../config/passport');

const _ = require('lodash');
module.exports = (app) => {
    // REGISTRATION
    app.post('/api/register', async (req, res) => {
        //TODO: add validator?
        const { firstname, lastname, email, password } = req.body;
        //return error if missing fields
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'Missing Fields' });
        }

        //hash password for security reason
        const hashedPassword = await bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10),
            null,
        );

        // Create new user record in database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // Create a session for new user
        req.session.userId = user.id;
        req.session.userType = 'user';

        return res.status(201).json({
            message: 'Registed succesfully',
            user: _.omit(user.toObject(), [password]), //DO NOT RETURN PASSWORD
        });
    });

    app.post('/api/login', (req, res, next) => {
        passport.authenticate('local', (err, theUser, failureDetails) => {
            if (err) {
                res.status(500).json({
                    message: 'Something went wrong authenticating user',
                });
                return;
            }
            if (!theUser) {
                res.status(401).json({ msg: failureDetails?.message });
                console.log(`Failed login attempt for ${req.body.email}`, {
                    api: '/login',
                });
                return;
            }

            // save user in session
            req.login(theUser, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ msg: 'Session save went bad.' });
                    return;
                }
                //Remove password from JSON to return.
                delete req.user['password'];
                res.send(req.user);
            });

            console.log(
                `${theUser.firstname} ${theUser.lastname} (${theUser.email}) logged in`,
                { api: '/login' },
            );
        })(req, res, next);
    });

    app.get('/api/logout', function (req, res, next) {
        const user = req.user;

        req.logout(function (err) {
            if (err) {
                return next(err);
            }
        });
        res.send({});

        console.log(
            `${user.first_name} ${user.last_name} (${user.email}) logged out`,
            { api: '/logout' },
        );
    });

    app.post('/api/signUp', async (req, res) => {
        const { firstname, lastname, email, password } = req.body;
        if ([firstname, lastname, email, password].includes(null)) {
            return res.status(400).json({ message: 'Missing Fields' });
        }
        //check if email is already registed
        const user = await User.findOne({ email: email });
        if (user) {
            return res
                .status(404)
                .json({ message: 'Email must be unique to other users' });
        }

        const passwordDigest = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10),
            null,
        );

        await User.create({
            firstname,
            lastname,
            email,
            password: passwordDigest,
        });

        return res.status(200).json({ message: 'Sign up successfully' });
    });
};
