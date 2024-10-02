const Tag = require('../models/tags');
const fs = require('fs');

const getTags = async (req, res) => {
  try {
    const data = await Tag.find()
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const addTag = async (req, res) => {
  try {
    const { title, subtitle, product, description, status } = req?.body
    console.log('product',product);
    
    const image = req?.file?.filename
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const data = new Tag({ title, subtitle, product, image, description, status })
    await data.save()
    res.status(201).json({ data, message: 'Tags created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const getTagById = async (req, res) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findById(id).populate('product')
    if (!tag) {
      return res.status(404).json({ message: 'Tags not found' });
    }
    res.status(200).json({ data: tag });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const updateTag = async (req, res) => {
  const { _id, title,product, subtitle, description, status } = req.body;
  const image = req?.file?.filename;
  try {
    const data = await Tag.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Tags not found' });
    }
    if (image) {
      fs.unlink(`public/uploads/${data?.image}`, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return;
        }
        console.log('Image deleted successfully.');
      });
    }
    await Tag.updateOne({ _id }, {
      $set: { title, subtitle,product, description, status, ...(image && { image }) }
    })
    res.status(200).json({ data, message: 'Tags updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Tag.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Tags not found' });
    }
    fs.unlink(`public/uploads/${data?.image}`, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }
      console.log('Image deleted successfully.');
    });
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

module.exports = {
  getTags,
  addTag,
  getTagById,
  updateTag,
  deleteTag
}