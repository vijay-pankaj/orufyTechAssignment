import React from "react";
import "./Sidebar.css";
import { GoHome } from "react-icons/go";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import imgicon from "../assets/images/realicon.png"

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logotext">Productr</div>
        <div>
          <img src={imgicon} alt="" className="imgicon" />
        </div>
      </div>

      <div className="sidebar-search">
        <CiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          
          <span> <GoHome />Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          
          <span> <MdOutlineShoppingBag />Products</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
