"use client";
import React, { useEffect, useState } from 'react';
import { validateToken } from '~/actions/auth'; 
const Panel: React.FC = () => {
  const [loggedIn, setLogin] = useState(false);
  const [authToken, setAuthToken] = useState(null);
    useEffect(() => {
    async function checkToken() {
      const ret = await validateToken(authToken);
      if (ret && ret.status == 200) {
        setLogin(true);
        setAuthToken(ret.authToken);
      } else {
        setLogin(false);
      }
    }
    checkToken()
    const interval = setInterval(() => {
      checkToken()
    }, 30000);
    
    return () =>  clearInterval(interval);
  }, [authToken]);
  if (loggedIn == true) {
    return ( <p>{authToken}</p> );
  }
};
export default Panel;
