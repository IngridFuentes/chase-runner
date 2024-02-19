import { usePassage } from "@passageidentity/passage-react";
import { PassageUser } from '@passageidentity/passage-elements/passage-user';
import { useState, useEffect } from "react";

export const usePassageUserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    user: null,
    authToken: null,
  });

// const { getCurrentUser } = usePassage();
const user = new PassageUser()

// const handleSignOut = async () => {
//     try {
//       // Call the signOut method to log the user out
//       const signedOut = await user.signOut();
//         console.log(signedOut, 'out')
//       if (signedOut) {
//         // If signOut is successful, update local state or perform any additional actions
//         setUserInfo(undefined);
//       }
//     } catch (err) {
//       console.error("Error signing out:", err);
//     }
//   };


  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      setLoading(true);

      try {
        const userInfo = await user.userInfo();
        const userAuthToken = await user.getAuthToken();
        console.log(userAuthToken, 'token')
        console.log(userInfo, 'user')
        if(isMounted){
            setUserInfo({
                user: userInfo,
                authToken: userAuthToken,
              });
        }
      } catch (err) {
        if(isMounted){
            setUserInfo({
                user: null,
                authToken: null,
              });
        }
      } finally {
        if(isMounted){
            setLoading(false);
        }
      }
    };
    const authenticateUser = async () => {
        // Code for user authentication
        // ...
  
        // After successful authentication, get the authentication token
        const userAuthToken = await user.getAuthToken();
  
        // Now you have the authentication token
        console.log('Authentication Token:', userAuthToken);
  
        // Continue with loading user info
        loadUserInfo();
      };
  
      authenticateUser();
  
    // loadUserInfo();
    return () => {
        isMounted = false;
      };
  }, []);

  return {
    loading,
    userInfo,
    // handleSignOut,
  };
};

export default usePassageUserInfo;