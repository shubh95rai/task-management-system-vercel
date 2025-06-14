import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export default function useCheckUserAuth() {
  const { user, loading, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
}

// not using this hook anymore, but keeping it here for reference