import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { RiUserAddLine } from "react-icons/ri";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  function refreshPage() {}

  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.userImage.files[0];
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `${displayName}${res.user.uid}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
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
          });
        }
      );

      alert("Registered successfully!");
    } catch (err) {
      setErr(true);
      console.error(err); // Log the error for debugging
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
            style={{ display: "none" }}
          />
          <label htmlFor="file">
            <RiUserAddLine />
          </label>
          <input type="text" name="displayName" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button onClick={refreshPage}>Sign up</button>
          {err && <span className="error">Something went wrong</span>}
        </form>
        <p>
          Already have an account ?<Link to="/Login"> Login </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
