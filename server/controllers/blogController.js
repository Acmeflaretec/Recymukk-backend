const Blog = require('../models/blogs');
const fs = require('fs');

const getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (!req?.query?.isAdmin) {
      filter.status = true;
    }
    const data = await Blog.find(filter);
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const addBlog = async (req, res) => {
  try {
    const { title, subtitle, url, description, status } = req?.body
    const image = req?.file?.filename
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const data = new Blog({ title, subtitle, url, image, description, status })
    await data.save()
    res.status(201).json({ data, message: 'Blog created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ data: blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const updateBlog = async (req, res) => {
  const { _id, title, subtitle, url, description, status } = req.body;
  const image = req?.file?.filename;
  try {
    const data = await Blog.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Blog not found' });
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
    await Blog.updateOne({ _id }, {
      $set: { title, subtitle, url, description, status, ...(image && { image }) }
    })
    res.status(200).json({ data, message: 'Blog updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Blog.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    fs.unlink(`public/uploads/${data?.image}`, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }
      console.log('Image deleted successfully.');
    });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

module.exports = {
  getBlogs,
  addBlog,
  getBlogById,
  updateBlog,
  deleteBlog
}