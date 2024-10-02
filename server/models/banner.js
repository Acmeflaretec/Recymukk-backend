const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    url: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ["image", "video"],
        required: true
    },
    src: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Banner', bannerSchema)