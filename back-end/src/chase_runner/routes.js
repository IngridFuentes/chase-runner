// const { Router } = require('express');
// const router = Router();
// const controller = require('./controller');
// // const { auth0Login, auth0Signup, auth0Logout } = require('./authService');


// router.get('/', controller.getMarkers);
// router.post('/', controller.addMarker);
// module.exports = router;

// const login = async (req, res) => {
//     try {
//       const token = await auth0Login(req.body);
//       res.json({ token });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  
//   const signup = async (req, res) => {
//     try {
//       const token = await auth0Signup(req.body);
//       res.json({ token });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  
//   const logout = async (req, res) => {
//     try {
//       await auth0Logout(req.body.token);
//       res.json({ message: 'Logged out successfully' });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };
  
//   module.exports = { login, signup, logout };