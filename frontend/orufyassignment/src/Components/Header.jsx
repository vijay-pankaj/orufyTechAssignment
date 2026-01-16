import React from 'react';
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem("authToken");
    localStorage.clear(); 
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className='header'>
      <div>
      </div>

      <button className='logout' onClick={handleLogout}>
        LogOut
      </button>
    </div>
  );
};

export default Header;
