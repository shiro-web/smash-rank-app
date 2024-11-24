import AppContext from "@/context/AppContext";
import { auth } from "@/firebase";
import {
  TwitterAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
} from "firebase/auth";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

type AdditionalUserInfo = {
  profile: {
    screen_name: string | null;
  };
};

const useTwitterLogin = () => {
  const { userName, setUserName } = useContext(AppContext);
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

  return { twitterLogin };
};

export default useTwitterLogin;
