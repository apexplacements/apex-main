import React from "react";
import { useNavigate } from "react-router-dom";

const HomeComp = () => {
  const navigate = useNavigate();
  const storedUser = sessionStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="home-container">
      <h1>Welcome{currentUser?.user_name ? `, ${currentUser.user_name}` : ""}!</h1>

      <p>
        This is your home page. Your account is registered but does not have a
        role-based dashboard.
      </p>

      <div className="home-actions">
        <button
          onClick={() => {
            sessionStorage.removeItem("currentUser");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomeComp;