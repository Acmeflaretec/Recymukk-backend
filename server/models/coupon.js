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
  coincoupon: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
