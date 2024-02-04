import { useEffect } from "react";
import AppRoutes from "./routes/mainRoutes";
import { useDispatch } from "react-redux";
import { loginUser } from "./redux/slices/auth";
import Main from "./pages/mainPage";

export const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const val = window.localStorage.getItem("userId");
  //   if (val && val === "1") {
  //     dispatch(loginUser());
  //   }
  // }, [dispatch]);

  return <Main />;
};

export default App;
