import React from 'react';
import classes from "./page.module.scss";
import Image from 'next/image';


const Info = () => {
  return (
    <div className={classes.container}>
        <h1 className={classes.title}>当サイトの使い方</h1>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info}>① 写真を撮る</h2>
            <p className={classes.description}>オンライン対戦時のキャラクターセレクト画面に遷移します。（以下の画像参考）Nintendo Switchのスクリーンショット機能を使って、写真を撮ります。</p>
            <Image className={classes.usageImage} src="/usage.png" alt="セレクト画面" width={675} height={380} layout='responsive'/>
            <p className={classes.exampleDescription}>上の画像のように、右下のエリアに<Image className={classes.cursor} src="/cursor.png" alt="" width={24} height={24}/> を置かないでください。（読み取れない可能性があります。）</p>
        </div>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info}>② 当サイトでX(旧Twitter)ログインをする</h2>
            <p className={classes.description}>当サイトでX(旧Twitter)ログインをします。<br />ログインをすると、自動的にマイページに飛びます。</p>
            {/* <Image className={classes.mypageImage} src="/mypage.png" alt="OK例" width={675} height={380} layout='responsive'/> */}
        </div>
        <div className={classes.infoWrapper}>
            <h2 className={classes.info}>③画像を投稿する</h2>
            <p className={classes.description}>①で撮ったスクリーンショットをマイページの「投稿する画像を選ぶ」ボタンから投稿します<br />画像を投稿すると、自動的にランキングに反映されます。</p>
        </div>
    </div>
  )
}

export default Info