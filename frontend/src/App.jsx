import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppRouter } from "./router/AppRouter";
import { fetchMe } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch, token]);

  return <AppRouter />;
}
