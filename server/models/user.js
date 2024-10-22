const mongoose = require("mongoose")
const Product = require('./product')
const mongoosePaginate = require('mongoose-paginate-v2');


const userSchema = mongoose.Schema({

    username: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    // password:{
    //     type:String,
    //     required:true
    // },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: true,
        required: true
    },
    profile: {
        type: String,
    },
    cart: {
        item: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            size: {
                type: String,
            },
            coupon: {
                type: mongoose.Types.ObjectId,
                ref: 'Coupon'
            },
            price: {
                type: Number
            },
        }],
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    wishlist: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    ],
    wallet: {
        type: Number,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    coupons: [{
        type: mongoose.Types.ObjectId,
        ref: 'Coupon'
    }]
},
    {
        timestamps: true
    })

userSchema.methods.updateCart = async function (id, qty, size) {

    const cart = this.cart;
    const product = await Product.findById(id);

    const index = cart.item.findIndex((objInItems) => {
        return (
            size ? new String(objInItems.productId).trim() === new String(product._id).trim() &&
                objInItems.size === size : new String(objInItems.productId).trim() === new String(product._id).trim()
        );
    });

    if (index === -1) {
        return;
    }

    if (qty > cart.item[index].qty) {
        cart.item[index].qty += 1;
        cart.totalPrice += product.price;
    } else if (qty < cart.item[index].qty) {
        cart.item[index].qty -= 1;
        cart.totalPrice -= product.price;
    }

    await this.save();
    return cart.totalPrice;
};

userSchema.methods.addToCart = async function (product, size, coupon) {
    const wishlist = this.wishlist;
    const isExist = wishlist.filter((item) => item === product._id);
    if (isExist.length) {
        wishlist.filter((item) => item !== product._id);
    }

    const cart = this.cart;
    console.log('cart', cart);

    const isExisting = cart.item.findIndex(
        (objInItems) =>
            size ? new String(objInItems.productId).trim() === new String(product._id).trim() &&
                objInItems.size === size : new String(objInItems.productId).trim() === new String(product._id).trim()
    );

    if (isExisting >= 0) {
        cart.item[isExisting].qty += 1;
        if (coupon) {
            cart.item[isExisting].coupon = coupon;
        } else {
            cart.item[isExisting].coupon = null;
        }

    } else {
        size ? cart.item.push({
            productId: product._id,
            qty: 1,
            size: size || "",
            price: product.price,
            coupon: coupon || null
        }) :
            cart.item.push({
                productId: product._id,
                qty: 1,
                price: product.price,
                coupon: coupon || null
            })
    }
    cart.totalPrice += product.price;
    return this.save();
};

userSchema.methods.removefromCart = async function (cartItemId, size) {
    const cart = this.cart;
    const isExisting = cart.item.findIndex(
        (objInItems) =>
            size ? new String(objInItems._id).trim() === new String(cartItemId).trim() &&
                objInItems.size === size : new String(objInItems._id).trim() === new String(cartItemId).trim()
    );

    if (isExisting >= 0) {
        const prod = await Product.findById(cart.item[isExisting].productId);
        cart.totalPrice -= prod.price * cart.item[isExisting].qty;
        cart.item.splice(isExisting, 1);
        return this.save();
    }
};

userSchema.methods.addToWishlist = function (product) {

    const wishlist = this.wishlist;

    const isExisting = wishlist.filter((x) => x == product);
    if (!isExisting.length) {
        wishlist.push(product);
    }

    return this.save();
};
userSchema.methods.removefromWishlist = async function (id) {

    const wishlist = this.wishlist;

    this.wishlist = this.wishlist.filter((x) => x.toString() !== id);

    return await this.save();
};


userSchema.statics.getWishlistWithProductsByUserId = async function (userId) {
    try {
        const user = await this.findById(userId).populate({
            path: 'wishlist',
            populate: {
                path: 'category',
                model: 'Category',
            }
        });

        return user?.wishlist?.reverse();
    } catch (error) {
        console.error(error);
        return null;
    }
};


userSchema.statics.getCartWithProductsByUserId = async function (userId) {
    try {
        const user = await this.findById(userId).populate("cart.item.productId").populate('cart.item.coupon');

        return user?.cart;
    } catch (error) {
        console.error(error);
        return null;
    }
};

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema)