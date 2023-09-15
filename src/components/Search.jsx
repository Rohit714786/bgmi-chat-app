import React, { useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (username.trim() === "") {
      setError("Please enter a username to search.");
      return;
    }

    setError(null);

    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });

      if (querySnapshot.empty) {
        setError("User not found.");
      }
    } catch (err) {
      setError("An error occurred while searching for the user.");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchform">
        <input
          type="search"
          placeholder="Search users..."
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      {user && (
        <div className="userchat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userchatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
