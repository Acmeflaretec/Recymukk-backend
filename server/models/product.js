const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    subheading: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    material: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    tags: {
        type: [String],
        enum: ["featured", "popular", "limited_time_deal", "most_loved"]
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    sale_rate: {
        type: Number,
        required: true
    },
    feature:{
        type:[String]
    },
    spec:{
        type:[String]
    },
    fitAndCare:{
        type:[String]
    },
    sizes:[{    
        sizes: String,
        quantity: String
      }],
    image: {
        type: Array,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Array   
    },
    variantProduct: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        }
      ],
    similarProduct: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        }
      ],
},
    {
        timestamps: true
    })

    productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema)