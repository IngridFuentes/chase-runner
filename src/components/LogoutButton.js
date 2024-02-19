// // import usePassageLogout from "../hooks/usePassageLogout";
// import { useNavigate } from "react-router-dom";
// import { PassageUser } from '@passageidentity/passage-elements/passage-user';
// import { useState, useEffect } from "react";


// const LogoutButton = () => {

// const [userInfo, setUserInfo] = useState();
// const user = new PassageUser();
// const navigate = useNavigate();
// //   const { logout } = usePassageLogout();
// // const signedOut = user.signOut()
// // console.log(signedOut, 'log out?')
 
//   const handleSignOut = async () => {
//         try {
//           const signedOut = await user.signOut();
//             console.log(signedOut, 'out')
//           if (signedOut) {
//             setUserInfo(undefined);
//           }
//         } catch (err) {
//           console.error("Error signing out:", err);
//         }
//       };

// useEffect(() => {
//     let isMounted = true;
//     handleSignOut();
//     return() => {
//         isMounted = false;
//     }
// }, []);
//   const signout = () => {
//     // handleSignOut();
//     navigate("/");
//   };
//   return <button onClick={signout}>Sign Out</button>;
// };

// export default LogoutButton;