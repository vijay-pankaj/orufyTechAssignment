const mongoose = require('mongoose');

const productImgSchema = new mongoose.Schema(
  {
    productImage: {
      type: String,
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductImage', productImgSchema);
