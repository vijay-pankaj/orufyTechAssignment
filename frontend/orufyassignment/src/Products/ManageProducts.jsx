import React, { useEffect, useState } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import "./ManageProduct.css"
import axios from "axios"
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdOutlineShoppingBag } from "react-icons/md";
import useDebouncee from '../CustomHooks/useDebouncee';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search,setSearch]=useState("");
  console.log(search);

const debounceSearch=useDebouncee(search)

  const Token=localStorage.getItem("authToken")

  const [productForm, setProductForm] = useState({
    productName: "",
    productType: "",
    quantityStock: "",
    MRP: "",
    sellingPrice: "",
    brandName: "",
    exchangeEligibility: "yes",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    const newPreviews = files.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      isNew: true
    }));
    
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = async (index) => {
    const imageToRemove = imagePreviews[index];
    
    if (imageToRemove._id) {
      try {
        const res = await axios.delete(` https://orufy-tech-backend-e4zy.onrender.com/products/deleteimg/${imageToRemove._id}`,{headers:{Authorization:`Bearer ${Token}`}});
        console.log(res.data.message);
        toast.success(res.data.message);
      } catch (error) {
        console.log(error);
        toast.error("Error deleting image from server");
        return;
      }
    } else if (imageToRemove.isNew) {
      
      URL.revokeObjectURL(imageToRemove.url);
    }
    if (imageToRemove.isNew) {
      const newImages = [...images];
      // Find the corresponding file in images array
      const imageIndex = newImages.findIndex((img, idx) => {
        return imagePreviews.indexOf(imageToRemove) === 
               idx + (imagePreviews.length - newImages.length);
      });
      
      if (imageIndex >= 0) {
        newImages.splice(imageIndex, 1);
        setImages(newImages);
      }
    }
    
    // Remove from previews
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const toggleProduct = async (id) => {
    try {
      const res = await axios.put(` https://orufy-tech-backend-e4zy.onrender.com/products/toggle/${id}`,{},{headers:{Authorization:`Bearer ${Token}`}})
      toast.success(res.data.message)
      fetchallProducts();
    } catch (error) {
      console.log(error);
      toast.error("Error While publishing Product")
    }
  }

  const fetchallProducts = async () => {
    try {
      const res = await axios.get(' https://orufy-tech-backend-e4zy.onrender.com/products/getallproduct',{headers:{Authorization:`Bearer ${Token}`}})
      console.log(res.data.data);
      setProducts(res.data.data)
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching all Products")
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName,
      productType: product.productType,
      quantityStock: product.quantityStock,
      MRP: product.MRP,
      sellingPrice: product.sellingPrice,
      brandName: product.brandName,
      exchangeEligibility: product.exchangeEligibility,
    });
    
    // Store existing images with their IDs
    const existingPreviews = product.images?.map(img => ({
      _id: img._id,
      url: img.productImage,
      isNew: false
    })) || [];
    
    setImagePreviews(existingPreviews);
    setImages([]); 
    setExistingImages(product.images || []);
    setShowForm(true);
  };

  const resetForm = () => {
    setProductForm({
      productName: "",
      productType: "",
      quantityStock: "",
      MRP: "",
      sellingPrice: "",
      brandName: "",
      exchangeEligibility: "yes",
    });
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
  
    try {
      const formData = new FormData();
  
      Object.keys(productForm).forEach((key) => {
        formData.append(key, productForm[key]);
      });
  
      images.forEach((img) => {
        formData.append("images", img);
      });
  
      const res = await axios.post(
        " https://orufy-tech-backend-e4zy.onrender.com/products/addproduct",
        formData,{headers:{Authorization:`Bearer ${Token}`}}
      );
  
      console.log(res.data.message);
      toast.success(res?.data?.message);
      resetForm();
      fetchallProducts();
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error(
        error?.response?.data?.message || "Product add failed"
      );
      toast.error(
        error?.response?.data?.message || "Failed to add product",
        { position: "bottom-right" }
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setloading(true);
    
    try {
      const formData = new FormData();
      
      Object.keys(productForm).forEach((key) => {
        formData.append(key, productForm[key]);
      });
      
      images.forEach((img) => {
        formData.append("images", img);
      });
      
      const remainingExistingImages = imagePreviews
        .filter(preview => !preview.isNew)
        .map(preview => preview._id);
      
      formData.append("existingImages", JSON.stringify(remainingExistingImages));
      
      const res = await axios.put(
        ` https://orufy-tech-backend-e4zy.onrender.com/products/editProduct/${editingProduct._id}`,
        formData,{headers:{Authorization:`Bearer ${Token}`}}
      );
      
      toast.success(res?.data?.message);
      resetForm();
      fetchallProducts();
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update product",
        { position: "bottom-right" }
      );
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await axios.delete(` https://orufy-tech-backend-e4zy.onrender.com/products/deleteproduct/${id}`,{headers:{Authorization:`Bearer ${Token}`}});
        toast.success(res.data.message);
        fetchallProducts();
      } catch (error) {
        console.log(error);
        toast.error("Error while deleting product");
      }
    }
  };

  useEffect(() => {
    fetchallProducts();
  }, []);
const filteredData = products.filter((item) => {
  const searchText = debounceSearch.toLowerCase();

  return (
    item.productName?.toLowerCase().includes(searchText) ||
    item.brandName?.toLowerCase().includes(searchText) ||
    item.productType?.toLowerCase().includes(searchText)
  );
});
  return (
    <>
      {products.length === 0 && !showForm && (
        <div className="noProduct_box">
          <div className="icon">
            <TbCategoryPlus className="noProductIcon" />
          </div>

          <h3>Feels a little empty over here...</h3>
          <p>
            You can create products without connecting store <br />
            you can add products to store anything
          </p>

          <button
            className="addproduct"
            onClick={() => setShowForm(true)}
          >
            Add your Products
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <span className="close-btn" onClick={resetForm}>✕</span>
            </div>

            <form className="productForm" onSubmit={editingProduct ? handleUpdate : handleSubmit}>
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={productForm.productName}
                onChange={handleChange}
                required
              />
              
              <label>Product Type</label>
              <select
                name="productType"
                value={productForm.productType}
                onChange={handleChange}
                required
              >
                <option value="">Select product type</option>
                <option value="foods">Foods</option>
                <option value="electronics">Electronics</option>
                <option value="clothes">Clothes</option>
                <option value="beautyProduct">Beauty Product</option>
                <option value="other">Other</option>
              </select>

              <label>Quantity Stock</label>
              <input
                type="number"
                name="quantityStock"
                placeholder="Total numbers of stocks available"
                value={productForm.quantityStock}
                onChange={handleChange}
                required
              />
              
              <label>MRP</label>
              <input
                type="number"
                name="MRP"
                placeholder="MRP"
                value={productForm.MRP}
                onChange={handleChange}
                required
              />
              
              <label>Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                placeholder="Selling Price"
                value={productForm.sellingPrice}
                onChange={handleChange}
                required
              />
              
              <label>Brand Name</label>
              <input
                type="text"
                name="brandName"
                placeholder="Brand Name"
                value={productForm.brandName}
                onChange={handleChange}
                required
              />

              <label>Upload Product images</label>
              <input
                className='imageInput'
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreviews.length > 0 && (
                <div className="image-previews-section">
                  <h4>Image Previews ({imagePreviews.length} images):</h4>
                  <div className="image-preview-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={preview.id || preview._id} className="image-preview-item">
                        <img 
                          src={preview.url} 
                          alt={`Preview ${index + 1}`} 
                          className="preview-image"
                        />
                        <button 
                          type="button" 
                          className="remove-preview-btn"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label>Exchange or return eligibility</label>
              <select
                name="exchangeEligibility"
                value={productForm.exchangeEligibility}
                onChange={handleChange}
                required
              >
                <option value="yes">Exchange Available</option>
                <option value="no">No Exchange</option>
              </select>

              <div className="formActions">
                <button 
                  type="submit" 
                  className='submitbtn'
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div>

          <div className='productheader'>
            <h2> <MdOutlineShoppingBag /> Products</h2>  
            <div className="search-wrapper">
    <CiSearch className="productsearch-icon" />
    <input
      type="text"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      placeholder="search your product"
      className="productsearch"
    />
  </div>
            <p className="addnewproduct" onClick={() => setShowForm(true)}>
              <div className='addproductbtn'><FaPlus />Add your Products</div>
            </p>
          </div>
          
          <div className="productsGrid">
            {filteredData.map((product) => (
              <div key={product._id} className="productCard">
                <div className="imageWrapper">
                  <img
                    src={product.images?.[0]?.productImage || 'https://via.placeholder.com/150'}
                    alt={product.productName}
                  />
                </div>
          
                <h3 className="productName">{product.productName}</h3>
          
                <div className="details">
                  <p><span>Product type -</span> {product.productType}</p>
                  <p><span>Quantity Stock -</span> {product.quantityStock}</p>
                  <p><span>MRP -</span> ₹ {product.MRP}</p>
                  <p><span>Selling Price -</span> ₹ {product.sellingPrice}</p>
                  <p><span>Brand Name -</span> {product.brandName}</p>
                  <p><span>Total Number of images -</span> {product.images?.length || 0}</p>
                  <p><span>Exchange Eligibility -</span> {product.exchangeEligibility?.toUpperCase()}</p>
                </div>
          
                <div className="actions">
                  <button
                    className={product.isPublished ? "publishBtn" : "unpublishBtn"}
                    onClick={() => toggleProduct(product._id)}
                  >
                    {product.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button 
                    className="editBtn" 
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="deleteBtn" 
                    onClick={() => deleteProduct(product._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProducts;