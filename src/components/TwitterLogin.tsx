import React from "react";
import useTwitterLogin from "./hooks/TwitterLogin.ts/page";

const TwitterLogin = () => {

  const {twitterLogin} = useTwitterLogin();
  
  return (
    <div>
      <button onClick={() => twitterLogin()}>Xでログイン</button>
    </div>
  );
};

export default TwitterLogin;
