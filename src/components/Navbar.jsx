import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  // Check if currentUser exists and has a photoURL property
  const userPhoto = currentUser?.photoURL || "";

  return (
    <div className="Navbar">
      <div className="logo">
        <span className="logo1">
          Bgmi<span className="logo2"> chat</span>
        </span>
      </div>
      <div className="user">
        {/* Display the user's profile image if available */}
        {userPhoto && <img src={userPhoto} alt="User" />}
      </div>
    </div>
  );
};

export default Navbar;
