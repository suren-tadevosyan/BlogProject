import { useSelector } from "react-redux";

export function useAuth() {
  const { email1, token, id } = useSelector((state) => state.user);

  return {
    isAuth: !!email1,
    email1,
    token,
    id,
  };
}
