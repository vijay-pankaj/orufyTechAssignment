import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Home.css";
import { NavLink, Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-layout">
      <div className="home-main">
        <div className="products">
          <NavLink
            to="published"
            end
            className={({ isActive }) =>
              isActive ? "published active" : "published"
            }
          >
            Published
          </NavLink>

          <NavLink
            to="unpublished"
            className={({ isActive }) =>
              isActive ? "unpublished active" : "unpublished"
            }
          >
            Unpublished
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
