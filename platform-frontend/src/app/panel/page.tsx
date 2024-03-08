"use client";
import React, { useEffect, useState } from 'react';
import { validateAuthToken, validateRefreshToken } from '~/actions/auth';
import { DesktopNav } from '~/components/navbar';

const Panel: React.FC = () => {
  const activeNavItem = "Home";
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    async function authenticate() {
      let token = authToken;
      // Attempt to validate the current authToken if it exists
      if (token) {
        const authResponse = await validateAuthToken(token);
        if (authResponse.status === 200) {
          setLoggedIn(true);
          return;
        }
      }

      // If the authToken is not valid or doesn't exist, try to refresh it
      const refreshResponse = await validateRefreshToken();
      if (refreshResponse && refreshResponse.authToken && refreshResponse.authToken != null) {
        setAuthToken(refreshResponse.authToken);
        // Since token is reassigned from refreshResponse.authToken, it's guaranteed to be not null here
        const authResponse = await validateAuthToken(refreshResponse.authToken);
        if (authResponse.status === 200) {
          setLoggedIn(true);
          return;
        }
      } 
      setLoggedIn(false);
    }
    authenticate();
    // If the code reaches this point, authentication has failed
    const interval = setInterval(authenticate, 30000);
    
    return () =>  clearInterval(interval);
  }, [authToken]);

  
  if (loggedIn == true) {
    return (
      <DesktopNav activeItem={activeNavItem} />
    )
  }
};
export default Panel;
