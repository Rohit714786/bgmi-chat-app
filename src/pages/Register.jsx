import React from "react";
import Add from "../img/addImage.jpeg"
const Register = () => {
  return (
  <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">BGMI Chat</span>
        <span className="title">Register</span>
        <form>
          <input type="text" placeholder="display name" required/>
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />
          <input style={{display:"none"}}
          type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
        </form>
        <p>Do you have an account? Login</p>
      </div>

  </div>
  );
}
export default Register;
