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
        return false; // Skip duplicate timestamp
      } else {
        seenTimestamps.add(timestamp);
        return true; // Keep unique timestamp
      }
    });

    setSortedMessages(filteredData);
  }, [messages]);

  const handleMessageSend = () => {
    sendMessage(selectedUser.userId, id, newMessage);
    setNewMessage("");
    const unsubscribe = fetchMessages(selectedUser?.userId, id, setMessages);

    return () => unsubscribe();
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
            <p> {message.content}</p>
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
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
