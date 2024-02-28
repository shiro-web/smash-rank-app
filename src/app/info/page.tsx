import React from 'react';
import classes from "./page.module.scss";
import Image from 'next/image';


const Info = () => {
  return (
    <div className={classes.container}>
        <h1 className={classes.title}>当サイトについて</h1>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info}>SmashRankとは</h2>
            <p className={classes.description}>SmashRankとは、大乱闘スマッシュブラザーズSPECIALのオンライン対戦における世界戦闘力を扱ったWebサービスです。<br />X（旧Twitter）ログインをすることで、ランキングに参加することができます。<br />オンライン対戦（vipマッチ）のモチベーションを上げるのにお役立てください。</p>
            <p className={classes.important}>当サイトはスマブラSP非公式のWebサービスです。</p>
        </div>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info} id='ng'>うまく画像が投稿できない</h2>
            <h3 className={classes.patern}>よくあるパターン1:スクリーンショット機能を使っていない</h3>
            <div className={classes.example}>
                <Image className={classes.exampleImage} src="/OK.png" alt="OK例" width={675} height={380} layout='responsive'/>
                <p className={classes.exampleDescription}>上の画像のように、Nintendo Switchのスクリーンショット機能を使った画像を使用します。<br />右下のエリアに<Image className={classes.cursor} src="/cursor.png" alt="" width={24} height={24}/> を置かないでください。（読み取れない可能性があります。）</p>
            </div>
            <h3 className={classes.patern}>よくあるパターン2:Xからの投稿</h3>
            <p>スマホのXから写真を保存する場合は、長押しして保存するのではなく、写真をタップして右上の…マークから保存して下さい</p>
            <p>上記を改善しても投稿できない場合、<a href="https://twitter.com/SmashRank0201">こちら</a>からお問い合わせください。</p>
        </div>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info}>お問い合わせ</h2>
            <a href="https://twitter.com/SmashRank0201">@SmashRank0201</a>
        </div>
    </div>
  )
}

export default Info