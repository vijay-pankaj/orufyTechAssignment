import React, { useEffect, useState } from "react";
import { TbCategoryPlus } from "react-icons/tb";
import "./NoProductIcon.css"
import axios from 'axios'
import { toast } from "react-toastify";

const Published = () => {
  const [products, setProducts] = useState([]);
  const Token=localStorage.getItem('authToken')


  const unpublishProduct=async(id)=>{
    try {
      const res=await axios.put(` https://orufy-tech-backend-e4zy.onrender.com/products/toggle/${id}`,{},{headers:{Authorization:`Bearer ${Token}`}})
    toast.success(res.data.message)
    fetchPublishedProducts()
    } catch (error) {
      console.log(error);
      toast.error("Error While publishing Product")
    }
  }

  const fetchPublishedProducts=async()=>{
    try {
      const res=await axios.get(' https://orufy-tech-backend-e4zy.onrender.com/products/published',{headers:{Authorization:`Bearer ${Token}`}})
    console.log(res.data.data);
    setProducts(res.data.data)
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch published product");
    }
  }
  useEffect(()=>{
    fetchPublishedProducts();
  },[])

  const deleteProduct=async(id)=>{
   try {
    const res=await axios.delete(` https://orufy-tech-backend-e4zy.onrender.com/products/deleteproduct/${id}`,{headers:{Authorization:`Bearer ${Token}`}})
    toast.success(res?.data?.message||"Product deleted!")
   } catch (error) {
    console.log(error);
    toast.error("Error while deleting Product!")
   }
  }
  return (
    <>
      {products.length === 0 && (
        <div className="noProduct_box">
          <div className="icon">
<TbCategoryPlus className="noProductIcon" />
          </div>
          
         <h3> No Published Products </h3>
         <p>
          Your Published Products will appear here <br />
          Create your first product to publish
         </p>
      </div>
      )}

      {products.length > 0 && (
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
               <button className="publishBtn" onClick={()=>unpublishProduct(product._id)}>{product.isPublished===true?"Unpublish":"Publish"}</button>
               {/* <button className="editBtn">Edit</button> */}
               <button className="deleteBtn" onClick={()=>deleteProduct(product._id)}>🗑</button>
             </div>
       
           </div>
         ))}
       </div>
       
      )}
    </>
  );
};

export default Published;
