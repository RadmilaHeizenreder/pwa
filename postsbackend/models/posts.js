const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: String,
    image_id: {
        type: String,
        default: ''
    },
    userId: {
        ref: 'Users',
        type: Schema.Types.ObjectId
    }
}, {timestamps: true});

module.exports = mongoose.model('Post', schema);