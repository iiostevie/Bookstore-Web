const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image_url: {
            type: String,
            required: false,
        },
        strength: {
            type: Number,
            required: true,
        },
        speed: {
            type: Number,
            required: true,
        },
        skill: {
            type: Number,
            required: true,
        },
        fear_factor: {
            type: Number,
            required: true,
        },
        power: {
            type: Number,
            required: true,
        },
        intelligence: {
            type: Number,
            required: true,
        },
        wealth: {
            type: Number,
            required: true,
        },
    },
    { collection: 'characters' }
);

const model = mongoose.model('characters', schema);
module.exports = model;
