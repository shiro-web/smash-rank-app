"use client";

import React from 'react';
import classes from "./Header.module.scss";
import Link from 'next/link';
import { auth } from '@/firebase';


const Header = () => {
  return (
    <div className={classes.header}>
        <div className={classes.logOut}>
            <Link href={"/"} onClick={() => {auth.signOut()}}>
                ログアウト
            </Link>
        </div>
    </div>
  )
}

export default Header