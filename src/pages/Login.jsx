import React, { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

//import { RiUserAddLine } from 'react-icons/ri';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="logo">
          <span className="logo1">
            Bgmi<span className="logo2"> chat</span>
          </span>
        </div>
        <span className="title">Log in</span>
        <form onSubmit={handleSubmit}>
          <input type="Email" placeholder="Email"></input>
          <input type="password" placeholder="password"></input>
          <button>Sign in</button>

          {err && <span className="error">Something went wrong</span>}
        </form>
        <p>
          You don't have an account ? <Link to="/register"> Register </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
