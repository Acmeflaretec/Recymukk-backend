const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    product: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      ],
    description: {
        type: String,
    },
    image: {
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

module.exports = mongoose.model('Tags', tagSchema)