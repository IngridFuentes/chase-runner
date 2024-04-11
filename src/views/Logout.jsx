// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Logout = ({ onLogout }) => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); 

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       // Make a POST request to your backend /logout endpoint to initiate logout with Passage
//       const response = await fetch('http://localhost:3000/logout', {
//         method: 'POST',
//         credentials: 'include', // Include cookies in the request
//       });
//       if (response.ok) {
//         // Call the onLogout callback passed from the parent component to indicate successful logout
//         onLogout();
//         navigate('/login');
//       } else {
//         // Handle logout failure
//         alert('Logout failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred during logout');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <button onClick={handleLogout} disabled={loading}>
//         {loading ? 'Logging out...' : 'Logout'}
//       </button>
//     </div>
//   );
// };

// export default Logout;

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

export default Logout;