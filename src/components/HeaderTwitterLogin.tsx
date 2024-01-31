"use client";

import { auth } from '@/firebase';
import {TwitterAuthProvider, signInWithPopup} from 'firebase/auth';
import React from 'react';
import classes from "./HeaderTwitterLogin.module.scss";
import { useRouter } from 'next/navigation';


const HeaderTwitterLogin = () => {
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
        <button onClick={twitterLogin} className={classes.twitterLogin}>Xログイン</button>
    </div>
  )
}

export default HeaderTwitterLogin