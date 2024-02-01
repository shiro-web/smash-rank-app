import React from 'react';
import classes from "./Footer.module.scss";


const Footer = () => {
  return (
    <div className={classes.footer}>
        <div className={classes.footerInner}>
            <p className={classes.footerText}><a href="https://www.smashbros.com/ja_JP/">大乱闘スマッシュブラザーズ</a>は任天堂株式会社様の登録商標です。</p>
            <p className={classes.footerText}>当サイトは個人で運営している非公式のサイトとなります。</p>
            <p className={classes.footerText}>任天堂株式会社様、他関連企業様とは一切関係ありません。</p>
        </div>
    </div>
  )
}

export default Footer