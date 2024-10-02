const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address_line_1: {
        type: String,
        required: true
    },
    address_line_2: {
        type: String,
    },

    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    primary: {
        type: Boolean,
        default: false,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Address', addressSchema)