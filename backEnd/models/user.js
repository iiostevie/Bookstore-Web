const mongoose = require('mongoose');
mongoose.pluralize(null);
var bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('userlist', schema);

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = User;
