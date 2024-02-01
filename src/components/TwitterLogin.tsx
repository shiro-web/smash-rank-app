"use client";

import { auth } from '@/firebase';
import {TwitterAuthProvider, signInWithPopup, signInWithRedirect} from 'firebase/auth';
import React from 'react';
import classes from "./TwitterLogin.module.scss";
import { useRouter } from 'next/navigation';


const TwitterLogin = () => {
    const router = useRouter();
    const twitterprovider = new TwitterAuthProvider();

    const twitterLogin = () => {
        signInWithPopup(auth,twitterprovider).then((result) => {
            const user = result.user
            if(user){
              router.push(`/mypage/${user.uid}`)
            }
    })}

  return (
    <div className={classes.twitterLoginWrapper}>
        {/* <button onClick={twitterLogin} className={classes.twitterLogin}>Xでログイン</button> */}
    </div>
  )
}

export default TwitterLogin