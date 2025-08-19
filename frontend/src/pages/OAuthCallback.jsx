import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const decodedUser = JSON.parse(atob(user)); // decode base64 user info
        setUser(decodedUser, token);
        navigate("/dashboard");
      } catch (err) {
        navigate("/login");
        console.log("error : ",err.message);
      }
    } else {
      navigate("/login");
    }
  }, [navigate, setUser]);

  return <p className="text-center mt-10">Signing you in with Google...</p>;
};

export default OAuthCallback;
