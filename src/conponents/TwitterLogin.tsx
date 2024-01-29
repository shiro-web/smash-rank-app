"use client";

import { auth } from '@/firebase';
import {TwitterAuthProvider, signInWithPopup} from 'firebase/auth';
import React from 'react';

const TwitterLogin = () => {
    const twitterprovider = new TwitterAuthProvider();

    const twitterLogin = () => {
        signInWithPopup(auth,twitterprovider).then((result) => {
            const user = result.user
            console.log(user)
    })}

  return (
    <div>
        <button onClick={twitterLogin}>Twitterログイン</button>
    </div>
  )
}

export default TwitterLogin