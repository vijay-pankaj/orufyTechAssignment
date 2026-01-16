const Product = require('../Models/productModel');
const ProductImage = require('../Models/productImgModel');
const {uploadImage} = require('../cloudinary');
const mongoose = require('mongoose');

//addproducts
exports.addProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      productName,
      productType,
      quantityStock,
      MRP,
      sellingPrice,
      brandName,
      exchangeEligibility
    } = req.body;
    if (
      !productName || !productType || quantityStock == null || !MRP || !sellingPrice || !brandName || !exchangeEligibility
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (sellingPrice > MRP) {
      return res.status(400).json({
        success: false,
        message: 'Selling price cannot be greater than MRP'
      });
    }

    const product = await Product.create(
      [{
        productName,
        productType,
        quantityStock,
        MRP,
        sellingPrice,
        brandName,
        exchangeEligibility,
        userId:req.userDetail._id,
      }], {
        session
      }
    );

    if (!req.files || !req.files.images) {
      throw new Error('Please upload at least 1 image');
    }

    const files = Array.isArray(req.files.images) ?
      req.files.images :
      [req.files.images];

    const uploadResults = await uploadImage(files);

    const productImagesData = uploadResults.map((img) => ({
      productImage: img.secure_url,
      productId: product[0]._id
    }));

    await ProductImage.insertMany(productImagesData, {
      session
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
      images: productImagesData
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error('Transaction Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: err.message
    });
  }
};

//update product
exports.editProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const {
      productName,
      productType,
      quantityStock,
      MRP,
      sellingPrice,
      brandName,
      exchangeEligibility
    } = req.body;

    if (MRP && sellingPrice && sellingPrice > MRP) {
      return res.status(400).json({
        success: false,
        message: 'Selling price cannot be greater than MRP'
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId, {
        ...(productName && {
          productName
        }),
        ...(productType && {
          productType
        }),
        ...(quantityStock !== undefined && {
          quantityStock
        }),
        ...(MRP && {
          MRP
        }),
        ...(sellingPrice && {
          sellingPrice
        }),
        ...(brandName && {
          brandName
        }),
        ...(exchangeEligibility && {
          exchangeEligibility
        })
      }, {
        new: true,
        session
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ?
        req.files.images :
        [req.files.images];

      const uploadResults = await uploadImage(files);

      const productImagesData = uploadResults.map((img) => ({
        productImage: img.secure_url,
        productId
      }));

      await ProductImage.insertMany(productImagesData, {
        session
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Edit Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

//delete product
exports.deleteProduct = async (req, res) => {
  const {
    id
  } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findByIdAndDelete(id, {
      session
    });

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await ProductImage.deleteMany({
      productId: id
    }, {
      session
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};


//publish=unpublish,unpublish=publish
exports.toggleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isPublished: !currentProduct.isPublished },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Product publish status updated',
      isPublished: updatedProduct.isPublished
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Toggle failed'
    });
  }
};

//get publishedProducts
exports.getPublished = async (req, res) => {
  try {
    const loggedUser=req.userDetail._id
    console.log("loggedUserId",loggedUser);
    // const publishedProducts = await Product.find({ isPublished: true });
    const publishedProducts = await Product.aggregate([
      {
        $match: { isPublished: true,userId:loggedUser }
      },
      {
        $lookup: {
          from: 'productimages',
          localField: '_id', 
          foreignField: 'productId', 
          as: 'images'                  
        }
      }
    ]);
    if (publishedProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No published products found',
        data: []
      });
    }
    return res.status(200).json({
      success: true,
      data: publishedProducts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

//getUnpublished Products
exports.getUnPublished=async(req,res)=>{
  try {
    // const unpublishedProducts=await Product.find({isPublished:false})
    const loggedUser=req.userDetail._id;
    const unpublishedProducts = await Product.aggregate([
      {
        $match: { isPublished: false,userId:loggedUser}
      },
      {
        $lookup: {
          from: 'productimages',
          localField: '_id', 
          foreignField: 'productId', 
          as: 'images'                  
        }
      }
    ]);
    
  if(unpublishedProducts.length===0){
    return res.status(200).json({success:true,message:"No Unpublished Products Found",data:[]})
  }
  return res.status(200).json({success:true,data:unpublishedProducts})
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
}

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const loggedUser=req.userDetail._id;
    const products = await Product.aggregate([{$match:{userId:loggedUser}},
      {
        $lookup: {
          from: 'productimages',       
          localField: '_id',            
          foreignField: 'productId', 
          as: 'images'
        }
      }
    ]);

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Products Found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products"
    });
  }
};
