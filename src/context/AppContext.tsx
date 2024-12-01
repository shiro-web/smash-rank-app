"use client";

import { auth } from "@/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useState, createContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

type Data = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  done: boolean;
  setDone: React.Dispatch<React.SetStateAction<boolean>>;
  anonymous: boolean;
  setAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultData = {
  user: null,
  setUser: () => {},
  userName: null,
  setUserName: () => {},
  done: false,
  setDone: () => {},
  anonymous: false,
  setAnonymous: () => {},
};

const AppContext = createContext<Data>(defaultData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const [anonymous, setAnonymous] = useState<boolean>(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // userNameが変更されたらlocalStorageに保存
  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        userName,
        setUserName,
        done,
        setDone,
        anonymous,
        setAnonymous,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
