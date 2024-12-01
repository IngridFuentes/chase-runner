import React, { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth0();

  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || user.picture
  );

  const [token, setToken] = useState(localStorage.getItem("authToken") || "");

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem("profilePic", profilePic);
    }
  }, [profilePic]);

  useEffect(() => {
    console.log("token?");
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken"); // Remove token if null or empty
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{ profilePic, setProfilePic, token, setToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
