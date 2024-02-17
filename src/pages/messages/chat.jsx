import { useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../../services/messageServices";
import "./chat.css";
import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { id } = useSelector((state) => state.user);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  useEffect(() => {
    const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

    return () => unsubscribe();
  }, [selectedUser, id]);

  useEffect(() => {
    const sorted = messages.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      return dateA - dateB;
    });

    const seenTimestamps = new Set();

    const filteredData = sorted.filter((item) => {
      const timestamp = item.timestamp;
      if (seenTimestamps.has(timestamp)) {
        return false;
      } else {
        seenTimestamps.add(timestamp);
        return true;
      }
    });

    setSortedMessages(filteredData);
  }, [messages]);

  const handleMessageSend = () => {
    if (newMessage && selectedUser) {
      sendMessage(selectedUser.userId, id, newMessage);
      setNewMessage("");
      const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

      return () => unsubscribe();
    }
  };

  const formatTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    } else {
      const options = { day: "numeric", month: "short" };
      return messageDate.toLocaleDateString(undefined, options);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">{selectedUser && selectedUser.name}</div>
      <div className="messages">
        {sortedMessages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === id ? "sent" : "received"}`}
          >
            <p> {message.content} </p>
            <span>{formatTime(message.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMessageSend();
            }
          }}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
