const Section = require('../models/sections');
const fs = require('fs');

const getSections = async (req, res) => {
   try {
      const data = await Section.find()
      res.status(200).json({ data })
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const getStoreSections = async (req, res) => {
   try {
      const data = await Section.find({ status: true })
         .populate({
            path: 'product',
            populate: { path: 'category' }
         });
      res.status(200).json({ data })
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const addSection = async (req, res) => {
   try {
      const { title, subtitle, product, description, status } = req?.body
      const image = req?.file?.filename
      if (!image) {
         return res.status(404).json({ message: 'Image not found' });
      }
      const data = new Section({ title, subtitle, product, image, description, status })
      await data.save()
      res.status(201).json({ data, message: 'Section created successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
}

const getSectionById = async (req, res) => {
   const { id } = req.params;
   try {
      const section = await Section.findById(id).populate('product')
      if (!section) {
         return res.status(404).json({ message: 'Section not found' });
      }
      res.status(200).json({ data: section });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
}

const updateSection = async (req, res) => {
   const { _id, title, product, subtitle, description, status } = req.body;
   const image = req?.file?.filename;
   try {
      const data = await Section.findById(_id);
      if (!data) {
         return res.status(404).json({ message: 'Section not found' });
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
      await Section.updateOne({ _id }, {
         $set: { title, subtitle, product, description, status, ...(image && { image }) }
      })
      res.status(200).json({ data, message: 'Section updated successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const deleteSection = async (req, res) => {
   const { id } = req.params;
   try {
      const data = await Section.findByIdAndDelete(id);
      if (!data) {
         return res.status(404).json({ message: 'Section not found' });
      }
      fs.unlink(`public/uploads/${data?.image}`, (err) => {
         if (err) {
            console.error('Error deleting image:', err);
            return;
         }
         console.log('Image deleted successfully.');
      });
      res.status(200).json({ message: 'Section deleted successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

module.exports = {
   getSections,
   getStoreSections,
   addSection,
   getSectionById,
   updateSection,
   deleteSection
}