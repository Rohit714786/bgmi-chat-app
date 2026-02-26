import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = (e.target[0].value || "").trim();
    const password = e.target[1].value;

    setErr(false);
    setErrMessage("");

    if (!email) {
      setErr(true);
      setErrMessage("Email is required.");
      return;
    }
    if (!password) {
      setErr(true);
      setErrMessage("Password is required.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      setErr(true);
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") {
        setErrMessage("Wrong email or password.");
      } else if (e.code === "auth/user-not-found") {
        setErrMessage("No account found with this email.");
      } else if (e.code === "auth/invalid-email") {
        setErrMessage("Invalid email address.");
      } else {
        setErrMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
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
          <input
            type="email"
            placeholder="Email"
            disabled={loading}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            disabled={loading}
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {err && (
            <span className="error">{errMessage || "Something went wrong"}</span>
          )}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
