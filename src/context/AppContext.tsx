"use client";

import { auth } from '@/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { ReactNode, useState ,createContext, useEffect} from 'react';
import toast, { Toaster } from 'react-hot-toast'

type Data = {
    user:User | null;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
    userName:string | null;
    setUserName:React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultData = {
    user:null,
    setUser:() => {},
    userName:null,
    setUserName:() => {},
}

const AppContext = createContext<Data>(defaultData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser] = useState<User | null>(null);
    const [userName,setUserName] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            setUser(newUser);

        
        });
        return () => {
            unsubscribe();
        };
    },[])

return (
  <AppContext.Provider value={{user,setUser,userName,setUserName}}>
    {children}  
  </AppContext.Provider>
)
}



export default AppContext