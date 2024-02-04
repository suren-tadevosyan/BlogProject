import React, { useEffect, useState } from "react";
import { getActiveUsers } from "../services/userServices";

const ActiveUsersList = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const users = await getActiveUsers();
      setActiveUsers(users);
    };

    fetchActiveUsers();
  }, []);

  return (
    <div>
      <h2>Active Users:</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.userId}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsersList;
