import React, { useState, useEffect } from 'react';
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // 변화가 일어날때마다 stateChange가 일어날때마다 listen 하고 있다. ex) 로그인, 로그아웃, 회원가입 등등.
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false)
      }
      setInit(true)
    })
  }, [])


  return (
      <>
       {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing"}
      </>
  );
}

export default App;

