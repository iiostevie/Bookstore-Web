const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { collection: 'adminlist' },
    { versionKey: false },
);

const model = mongoose.model('adminlist', schema);
module.exports = model;
