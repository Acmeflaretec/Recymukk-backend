const Review = require('../models/reviewModel');
const Product = require('../models/product');
// const Order = require('../models/order'); 

exports.createReview = async (req, res) => {
  try {
    const { productId, headline, rating, review, userId } = req.body;
    console.log('productId, headline, rating, review, userId', productId, headline, rating, review, userId);


    const image = req.files ? (req?.files?.map((x) => x.filename)) : null;

    const newReview = new Review({
      headline,
      rating,
      review,
      productId,
      userId,
      image
    });

    await newReview.save();
    console.log('newReview');

    // await Product.findByIdAndUpdate(productId, { $push: { reviews: newReview._id } });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.reviews.push(newReview._id);

    const totalReviews = product?.reviews?.length;
    const totalRating = product?.rating + newReview?.rating;
    const averageRatings = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0';
    const averageRating = (averageRatings % 1 === 0) ? Math.round(averageRatings) : averageRatings;
    console.log('averageRating', averageRating);

    product.rating = averageRating;


    await product.save();


    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId, approved: true })
      .populate('userId', 'username');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAdminReview = async (req, res) => {
  // console.log('getAdminReview');

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const review = await Review.find().sort({ createdAt: -1 })
      .populate('productId', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.json({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateReview = async (req, res) => {
  console.log('sam12');
  try {
    const { _id, approved } = req.body;
    console.log('sam123', _id, approved);

    const user = await Review.findById(_id);
    if (approved === 'true') {
      user.approved = 'false'
    } else {
      user.approved = 'true'
    }
    await user.save()
    res.json({ message: ' updated successfully', data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReviewById = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    res.json({ message: ' deleted successfully', data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const getReview = await Review.findById(req.params.id);

    if (!getReview) {
      return res.status(404).json({ message: ' not found' });
    }

    res.json({ data: getReview });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
