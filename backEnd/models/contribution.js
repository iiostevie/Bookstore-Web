const mongoose = require('mongoose');
mongoose.pluralize(null);

const schema = new mongoose.Schema(
    {
        contribution_id: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ['AddCharacter', 'DeleteCharacter', 'EditCharacter'],
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Approved', 'Rejected'],
        },
        date: {
            type: mongoose.Schema.Types.Date,
            required: true,
        },
        reviewed_by: {
            _id: { type: mongoose.Schema.Types.ObjectId },
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { collection: 'contributions' }
);

const Contribution = mongoose.model('contributions', schema);
module.exports = Contribution;
