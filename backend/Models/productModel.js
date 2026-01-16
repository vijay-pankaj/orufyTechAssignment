const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },

    productType: {
      type: String,
      required: true,
      enum: ['foods', 'electronics', 'clothes', 'beautyProduct', 'other']
    },

    quantityStock: {
      type: Number,
      required: true,
      min: 0
    },

    MRP: {
      type: Number,
      required: true,
      min: 0
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    brandName: {
      type: String,
      required: true,
      trim: true
    },

    isPublished:{
      type:Boolean,
      default:false,
    },
    
    exchangeEligibility: {
      type: String,
      enum: ['yes', 'no'],
      required: true
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"orufyuser",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
