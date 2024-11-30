import React from "react";
import Image from "next/image";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import XIcon from "@mui/icons-material/X";

const Info = () => {
  return (
    <div className="flex flex-col text-[#333] p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
      <h1 className="text-2xl font-bold mb-4">当サイトについて</h1>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="text-xl mb-2 font-bold">SmashRankとは</h2>
        <p className="mb-2">
          SmashRankとは、大乱闘スマッシュブラザーズSPECIALのオンライン対戦における世界戦闘力を扱ったWebサービスです。
          <br />
          X（旧Twitter）ログインをすることで、ランキングに参加することができます。
          <br />
          オンライン対戦（vipマッチ）のモチベーションを上げるのにお役立てください。
        </p>
        <div className="border-[1px] text-sm border-gray-300 px-3 py-2 rounded-md">
          <div className="flex gap-1 items-center mb-1">
            <WarningAmberIcon fontSize="small" />
            <p>注意</p>
          </div>
          <p>当サイトはスマブラSP非公式のWebサービスです。</p>
        </div>
      </div>
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <h2 className="text-xl mb-2 font-bold">うまく画像が投稿できない</h2>
        <div className="border-b-[1px] border-gray-300 mb-4 pb-4">
          <h3 className="mb-2 font-bold">
            よくあるパターン1:スクリーンショット機能を使っていない
          </h3>
          <div className="mb-2">
            <Image
              src="/OK.png"
              alt="OK例"
              width={675}
              height={380}
              layout="responsive"
              className="mb-2"
            />
            <p className="text-sm">
              上の画像のように、Nintendo
              Switchのスクリーンショット機能を使った画像を使用します。
              <br />
              右下のエリアに
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
        </div>
        <div className="border-b-[1px] border-gray-300 mb-4 pb-4">
          <h3 className="mb-2 font-bold">よくあるパターン2:Xからの投稿</h3>
          <p className="text-sm">
            スマホのXから写真を保存する場合は、長押しして保存するのではなく、写真をタップして右上の…マークから保存して下さい
          </p>
        </div>
        <div className="border-b-[1px] border-gray-300 mb-4 pb-4">
          <h3 className="mb-2 font-bold">
            よくあるパターン3:キャッシュがたまっている
          </h3>
          <p className="text-sm">
            キャッシュを削除してからもう一度お試しください。
          </p>
        </div>
        <p>
          上記を改善しても投稿できない場合、
          <a href="https://twitter.com/SmashRank0201" className="underline">
            こちら
            <OpenInNewIcon className="inline" fontSize="small" />
          </a>
          からお問い合わせください。
        </p>
      </div>
      <div className="border-[1px] text-sm border-gray-300 px-3 py-2 rounded-md">
        <h2 className="text-xl mb-2 font-bold">お問い合わせ</h2>
        <div className="flex items-center gap-1">
          <XIcon fontSize="small" />
          <a
            href="https://twitter.com/SmashRank0201"
            className="text-base underline"
          >
            @SmashRank0201
          </a>
        </div>
      </div>
    </div>
  );
};

export default Info;
