const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  validity: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  minValue: {
    type: Number,
    required: true
  },
  maxValue: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }
  ],
  categorys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }
  ],
},
  {
    timestamps: true
  });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
