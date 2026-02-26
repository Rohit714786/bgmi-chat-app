import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { RiUserAddLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.userImage.files[0];
    const displayName = (e.target.displayName.value || "").trim();
    const email = (e.target.email.value || "").trim();
    const password = e.target.password.value;

    setErr(false);
    setErrMessage("");

    if (!displayName) {
      setErr(true);
      setErrMessage("Name is required.");
      return;
    }
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
    if (password.length < 6) {
      setErr(true);
      setErrMessage("Password must be at least 6 characters.");
      return;
    }
    if (!file) {
      setErr(true);
      setErrMessage("Please select a profile image.");
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `${displayName}${res.user.uid}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          setErr(true);
          setErrMessage("Upload failed. Please try again.");
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              await updateProfile(res.user, {
                photoURL: downloadURL,
                displayName,
              });

              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                photoURL: downloadURL,
                displayName,
                email,
              });

              await setDoc(doc(db, "userChats", res.user.uid), {});
              navigate("/");
            } catch (e) {
              setErr(true);
              setErrMessage("Something went wrong. Please try again.");
            } finally {
              setLoading(false);
            }
          });
        }
      );
    } catch (e) {
      setErr(true);
      if (e.code === "auth/email-already-in-use") {
        setErrMessage("This email is already registered.");
      } else if (e.code === "auth/weak-password") {
        setErrMessage("Password is too weak.");
      } else if (e.code === "auth/invalid-email") {
        setErrMessage("Invalid email address.");
      } else {
        setErrMessage("Something went wrong. Please try again.");
      }
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
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="userImage"
            id="file"
            accept="image/*"
            style={{ display: "none" }}
          />
          <label htmlFor="file">
            <RiUserAddLine />
          </label>
          <input type="text" name="displayName" placeholder="Name" disabled={loading} />
          <input type="email" name="email" placeholder="Email" disabled={loading} />
          <input type="password" name="password" placeholder="Password" disabled={loading} />
          <button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
          {err && <span className="error">{errMessage || "Something went wrong"}</span>}
        </form>
        <p>
          Already have an account ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
