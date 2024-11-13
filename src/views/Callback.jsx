import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { isAuthenticated, error, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the map or dashboard after successful authentication
      navigate("/map");
    } else if (error) {
      console.error("Authentication Error:", error);
      // Handle the error accordingly
    }
  }, [isAuthenticated, error, navigate]);

  return <div>Loading...</div>;
};

export default Callback;
