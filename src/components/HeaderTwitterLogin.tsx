"use client";

import { auth } from '@/firebase';
import {TwitterAuthProvider, getAdditionalUserInfo, signInWithPopup, signInWithRedirect} from 'firebase/auth';
import React, { useContext } from 'react';
import classes from "./HeaderTwitterLogin.module.scss";
import { useRouter } from 'next/navigation';
import AppContext from '@/context/AppContext';
import XIcon from '@mui/icons-material/X';

type AdditionalUserInfo = {
  profile: {
    screen_name: string | null;
  }
}

const HeaderTwitterLogin = () => {
  const {setUserName} = useContext(AppContext);
    const router = useRouter();
    const twitterprovider = new TwitterAuthProvider();

    const twitterLogin = () => {
        signInWithPopup(auth,twitterprovider).then((result) => {
            const user = result.user
            const additionalUserInfo: AdditionalUserInfo | null = getAdditionalUserInfo(result) as AdditionalUserInfo | null;
            setUserName(additionalUserInfo?.profile.screen_name ?? null);

            if(user){
              router.push(`/mypage/${user.uid}`)
            }
    })}

  return (
    <div className={classes.twitterLoginWrapper}>
        <button onClick={twitterLogin} className={classes.twitterLogin}><XIcon/>ログイン</button>
    </div>
  )
}

export default HeaderTwitterLogin