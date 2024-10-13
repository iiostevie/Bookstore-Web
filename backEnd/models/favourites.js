const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        characters: {
            type: [String],
            default: [],
        },
    },
    { versionKey: false },
);

const model = mongoose.model('favourites', schema);
module.exports = model;
