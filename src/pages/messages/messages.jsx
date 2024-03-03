import { useSelector } from "react-redux";
import { getAllUsers } from "../../services/userServices";
import ChatBox from "./chat";
import "./messages.css";
import { useState, useEffect, useCallback } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import userPhoto from "../../images/userMale.png";
import StarsCanvas from "../../utils/starCanvas/starCanvas.tsx";

const MessageComponent = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [userImages, setUserImages] = useState({});

  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const users = await getAllUsers();
        setActiveUsers(users.filter((user) => user.userId !== id));
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
  }, [id]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedUserId(user.userId === selectedUserId ? null : user.userId);
  };

  const fetchUserImage = useCallback(
    async (userId) => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `user_photos/${userId}/user-photo.jpg`);
        const fbStorageListRef = ref(storage, `user_photos/${userId}`);

        listAll(fbStorageListRef).then((list) => {
          if (list.items.length > 0) {
            getDownloadURL(storageRef)
              .then((downloadURL) => {
                setUserImages((prevUserImages) => ({
                  ...prevUserImages,
                  [userId]: downloadURL,
                }));
              })
              .catch((error) => {});
          }
        });

      
      } catch (error) {}
    },
    [setUserImages]
  );

  useEffect(() => {
    activeUsers.forEach((user) => fetchUserImage(user.userId));
  }, [activeUsers, fetchUserImage]);

  return (
    <div className="message-container">
      <div className="starAnim">
        <StarsCanvas />
      </div>
      <div className="messageBox">
        <div className="active-users-container">
          <div className="h2title">
            <h2>Users</h2>
          </div>
          <ul className="active-users-list">
            {activeUsers.map((user) => (
              <li
                key={user.userId}
                className={`active-user ${
                  selectedUserId === user.userId ? "active" : ""
                }`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={
                    userImages[user.userId]
                      ? userImages[user.userId]
                      : userPhoto
                  }
                  alt="User Avatar"
                />

                <div>
                  <div className="active-user-name">{user.name}</div>
                  <div className="active-user-status">{user.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat">
          <ChatBox selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
