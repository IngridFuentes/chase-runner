import React, { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const UserContext = createContext();

// const API_URL = process.env.REACT_APP_API_URL;

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [profilePic, setProfilePic] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");

  // Fetch user data from database when user logs in
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading || !user) {
        return;
      }

      if (isAuthenticated && user) {
        try {
          setProfilePic(null);
          setUserData(null);

          const authToken = await getAccessTokenSilently();

          const url = `https://chase-runner-backend.vercel.app/users/${encodeURIComponent(
            user.sub
          )}`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();

            setUserData(data);

            if (data.picture) {
              // FIX: Use TextDecoder instead of Buffer (same as Profile.jsx)
              let pictureString;
              if (typeof data.picture === "object" && data.picture.data) {
                const uint8Array = new Uint8Array(data.picture.data);
                pictureString = new TextDecoder().decode(uint8Array);
              } else if (typeof data.picture === "string") {
                pictureString = data.picture;
              }

              if (pictureString) {
                setProfilePic(pictureString);
                localStorage.setItem(`profilePic_${user.sub}`, pictureString);
              } else {
                setProfilePic(null);
                localStorage.removeItem(`profilePic_${user.sub}`);
              }
            } else {
              setProfilePic(null);
              localStorage.removeItem(`profilePic_${user.sub}`);
            }
          } else if (response.status === 404) {
            console.log(
              "ℹ️ User not found in database, will be created on first activity"
            );
          } else {
            // console.log("❌ Failed to fetch user, status:", response.status);
            const errorText = await response.text();
            console.log("❌ Error response:", errorText);
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      } else {
        setProfilePic(null);
        setUserData(null);
      }
    };

    fetchUserData();
  }, [isLoading, isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        profilePic,
        setProfilePic,
        userData,
        setUserData,
        token,
        setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
