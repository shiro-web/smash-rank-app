"use client";

import React, { useContext, useEffect, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { serverTimestamp, doc, setDoc, FieldValue } from "firebase/firestore";
import { db } from "@/firebase";
import AppContext from "@/context/AppContext";
import CloudUploadIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TwitterShareButton from "@/components/TwitterShareButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  useCharakterRankData,
  useRankCalculate,
  useTotalRankData,
} from "@/app/hooks/useRankData";
import { useImageProcessing } from "@/app/hooks/useImageProcessing";
import HowToUse from "@/components/HowToUse";
import ProfileInfo from "@/components/ProfileInfo";

export type Data = {
  userName: string;
  characterName: string;
  character: string;
  createdAt: FieldValue;
  id: string;
  name: string;
  power: number;
  userImage: string;
};

const MyPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { user, userName, setDone, anonymous, setAnonymous } =
    useContext(AppContext);
  useState<number>();
  const [selectedType, setSelectedType] = useState<string>("picture");
  const { datas, characterParticipantsCount } = useCharakterRankData({
    params,
  });
  const { count } = useTotalRankData({ params });
  const {
    url,
    fileInputRef,
    cropperRef,
    handleFileChange,
    convertImagetoText,
    onCrop,
    compareImages,
  } = useImageProcessing();
  const { index, characterIndex } = useRankCalculate({ params });

  // ユーザーがログインしていない、またはユーザーIDが一致しない場合はリダイレクト
  useEffect(() => {
    if (!user || params.id !== user?.uid) {
      router.push("/"); // トップページにリダイレクト
    }
  }, [user, params.id, router]);

  // anonymous設定のトグル
  const handleChecked = (anonymous: boolean) => {
    setAnonymous(!anonymous); // anonymousの状態を反転
  };

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防止
    setDone(false); // 投稿状態をリセット
    toast.loading("投稿中です。10秒ほどお待ちください。", { id: "1" }); // ローディング表示

    try {
      const power = await convertImagetoText(); // 画像からパワーを抽出
      const croppedUrl = await onCrop(); // 画像をクロップ
      const characterName = await compareImages(croppedUrl!); // キャラクター名を比較して特定

      if (!characterName) {
        alert("適切な画像を投稿してください"); // キャラクター名が特定できない場合はエラーメッセージ
        toast.error("投稿に失敗しました。", { id: "1" });
      }

      // 投稿が成功した場合、Firestoreにデータを送信
      if (
        user &&
        power &&
        croppedUrl &&
        user.displayName &&
        user.photoURL &&
        characterName &&
        userName
      ) {
        const docRef = doc(db, "ranks", user.uid); // ユーザー用のドキュメント参照
        const datas: Data = {
          userName: anonymous ? "anonymous" : userName, // 匿名か通常名を決定
          characterName: anonymous ? "anonymous" : characterName, // キャラクター名
          character: anonymous ? "anonymous" : croppedUrl, // クロップした画像
          createdAt: serverTimestamp(), // 作成日時
          id: user.uid, // ユーザーID
          name: anonymous ? "anonymous" : user.displayName, // ユーザー名
          power: power, // パワー
          userImage: anonymous ? "anonymous" : user.photoURL, // ユーザー画像
        };
        await setDoc(docRef, datas); // Firestoreにデータをセット
        toast.success("投稿に成功しました", { id: "1" }); // 成功メッセージ
      }
    } catch (error) {
    } finally {
      setDone(true); // 投稿処理終了
    }
  };

  return (
    <>
      <Toaster />
      <Cropper
        src={url ? url : ""}
        style={{ height: 400, width: 900 }}
        ref={cropperRef}
        className="absolute top-[-10000px] "
      />

      {/* 一回以上画像を投稿したことのあるユーザー向けのUIと、
      一回も画像を投稿したことのないユーザー向けのUIの出し分け */}
      {datas.length > 0 && datas[0]?.power ? (
        <div className="flex flex-col items-center p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
          {/* <!-- プロフィールセクション --> */}
          {user && <ProfileInfo />}

          {/* <!-- ランキングセクション --> */}
          <div className="w-full max-w-md border-gray-300 border-[1px] shadow-sm rounded-lg p-6 mb-4">
            {datas.length > 0 ? (
              <>
                <div className="flex gap-4 items-center">
                  <Link href={`/fighter/${datas[0].characterName}`}>
                    <Image
                      src={
                        datas[0].character == "anonymous"
                          ? "/Anonymous.png"
                          : datas[0].character
                      }
                      width={46}
                      height={46}
                      alt="使用キャラクター"
                      className="rounded-md"
                    />
                  </Link>
                  <div>
                    <p className="text-sm text-gray-400">キャラ内順位</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      {characterIndex}位
                      <span className="text-sm text-gray-400">
                        /{characterParticipantsCount}人中
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <Link
                    href={"/fighters"}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full mt-4"
                  >
                    <p className="">キャラごとのランキング</p>
                    <Image
                      src="/crown-icon.png"
                      width={16}
                      height={111}
                      alt=""
                    />
                  </Link>
                </div>
              </>
            ) : null}
          </div>

          {/* <!-- タブセクション --> */}
          <div className="w-full max-w-md mb-2">
            <div className="h-10 group items-center justify-center rounded-md bg-gray-100 p-1 grid w-full grid-cols-2">
              <button
                onClick={() => setSelectedType("picture")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                  selectedType === "picture" ? "bg-white" : "bg-none"
                } `}
              >
                画像アップロード
              </button>
              <button
                onClick={() => setSelectedType("status")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                  selectedType === "status" ? "bg-white" : "bg-none"
                } `}
              >
                ステータス
              </button>
            </div>
          </div>

          {/* <!-- 画像アップロードセクション --> */}
          {selectedType === "picture" ? (
            <form
              action=""
              onSubmit={handleSubmit}
              className="border-[1px] mb-4 border-gray-300 p-6 rounded-md w-full"
            >
              <div className=" mb-4 flex items-center justify-center gap-2">
                <CloudUploadIcon />
                <p className="text-2xl font-bold">ランキングに参加する</p>
              </div>
              <div className="mb-3 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  disabled={false}
                  onChange={(e) => handleChecked(anonymous)}
                  className=""
                />
                <label htmlFor="anonymous">匿名を希望します</label>
              </div>
              <label
                htmlFor="fileUpload"
                className="bg-black w-full mb-2 text-center py-3 px-4 block text-white rounded-md cursor-pointer"
              >
                画像アップロード
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".png, .jpeg, .jpg"
                  className="hidden"
                />
              </label>
              <div>
                {/* <p>チェックを入れた状態で画像を投稿すると、匿名でランキングに参加することができます。</p> */}
              </div>
              {url ? (
                <Image
                  src={url ? url : ""}
                  alt=""
                  width={675}
                  height={380}
                  ref={cropperRef}
                  className="mt-4"
                />
              ) : null}
              <Link
                href={"/info"}
                className="flex justify-end gap-1 items-center text-gray-500"
              >
                <HelpOutlineIcon className="w-4 h-4" />
                <p className="text-xs">画像が投稿できないとき</p>
              </Link>
              {url ? (
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-3 text-white mx-auto w-full mt-4 rounded-md"
                >
                  送信する
                </button>
              ) : null}
            </form>
          ) : (
            <>
              <div className="border-[1px] mb-4 border-gray-300 p-6 pb-3 rounded-md w-full">
                <div className="border-b-[1px] border-gray-300 pb-4">
                  <div className="flex gap-2 justify-between mb-2">
                    <p>全体順位</p>
                    <p className="font-bold">
                      <span>{index}位</span>/{count}人中
                    </p>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <p>世界戦闘力</p>
                    <p className="font-bold">
                      {datas[0]?.power.toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* <!-- ポストボタン --> */}
                <div className="w-full max-w-md mt-1">
                  <p className="text-center mb-1 text-xs">シェアする</p>
                  <div className="flex justify-center">
                    <TwitterShareButton index={index} count={count} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 使い方 */}
          <HowToUse />
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
          <div className="border-[1px] mb-4 border-gray-300 p-6 rounded-md w-full">
            <Image
              src="/first-time.png"
              width={300}
              height={300}
              alt="使用キャラクター"
              className="mx-auto"
              priority
            />
            <p className="text-2xl mb-1 text-center">はじめまして！</p>
            <p className="text-center mb-4">
              画像を投稿して、ランキングに参加しましょう！
            </p>
            <form action="" onSubmit={handleSubmit}>
              <div className="mb-3 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  disabled={false}
                  onChange={(e) => handleChecked(anonymous)}
                  className=""
                />
                <label htmlFor="anonymous">匿名を希望します</label>
              </div>
              <label
                htmlFor="fileUpload"
                className="bg-black w-full mb-2 text-center py-3 px-4 block text-white rounded-md cursor-pointer"
              >
                画像アップロード
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".png, .jpeg, .jpg"
                  className="hidden"
                />
              </label>
              {url ? (
                <Image
                  src={url ? url : ""}
                  alt=""
                  width={675}
                  height={380}
                  ref={cropperRef}
                  className="mt-4"
                />
              ) : null}
              <Link
                href={"/info"}
                className="flex justify-end gap-1 items-center text-gray-500"
              >
                <HelpOutlineIcon className="w-4 h-4" />
                <p className="text-xs">画像が投稿できないとき</p>
              </Link>
              {url ? (
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-3 text-white mx-auto w-full mt-4 rounded-md"
                >
                  送信する
                </button>
              ) : null}
            </form>
          </div>

          {/* 使い方 */}
          <HowToUse />
        </div>
      )}
    </>
  );
};

export default MyPage;
