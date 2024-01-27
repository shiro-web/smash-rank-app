"use client";

import { auth } from '@/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { ReactNode, useState ,createContext, useEffect} from 'react';

type Data = {
    user:User | null;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
}

const defaultData = {
    user:null,
    setUser:() => {}
}

const AppContext = createContext<Data>(defaultData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            setUser(newUser)
        });
        return () => {
            unsubscribe();
        };
    },[])

return (
  <AppContext.Provider value={{user,setUser}}>
    {children}  
  </AppContext.Provider>
)
}



export default AppContext