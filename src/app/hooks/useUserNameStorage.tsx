"use client"
import AppContext from "@/context/AppContext";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";

const useUserNameStorage = () => {
  const { user, userName, setUserName } = useContext(AppContext);
  const [newUserName, setNewUserName] = useState<string | null>(() => {
    const localUserName = localStorage.getItem("userName");
    return localUserName;
  });

  // userNameが更新されるとlocalStorageに保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      onAuthStateChanged(auth, (user) => {
        if (user && userName) {
          localStorage.setItem("userName", userName!); // userNameをlocalStorageに保存
          setNewUserName(userName); // localStorageから取得したuserNameをstateにセット
        }
      });
    }
  }, []);

  return { newUserName };
};

export default useUserNameStorage;
