import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-main">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
