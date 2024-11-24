import Image from "next/image";
import React from "react";

{
  /* 使い方 */
}
const HowToUse = () => {
  return (
    <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
      <h1 className="text-2xl font-bold mb-4">当サイトの使い方</h1>
      <div className="text-gray-500">
        <h2 className="text-lg font-medium text-[#333]">① 写真を撮る</h2>
        <p className="mb-2">
          オンライン対戦時のキャラクターセレクト画面に遷移します。（以下の画像参考）Nintendo
          Switchのスクリーンショット機能を使って、写真を撮ります。
        </p>
        <Image
          src="/usage.png"
          alt="セレクト画面"
          width={675}
          height={380}
          className="mb-2"
          priority
        />
        <p className="mb-2">
          上の画像のように、右下のエリアに
          <Image
            src="/cursor.png"
            alt=""
            width={24}
            height={24}
            className="inline"
            priority
          />
          を置かないでください。（読み取れない可能性があります。）
        </p>
      </div>
      <div className="text-gray-500">
        <h2 className="text-lg font-medium text-[#333]">
          ② 当サイトでX(旧Twitter)ログインをする
        </h2>
        <p className="mb-2">
          当サイトでX(旧Twitter)ログインをします。
          <br />
          ログインをすると、自動的にマイページに飛びます。
        </p>
        {/* <Image className={classes.mypageImage} src="/mypage.png" alt="OK例" width={675} height={380} layout='responsive'/> */}
      </div>
      <div className="text-gray-500">
        <h2 className="text-lg font-medium text-[#333]">③画像を投稿する</h2>
        <p className="mb-2">
          ①で撮ったスクリーンショットをマイページの「画像アップロード」ボタンから投稿します
          <br />
          画像を投稿すると、自動的にランキングに反映されます。
        </p>
      </div>
    </div>
  );
};

export default HowToUse;
