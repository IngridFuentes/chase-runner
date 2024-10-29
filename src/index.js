import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider }from "./context/UserContext.jsx";

ReactDOM.render(
  <UserProvider>
      <Router>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN}
          clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        > 
            <App />
        </Auth0Provider>
      </Router>,
    </UserProvider>,
    document.getElementById('root')
);
