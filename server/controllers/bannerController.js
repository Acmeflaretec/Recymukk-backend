const Banner = require('../models/banner');
const fs = require('fs');

const getBanners = async (req, res) => {
  try {
    const data = await Banner.find()
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const getStoreBanners = async (req, res) => {
  try {
    const data = await Banner.find({ status: true })
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const addBanner = async (req, res) => {
  try {
    const { title, subtitle, url, description, type, src, status } = req?.body
    const image = req?.file?.filename
    if (!image && !src) {
      return res.status(404).json({ message: 'Image/video not found' });
    }
    const data = new Banner({ title, subtitle, url, type, src, ...(image && { src: image }), description, status })
    await data.save()
    res.status(201).json({ data, message: 'Banner created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const updateBanner = async (req, res) => {
  const { _id, title, subtitle, url, description, type, src, status } = req.body;
  const image = req?.file?.filename;
  try {
    const data = await Banner.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    if (image && data?.type === "image") {
      fs.unlink(`public/uploads/${data?.src}`, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return;
        }
        console.log('Image deleted successfully.');
      });
    }
    await Banner.updateOne({ _id }, {
      $set: { title, subtitle, url, type, src, ...(image && { src: image }), description, status }
    })
    res.status(200).json({ data, message: 'Banner updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Banner.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    if (data?.src && data?.type === "image") {
      fs.unlink(`public/uploads/${data?.src}`, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return;
        }
        console.log('Image deleted successfully.');
      });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

module.exports = {
  getBanners,
  getStoreBanners,
  addBanner,
  getBannerById,
  updateBanner,
  deleteBanner
}