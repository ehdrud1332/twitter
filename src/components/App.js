import React, { useState, useEffect } from 'react';
import AppRouter from "components/Router";
import {authService, dbService} from "fbase";

function App() {

  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 변화가 일어날때마다 stateChange가 일어날때마다 listen 하고 있다. ex) 로그인, 로그아웃, 회원가입 등등.
    authService.onAuthStateChanged((user) => {
      if(user) {
        // user 전체 내용을 받아오는 것도 좋지만 object의 정보량이 너무 많아서 react.js가 re-render하는데 오류가 생길수도있다.
        // 그래서 받는 내용을 선언해줌으로써 re-render를 용이하게 해줌
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setUserObj(null);
      }
      setInit(true)
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    });
  };
  return (
      <>
       {init ? (
           <AppRouter
               refreshUser={refreshUser}
               isLoggedIn={Boolean(userObj)}
               userObj={userObj}
           />
           ) : (
               "Initializing"
           )}
      </>
  );
};

export default App;

