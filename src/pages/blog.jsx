import { useEffect, useState } from "react";
import PostList from "./postList";
import { auth } from "../firebase";

const Blog = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Assuming you have some authentication logic here to set the user
    // For example, using Firebase authentication:
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
      <PostList currentUserIDForDelete={user?.uid}  />
    </div>
  );
};

export default Blog;
