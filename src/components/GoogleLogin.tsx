"use client";

import { auth } from '@/firebase';
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import React from 'react';

const GoogleLogin = () => {
    const googleprovider = new GoogleAuthProvider;

    const googleLogin = () => {
        signInWithPopup(auth,googleprovider).then((result) => {
        const user = result.user
        console.log(user)
    })}

  return (
    <div>
        <button onClick={googleLogin}>Googleログイン</button>
    </div>
  )
}

export default GoogleLogin