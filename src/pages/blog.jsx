import { useEffect, useState } from "react";
import PostList from "./postList";
import { auth } from "../firebase";
import LoadingSpinner from "../utils/loading";

const Blog = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <PostList currentUserIDForDelete={user?.uid}  />
    </div>
  );
};

export default Blog;
