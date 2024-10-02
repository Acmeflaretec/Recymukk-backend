const Product = require('../models/product');
const Category = require('../models/category')


const getProducts = async (req, res) => {
  try {
    const { page = 1, perPage = 12, sortBy = 'createdAt', order = 'desc', search = '', category } = req.query;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };  
    }

    let categoryNotFound = false;
    if (category) {    
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(category, 'i') },
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        categoryNotFound = true;
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 },
      populate: 'category',
    };
    const products = await Product.paginate(query, options);
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, products.totalDocs);

    let responseMessage = `Showing ${start} – ${end} of ${products.totalDocs} results for "${category}"`;
    if (products.docs.length === 0 || categoryNotFound) {
      const suggestedProducts = await Product.paginate(
        { ...(search && { name: { $regex: search, $options: 'i' } }) },
        options
      );

      responseMessage = `No results for "${category}". Showing suggested products for "${category}".`

      return res.status(200).json({
        message: responseMessage,
        products: suggestedProducts.docs,
        totalPages: suggestedProducts.totalPages,
      });
    }

    res.status(200).json({
      message: responseMessage,
      products: products.docs,
      totalPages: products.totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 }
    };

    const products = await Product.paginate(query, options);


    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};


const getProductById = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id }).populate('category').populate('similarProduct').populate('variantProduct')
    res.status(200).json({ data, message: 'product found successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}
const getClientProductById = async (req, res) => {
  console.log('getClientProductById');
  const id = req.params.id
  console.log('getClientProductById id', id);

  try {
    const product = await Product.findById(id)
      .populate('category')
      .populate({
        path: 'similarProduct',
        populate: {
          path: 'category',
        },
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error });
  }
}

const addProduct = async (req, res) => {
  try {
    console.log(req.files);
    const { name, subheading, category, brand, price, stock, discount, material, sale_rate, description, feature, spec, sizes, sizeQuantity, fitAndCare, similarProduct,variantProduct } = req?.body

    const similarProductArray = Array.isArray(similarProduct) ? similarProduct : [similarProduct];
    const variantProductArray = Array.isArray(variantProduct) ? variantProduct : [variantProduct];
    let sizeValue = [];
    if (sizes) {
      const sizesArray = Array.isArray(sizes) ? sizes : [sizes];

      const quantityArray = Array.isArray(sizeQuantity) ? sizeQuantity : [sizeQuantity];

      const sizesInside = sizesArray.map((sizes, index) => ({
        sizes,
        quantity: quantityArray[index]
      }));
      sizeValue = sizesInside[0]?.sizes ? sizesInside : undefined;
    }

    if (req.files.length != 0) {
      const product = new Product({
        name, subheading, category, brand, price, stock, discount, material, sale_rate, description, fitAndCare, feature, spec, sizes: sizeValue, similarProduct,variantProduct,
        image: req.files.map((x) => x.filename),
      });
      await product.save();

      if (variantProductArray.length > 0) {

        variantProductArray?.forEach(proId => {
          const updateFunction = async () => {
            const updateProduct = await Product.updateOne({ _id: proId }, { $push: { variantProduct: product._id } })
          }
          updateFunction()
        });
      }
      if (product) {
        await Category.updateOne({ _id: category }, { $push: { products: product._id } })
        res.status(200).json({ message: "Product added successfully !" });

      } else {
        res.status(400).json({ message: "Something went wrong !" });
      }
    } else {
      res.status(400).json({ message: "failed only jpg ,jpeg, webp & png file supported !" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};
const addVariantProduct = async (req, res) => {
  try {
    // console.log(req.files.length);
    const { name, subheading, category, brand, price, stock, discount, material, sale_rate, description, feature, spec, sizes, sizeQuantity, fitAndCare, similarProduct,variantProduct,image } = req?.body
    console.log('category',category);
    
    
    const similarProductArray = Array.isArray(similarProduct) ? similarProduct : [similarProduct];
    const variantProductArray = Array.isArray(variantProduct) ? variantProduct : [variantProduct];
    let sizeValue = [];
    if (sizes) {
      const sizesArray = Array.isArray(sizes) ? sizes : [sizes];

      const quantityArray = Array.isArray(sizeQuantity) ? sizeQuantity : [sizeQuantity];

      const sizesInside = sizesArray.map((sizes, index) => ({
        sizes,
        quantity: quantityArray[index]
      }));
      sizeValue = sizesInside[0]?.sizes ? sizesInside : undefined;
    }

    const images = JSON.parse(image) ?? []
    if (req?.files?.length != 0) {
      req?.files?.map((x) => images.push(x.filename))
    }

    if (images) {
      const product = new Product({
        name, subheading, category, brand, price, stock, discount, material, sale_rate, description, fitAndCare, feature, spec, sizes: sizeValue, similarProduct,variantProduct,
        // image: req.files.map((x) => x.filename),
        image: images,
      });
      await product.save();

      if (similarProductArray.length > 0) {

        similarProductArray?.forEach(proId => {
          const updateFunction = async () => {
            const updateProduct = await Product.updateOne({ _id: proId }, { $push: { similarProduct: product._id } })
          }
          updateFunction()
        });
      }
      if (variantProductArray.length > 0) {

        variantProductArray?.forEach(proId => {
          const updateFunction = async () => {
            const updateProduct = await Product.updateOne({ _id: proId }, { $push: { variantProduct: product._id } })
          }
          updateFunction()
        });
      }
      if (product) {
        await Category.updateOne({ _id: category }, { $push: { products: product._id } })
        res.status(200).json({ message: "Product added successfully !" });

      } else {
        res.status(400).json({ message: "Something went wrong !" });
      }
    } else {
      res.status(400).json({ message: "failed only jpg ,jpeg, webp & png file supported !" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { _id, name, subheading, brand, price, stock, discount, material, sale_rate, description, image, isAvailable, fitAndCare, feature, spec, sizes, sizeQuantity, similarProduct,variantProduct } = req?.body

    const sizesArray = Array.isArray(sizes) ? sizes : [sizes];
    const similarProductArray = Array.isArray(similarProduct) ? similarProduct : [similarProduct];
    const variantProductArray = Array.isArray(variantProduct) ? variantProduct : [variantProduct];
    const quantityArray = Array.isArray(sizeQuantity) ? sizeQuantity : [sizeQuantity];

    const sizesInside = sizesArray.map((sizes, index) => ({
      sizes,
      quantity: quantityArray[index]
    }));
    const sizeValue = sizesInside[0]?.sizes ? sizesInside : undefined;

    const images = JSON.parse(image) ?? []
    if (req?.files?.length != 0) {
      req?.files?.map((x) => images.push(x.filename))
    }
    if (similarProductArray?.length > 0) {
      const product = await Product.findById(_id);

      similarProductArray?.forEach(proId => {
        const updateFunction = async () => {

          if (!product.similarProduct.includes(proId)) {

            const updateProduct = await Product.updateOne({ _id: proId }, { $push: { similarProduct: _id } })
          }
        }

        updateFunction()
      });
    }
    if (variantProductArray?.length > 0) {
      const product = await Product.findById(_id);

      variantProductArray?.forEach(proId => {
        const updateFunction = async () => {

          if (!product.variantProduct.includes(proId)) {

            const updateProduct = await Product.updateOne({ _id: proId }, { $push: { variantProduct: _id } })
          }
        }

        updateFunction()
      });
    }
    await Product.updateOne({ _id }, {
      $set: { name, subheading, brand, price, stock, discount, material, sale_rate, description, isAvailable, fitAndCare, feature, spec, sizes: sizeValue, image: images, similarProduct,variantProduct }
    })

    res.status(200).json({ message: "Product updated successfully !" });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: 'product deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}

const getTagProducts = async (req, res) => {
  try {
    const data = await Product.find({ isAvailable: true }).sort({ createdAt: -1 })
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};
const getSimilrProducts = async (req, res) => {
  try {
    const data = await Product.find({ isAvailable: true }).sort({ createdAt: -1 }).populate('similarProduct')
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};


module.exports = {
  getProducts,
  getProductById,
  getClientProductById,
  updateProduct,
  addProduct,
  addVariantProduct,
  deleteProduct,
  getAdminProducts,
  getTagProducts,
  getSimilrProducts
}  