"use client";

import React, { useContext, useState } from 'react';
import classes from "./Header.module.scss";
import Link from 'next/link';
import { auth } from '@/firebase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Modal from 'react-modal';
import AppContext from '@/context/AppContext';
import HeaderTwitterLogin from './HeaderTwitterLogin';


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
        {/* <h1>スマッシュランク</h1> */}
        <div className={classes.headerimg}>
           <div className={classes.userIcon} onClick={() => {setModalIsOpen(true)}}><AccountCircleIcon sx={{ fontSize: 40 }}/></div>
        </div>
        <Modal style={modalStyle} className={classes.modal} isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} >
          <div className={classes.headerLinks}>
            <Link className={classes.info}  href={"/info"} onClick={() => {setModalIsOpen(false)}}>サイトについて</Link>
            <Link className={classes.mypage} href={`/mypage/${user?.uid}`} onClick={() => {setModalIsOpen(false)}}>{user && "マイページ"}</Link>
            <div className={classes.auth} onClick={() => {setModalIsOpen(false)}}>{user ? ( <Link href={"/"} onClick={() => {auth.signOut()}} className={classes.logOut}>ログアウト</Link>) : (<HeaderTwitterLogin/>)}</div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Header