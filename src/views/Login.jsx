// import styles from '../styles/Login.module.css';
// import { Link } from "react-router-dom";

// const Login = () => {

//    return (
//         <div>
//            <img
//             loading="lazy"
//             src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/hasini-dibf1m/assets/1bew6og46zuv/chaserunner.jpg"
//             className="aspect-[0.86] object-contain object-center w-full fill-[url(<path-to-image>),lightgray_0px_81.565px_/_100%_91.066%_no-repeat] overflow-hidden max-w-[782px]"
//             style={{
//                 display: 'block',
//                 margin:'auto',
//                 width: '700px',
//                 height: '700px'
//             }}
//             alt=''/>          
//            <button className={styles.buttonLogin}> 
//                 <Link to="/login" className={styles.link}> Log in </Link> 
//             </button>

//         </div>
//      );
//  }
//  export default Login;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from '../styles/Login.module.css';
// import { Link } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { loginWithRedirect, user, isLoading, logout} = useAuth0();

//   const handleSubmit = async (e) => {
//     console.log(user, 'user')
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//       const data = await response.json();
//       console.log(data, "data login")
//       const { userId, status } = data;
//       if (status === 'Success' && userId) {
//         localStorage.setItem('userId', userId); // Store the userId in localStorage
//         navigate('/map'); // Redirect to the profile page or any other page
//       } else {
//         throw new Error('Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
    
//     <div className={styles.formContainer}>
//         <div className={styles.formHeader}>
//         <h2>Login</h2>
//     </div>
//       <form onSubmit={handleSubmit} className={styles.loginForm}>
//       <div className={styles.formGroup}>
//           <label htmlFor="email">Email</label>
//           <input
//             type="text"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {!isLoading && !user && (
//         <button type="submit" className={styles.formBtn} onClick={() => loginWithRedirect()}>Login</button>
//         )}
//         {!isLoading && user && (
//         <button type="submit" className={styles.formBtn} onClick={() => logout()}>Logout</button>
//         )}
//       </form>
//       <br/>
//       <p className={styles.createAccount}>Don't have an account yet?
//       </p>
//       <br />
//       <p className={styles.createAccountLink}> <Link to='/signup'> Create an account </Link> </p>
//     </div>
//   );
// };

// export default Login;

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styles from '../styles/Login.module.css';
import { useState } from "react";

const Login = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout} = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(user, 'user')

  const handleLogin = async () => {
    // try {
    //         const response = await fetch('http://localhost:3000/login', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({ email, password }),
    //         });
      
    //         if (!response.ok) {
    //           throw new Error('Login failed');
    //         }
      
    //         const data = await response.json();
    //         console.log(data, 'data')
    //       }catch (error) {
    //                 console.error('Login error:', error);
    //         }

    await loginWithRedirect({
      appState: {
        returnTo: "/map",
      },
    });
  };

  return (
    <>
    { !isAuthenticated && (
      <button className={styles.link} onClick={handleLogin}>
      Log In
      </button>
    )}
      { !isLoading && isAuthenticated && (
        <button className="buttonLogout" onClick={() => logout()}>
        Logout
        </button>
      )}
    </>
  );
};
export default Login;