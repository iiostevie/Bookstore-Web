const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Adminlist = require('../models/adminlist');

const db = require('../models');

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
    new LocalStrategy(
        // Our user will sign in using an email, rather than a "username"
        {
            usernameField: 'email',
        },
        function (email, password, done) {
            // When a user tries to sign in this code runs
            User.findOne({ email: email }).then(function (dbUser) {
                // If there's no user with the given email
                if (!dbUser) {
                    console.log('***passport.js no such user');
                    return done(null, false, {
                        message: 'Incorrect email.',
                    });
                }
                // If there is a user with the given email, but the password the user gives us is incorrect
                else if (!dbUser.validPassword(password)) {
                    console.log('***passport.js incorrect password');
                    return done(null, false, {
                        message: 'Incorrect password.',
                    });
                }

                // If none of the above, return the user
                let userType = '';

                Adminlist.findById(dbUser._id.toString()).then((admin) => {
                    if (!admin) {
                        userType = 'user';
                    } else {
                        userType = 'admin';
                    }
                    return done(null, {
                        firstname: dbUser.firstname,
                        lastname: dbUser.lastname,
                        email: dbUser.email,
                        userType,
                        id: dbUser._id.toString(),
                    });
                });
            });
        },
    ),
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Exporting our configured passport
module.exports = passport;
