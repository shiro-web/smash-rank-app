"use client";

import React, { useContext, useState } from 'react';
import classes from "./Header.module.scss";
import Link from 'next/link';
import { auth } from '@/firebase';
import AppContext from '@/context/AppContext';
import HeaderTwitterLogin from './HeaderTwitterLogin';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const {user} = useContext(AppContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalStyle:ReactModal.Styles = {
    overlay: {
      zIndex:"100000",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "transparent"
    },

  };

  return (
    <div className={classes.header}>
      <div className={classes.headerInner}>
        <div className={classes.logoWrapper}>
          <Link href={'/'}><img src="logo.png" className={classes.logo} alt="" /></Link>
        </div>
        <div className={classes.auth}>{user ? ( <Link href={"/"} onClick={() => {auth.signOut()}} className={classes.logOut}>ログアウト</Link>) : (<HeaderTwitterLogin/>)}</div>
      </div>
      <div className={classes.links}>
        <div className={classes.linksInner}>
          <Link className={classes.usage}  href={"/usage"}>
            <CheckCircleIcon className={classes.usageIcon}/>
            <p className={classes.usageText}>使い方</p> 
          </Link>
          {user && 
            (
            <Link className={classes.mypage} href={`/mypage/${user?.uid}`} >
              <AccountCircleIcon className={classes.mypageIcon}/>
              <p className={classes.mypageText}>マイページ</p>
            </Link>
            )
          }
          <Link className={classes.top}  href={"/"}>
            <HomeIcon className={classes.topIcon}/>
            <p className={classes.topText}>サイトトップ</p>
          </Link>
          <Link className={classes.info}  href={"/info"}>
            <InfoIcon className={classes.infoIcon}/>
            <p className={classes.infoText}>サイトについて</p>
          </Link>
          <Link className={classes.form} href={"/form"}>
            <EmailIcon className={classes.formIcon}/>
            <p className={classes.formText}>お問い合わせ</p>
          </Link>
          <Link className={classes.policy}  href={"/policy"}>
            <DescriptionIcon className={classes.policyIcon}/>
            <p className={classes.policyText}>利用規約</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header