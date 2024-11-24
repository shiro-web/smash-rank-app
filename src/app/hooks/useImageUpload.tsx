// "use client";
// import AppContext from "@/context/AppContext";
// import React, { useContext } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useImageProcessing } from "./useImageProcessing";
// import useUserNameStorage from "./useUserNameStorage";
// import { Data } from "../mypage/[id]/page";
// import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "@/firebase";

// const useImageUpload = () => {
//   const { user, setDone, anonymous, setAnonymous } = useContext(AppContext);
//   const { convertImagetoText, onCrop, compareImages } = useImageProcessing();
//   const { newUserName } = useUserNameStorage();

//   const handleAnonymousChecked = (anonymous: boolean) => {
//     setAnonymous(!anonymous); // anonymousの状態を反転
//   };

//   // フォーム送信時の処理
//   const handleImageUpload = async (e: React.FormEvent) => {
//     e.preventDefault(); // デフォルトのフォーム送信を防止
//     setDone(false); // 投稿状態をリセット
//     toast.loading("投稿中です。10秒ほどお待ちください。", { id: "1" }); // ローディング表示
//     try {
//       const power = await convertImagetoText(); // 画像からパワーを抽出
//       const croppedUrl = await onCrop(); // 画像をクロップ
//       const characterName = await compareImages(croppedUrl!); // キャラクター名を比較して特定

//       if (!characterName) {
//         alert("適切な画像を投稿してください"); // キャラクター名が特定できない場合はエラーメッセージ
//         toast.error("投稿に失敗しました。", { id: "1" });
//       }

//       // 投稿が成功した場合、Firestoreにデータを送信
//       if (
//         user &&
//         power &&
//         croppedUrl &&
//         user.displayName &&
//         user.photoURL &&
//         characterName &&
//         newUserName
//       ) {
//         const docRef = doc(db, "ranks", user.uid); // ユーザー用のドキュメント参照
//         const datas: Data = {
//           userName: anonymous ? "anonymous" : newUserName, // 匿名か通常名を決定
//           characterName: anonymous ? "anonymous" : characterName, // キャラクター名
//           character: anonymous ? "anonymous" : croppedUrl, // クロップした画像
//           createdAt: serverTimestamp(), // 作成日時
//           id: user.uid, // ユーザーID
//           name: anonymous ? "anonymous" : user.displayName, // ユーザー名
//           power: power, // パワー
//           userImage: anonymous ? "anonymous" : user.photoURL, // ユーザー画像
//         };
//         await setDoc(docRef, datas); // Firestoreにデータをセット
//         toast.success("投稿に成功しました", { id: "1" }); // 成功メッセージ
//       }
//     } catch (error) {
//       console.error("エラー:", error); // エラーハンドリング
//     } finally {
//       setDone(true); // 投稿処理終了
//     }
//   };

//   return { handleAnonymousChecked, handleImageUpload };
// };

// export default useImageUpload;
