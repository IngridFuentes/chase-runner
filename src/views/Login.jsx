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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data, "data login")
      localStorage.setItem('token', data.token);
      // Redirect to dashboard or perform any other action on successful login
    } catch (error) {
      console.error('Login error:', error);
    }
    navigate('/profile');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
