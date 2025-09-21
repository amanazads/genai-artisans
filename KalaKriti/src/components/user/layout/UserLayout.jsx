import React from "react";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import "./UserLayout.css";

const UserLayout = ({ children, showSearch = true }) => {
  return (
    <div className="user-layout">
      <UserHeader showSearch={showSearch} />
      <main className="main-content">{children}</main>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
