import React from "react";

const Login = () => {
  return(
    <div className="formContainer">
      <div className="formWrapper">
      <span className="logo">BGMI Chat</span>
      <span className="title">Login</span>
        <form>
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />
          <button>Login</button>
        </form>
        <p>You Don't have an account? Register</p>
      </div>
    </div>
  )
}
export default Login;