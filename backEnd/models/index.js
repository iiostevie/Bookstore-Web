const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

if (!process.env.MONGO_DB_URI) {
    console.error('MONGO_DB_URI is not set.');
    process.exit(1);
}

mongoose.connect(`${process.env.MONGO_DB_URI}/cartoonpia`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.connection.once('open', () => {
    console.log('MongoDB connected.');
    fs.readdirSync(__dirname)
        .filter(
            (file) =>
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.endsWith('.js'),
        )
        .forEach((file) => {
            const model = require(path.join(__dirname, file));
            db[model.modelName] = model;
        });
    console.log(db); // Check loaded models
});

module.exports = db;
