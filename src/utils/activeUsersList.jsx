import React, { useEffect, useState } from "react";
import { getActiveUsers } from "../services/userServices";
import { useSelector } from "react-redux";
import { OnlineAnimation } from "./successAnim";

const ActiveUsersList = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const users = await getActiveUsers();
      setActiveUsers(users);
    };
    fetchActiveUsers();
    const intervalId = setInterval(fetchActiveUsers, 15000);

    return () => clearInterval(intervalId);
  }, []);
  const filteredActiveUsers = activeUsers.filter((user) => user.userId !== id);

  return (
    <div className="onlineList">
      <h2>Active Users:</h2>
      <ul>
        {filteredActiveUsers.map((user) => (
          <li key={user.userId}>
            <div>
              <OnlineAnimation />
            </div>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsersList;
