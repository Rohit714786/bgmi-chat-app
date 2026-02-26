import React, { useContext, useState } from 'react'
import { RiImageAddFill } from 'react-icons/ri';
import { AiOutlineSend } from 'react-icons/ai';

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function generateId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "id-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [sending, setSending] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const hasChat = data?.chatId && data.chatId !== "null" && data?.user?.uid;

  const updateUserChats = async (chatId, textToSave) => {
    if (!currentUser?.uid || !data?.user?.uid) return;
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatId + ".lastMessage"]: { text: textToSave },
      [chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [chatId + ".lastMessage"]: { text: textToSave },
      [chatId + ".date"]: serverTimestamp(),
    });
  };

  const handleSend = async () => {
    if (!hasChat || (!text.trim() && !img)) return;

    const chatId = data.chatId;
    const textToSend = text.trim();

    if (img) {
      setSending(true);
      const storageRef = ref(storage, generateId());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        () => {},
        () => {
          setSending(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                  id: generateId(),
                  text: textToSend,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
              await updateUserChats(chatId, textToSend || "Photo");
            } catch (e) {
              setSending(false);
              return;
            }
            setText("");
            setImg(null);
            setSending(false);
          });
        }
      );
    } else {
      setSending(true);
      try {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: generateId(),
            text: textToSend,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        await updateUserChats(chatId, textToSend);
        setText("");
      } catch (e) {
        // keep text on error
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        value={text}
        disabled={!hasChat || sending}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
          disabled={!hasChat || sending}
        />
        <label htmlFor="file" className={!hasChat || sending ? "disabled" : ""}>
          <span className="imgsend"><RiImageAddFill /></span>
        </label>
        <button
          type="button"
          className="btnsend"
          onClick={handleSend}
          disabled={!hasChat || sending || (!text.trim() && !img)}
          title="Send"
        >
          {sending ? <span className="sending-dot">...</span> : <AiOutlineSend />}
        </button>
      </div>
    </div>
  );
};

export default Input;