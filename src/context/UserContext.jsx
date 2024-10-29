import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
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
