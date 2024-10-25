import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem("profilePic", profilePic);
    }
  }, [profilePic]);

  return (
    <UserContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </UserContext.Provider>
  );
};
