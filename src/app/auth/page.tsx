"use client";

import TwitterLogin from '@/conponents/TwitterLogin';
import { auth } from '@/firebase';
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';

const page = () => {

  return (
    <div>
        <button onClick={googleLogin}>Googleログイン</button>
        <TwitterLogin/>
    </div>
  )
}

export default page