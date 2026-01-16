import React, { useEffect, useState } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import { toast } from "react-toastify";
import axios from 'axios';
import "./ProductCards.css"

const Unpublished = () => {
  const [products, setProducts] = useState([]);
  const Token=localStorage.getItem('authToken')
  const publishProduct=async(id)=>{
    try {
      const res=await axios.put(` https://orufytechassignmentbackend.onrender.com/products/toggle/${id}`,{},{headers:{Authorization:`Bearer ${Token}`}})
    toast.success(res.data.message)
    fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Error While publishing Product")
    }
  }

  // Fetch unpublished products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(' https://orufytechassignmentbackend.onrender.com/products/unpublished',{headers:{Authorization:`Bearer ${Token}`}});
      console.log(res.data.data);
      toast.success(res?.data?.message);
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct=async(id)=>{
    try {
     const res=await axios.delete(` https://orufytechassignmentbackend.onrender.com/products/deleteproduct/${id}`,{headers:{Authorization:`Bearer ${Token}`}})
     toast.success(res?.data?.message||"Product deleted!")
    } catch (error) {
     console.log(error);
     toast.error("Error while deleting Product!")
    }
   }
  return (
    <>
      {products.length === 0 ? (
        <div className="noProduct_box">
          <div className="icon">
            <TbCategoryPlus className="noProductIcon" />
          </div>
          <h3>No Published Products</h3>
          <p>
            Your Published Products will appear here <br />
            Create your first product to publish
          </p>
        </div>
      ) : (
        <div className="productsGrid">
        {products.map((product) => (
          <div key={product._id} className="productCard">
      
            <div className="imageWrapper">
              <img
                src={product.images?.[0]?.productImage}
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
              <p><span>Total Number of images -</span> {product.images?.length}</p>
              <p><span>Exchange Eligibility -</span> {product.exchangeEligibility?.toUpperCase()}</p>
            </div>
      
            <div className="actions">
              <button className="unpublishBtn" onClick={()=>publishProduct(product._id)}>Publish</button>
              {/* <button className="editBtn">Edit</button> */}
              <button className="deleteBtn" onClick={()=>deleteProduct(id)}>🗑</button>
            </div>
      
          </div>
        ))}
      </div>
      
      )}

    </>
  );
};

export default Unpublished;
