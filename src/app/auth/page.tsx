"use client";

import { auth } from '@/firebase';
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';

const page = () => {
    const googleprovider = new GoogleAuthProvider;
    const twitterprovider = new TwitterAuthProvider();

    const googleLogin = () => {
        signInWithPopup(auth,googleprovider).then((result) => {
        const user = result.user
        console.log(user)
    })}

    const twitterLogin = () => {
        signInWithPopup(auth,twitterprovider).then((result) => {
            const user = result.user
            console.log(user)
    })}

  return (
    <div>
        <button onClick={googleLogin}>Googleログイン</button>
        <button onClick={twitterLogin}>Twitterログイン</button>
    </div>
  )
}

export default page