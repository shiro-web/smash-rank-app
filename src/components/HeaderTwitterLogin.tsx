"use client";

import { auth } from "@/firebase";
import {
  TwitterAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import AppContext from "@/context/AppContext";
import XIcon from "@mui/icons-material/X";
import LoginIcon from "@mui/icons-material/Login";

type AdditionalUserInfo = {
  profile: {
    screen_name: string | null;
  };
};

const HeaderTwitterLogin = () => {
  const { setUserName } = useContext(AppContext);
  const router = useRouter();
  const twitterprovider = new TwitterAuthProvider();

  const twitterLogin = () => {
    signInWithPopup(auth, twitterprovider).then((result) => {
      const user = result.user;
      const additionalUserInfo: AdditionalUserInfo | null =
        getAdditionalUserInfo(result) as AdditionalUserInfo | null;
      setUserName(additionalUserInfo?.profile.screen_name ?? null);

      if (user) {
        router.push(`/mypage/${user.uid}`);
      }
    });
  };

  return (
    <div>
      <button
        onClick={twitterLogin}
        className="bg-[#0F1419] rounded-md p-2 flex gap-2 items-center text-white"
      >
        <LoginIcon fontSize="small" />
        xログイン
      </button>
    </div>
  );
};

export default HeaderTwitterLogin;
