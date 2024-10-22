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
        default: 0
    },
    sale_rate: {
        type: Number,
        required: true
    },
    feature: {
        type: [String]
    },
    spec: {
        type: [String]
    },
    fitAndCare: {
        type: [String]
    },
    sizes: [{
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
    reviews:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
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
    coupons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
        }
    ],
},
    {
        timestamps: true
    });

    productSchema.methods.calculateDiscount = function () {
        if (this.sale_rate && this.price) {
            this.discount = ((this.price - this.sale_rate) / this.price) * 100;
        } else {
            this.discount = 0; 
        }
    };
    
    productSchema.pre('save', function(next) {
        this.calculateDiscount(); 
        next(); 
    });
    

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema)