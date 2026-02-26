import React, { useContext, useEffect, useState } from "react";
import Input from "./Input";
import Messages from "./Messages";
import githubimg from "../images/githubicon.png";
import mypic from "../images/mypic.png";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const [isShown, setIsShown] = useState(false);
  const handleClick = () => {
    setIsShown(!isShown);
  };

  const [isLarge, setIsLarge] = useState(false);
  const larger = () => {
    setIsLarge(!isLarge);
  };
  const closeImage = () => {
    setIsLarge(false); // Set isLarge to false when clicking on the close button.
  };

  const { data } = useContext(ChatContext);

  const hasChat = data?.chatId && data.chatId !== "null" && data?.user?.uid;

  return (
    <div className="chat">
      <div className="navbarChat">
        <div className="profile">
          <img
            className="userimg"
            src={
              data.user?.photoURL ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle fill='%232E2E2E' cx='20' cy='20' r='20'/%3E%3Ctext x='20' y='26' fill='%23ffc500' text-anchor='middle' font-size='18' font-family='sans-serif'%3E💬%3C/text%3E%3C/svg%3E"
            }
            onClick={hasChat ? larger : undefined}
            alt=""
          />
          {isLarge && data.user?.photoURL && (
            <div
              className="enlarged-image-container"
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.8)", // Semi-transparent black background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "1000", // Ensure it's on top of other elements
              }}
            >
              <img
                src={data.user?.photoURL}
                alt=""
                style={{
                  maxWidth: "90%", // Adjust the maximum width as needed
                  maxHeight: "90%", // Adjust the maximum height as needed
                }}
              />

              <button
                className="close-button"
                onClick={closeImage}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "24px",
                  color: "white",
                  cursor: "pointer",
                  zIndex: "1001", // Ensure it's above the background
                }}
              >
                &#x2716; {/* Unicode "x" character */}
              </button>
            </div>
          )}
          <span className="name">
            {hasChat ? data.user?.displayName : "BGMI Chat"}
          </span>
        </div>

        <div className="buttons">
          <span
            className="about"
            style={{ display: isShown ? "block" : "none" }}
          >
            <div className="nav">
              <div className="dots">
                <span className="dot1" onClick={handleClick}></span>
                <span className="dot2"></span>
                <span className="dot3"></span>
              </div>
              <div className="github">
                <a
                  href="https://github.com/Rohit714786/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="githubicon" src={githubimg} alt="GitHub" />
                </a>
              </div>
            </div>

            <span>
              <img className="mypic" src={mypic} alt=""></img>
            </span>

            <p>
              <FaLessThan className="icon" />
              <span className="key">html</span>
              <FaGreaterThan className="icon" />
              <br />
              <span className="tab1">
                <FaLessThan className="icon" />
                <span className="key">head</span>
                <FaGreaterThan className="icon" />
                <br />
              </span>
              <span className="tab2">
                <FaLessThan className="icon" />
                <span className="key">title</span>
                <FaGreaterThan className="icon" />
                About me
                <FaLessThan className="icon" />
                <span className="key">title</span>
                <span className="backslash">/</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <span className="tab1">
                <FaLessThan className="icon" />
                <span className="key">head</span>
                <span className="backslash">/</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <span className="tab1">
                <FaLessThan className="icon" />
                <span className="key">body</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <span className="tab2">
                <FaLessThan className="icon" />
                <span className="key">p</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <span className="tab3">
                Hello, My name is{" "}
                <span>
                  <a href="https://www.linkedin.com/in/rohitrathor714/">
                    Rohit Rathore
                  </a>
                </span>
                . I have completed my graduation from Indore Institute of
                Science & Technology.
                <br />I have created this web app using React.js, Firebase, and
                for the styling, I have used SASS. For more info, click the
                GitHub icon.
              </span>
              <span className="tab2">
                <FaLessThan className="icon" />
                <span className="key">p</span>
                <span className="backslash">/</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <span className="tab1">
                <FaLessThan className="icon" />
                <span className="key">body</span>
                <span className="backslash">/</span>
                <FaGreaterThan className="icon" />
              </span>
              <br />
              <FaLessThan className="icon" />
              <span className="key">html</span>
              <span className="backslash">/</span>
              <FaGreaterThan className="icon" />
            </p>
          </span>
          <button className="aboutBtn" onClick={handleClick}>
            About me
          </button>
          <button className="logoutBtn" onClick={() => signOut(auth)}>
            Log out
          </button>
        </div>
      </div>
      {hasChat ? (
        <>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="chat-placeholder">
          <div className="chat-placeholder-icon">💬</div>
          <p>Choose a conversation</p>
          <span>Search for a user in the sidebar to start chatting</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
