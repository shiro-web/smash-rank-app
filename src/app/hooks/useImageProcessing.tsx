"use client";
import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import toast, { Toaster } from "react-hot-toast";
import localCharacters from "@/characters";

export const useImageProcessing = () => {
  let maximumPower = 100000000; // 最大世界戦闘力を1億に設定
  let minimumPower = 1000000; // 最小世界戦闘力を100万に設定
  const [url, setUrl] = useState<string | null>(null); // 画像URL
  const [newUrl, setNewUrl] = useState<string | null>(null); // クロップした画像URL
  const [newPower, setNewPower] = useState<number | null>(null); // OCRから取得したpower
  const [numDiffPixels, setNumDiffPixels] = useState<number>(0); // 画像比較の差分ピクセル数
  const [characterImage, setCharacterImage] = useState<string | null>(null); // 特定されたキャラクター画像
  const [characterName, setCharacterName] = useState<string | null>(null); // キャラクター名
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ファイル入力リファレンス
  const cropperRef = useRef<any>(null); // クロップリファレンス

  const loadImage = async (src: string | URL | Request) => {
    const response = await fetch(src); // 画像をfetch
    const arrayBuffer = await response.arrayBuffer(); // ArrayBufferに変換
    return Buffer.from(arrayBuffer); // バッファとして返す
  };

  const handleFileChange = () => {
    const fileInput = fileInputRef.current;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      // 古いURLを解放
      if (url) {
        URL.revokeObjectURL(url);
      }
      const selectedFile = fileInput.files[0]; // 選択されたファイル
      const imageUrl = URL.createObjectURL(selectedFile); // URLを生成
      setUrl(imageUrl); // URLをstateにセット
    }
  };

  // 画像からテキストを抽出（OCR処理）
  const convertImagetoText = async () => {
    const worker = await Tesseract.createWorker("eng"); // OCRワーカーを作成
    const rectangle = { left: 1000, top: 545, width: 200, height: 80 }; // 解析する領域を指定
    const {
      data: { text },
    } = await worker.recognize(url!, { rectangle });

    const power = parseInt(text.replace(/,/g, ""), 10); // 数字としてパース

    try {
      if (power > minimumPower && power < maximumPower) {
        // powerが適切な範囲かをチェック
        await worker.terminate(); // 処理終了
        setNewPower(power); // powerをstateにセット
        return power;
      } else {
        toast.error("例にならって画像を投稿してください"); // エラーメッセージ表示
        return;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  // 画像をクロップ
  const onCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.setCropBoxData({ left: 599, top: 308, width: 30, height: 30 }); // クロップ領域を設定
    const canvas = cropper?.getCroppedCanvas(); // クロップしたキャンバスを取得
    const data = canvas?.toDataURL(); // DataURLとして取得
    setNewUrl(data); // クロップしたURLをstateにセット
    return data;
  };

  const compareImages = async (userPostImage: string) => {
    for (let i = 0; i < localCharacters.length; i++) {
      const img1Data = await loadImage(`/${localCharacters[i]}`); // 画像1を読み込み
      const img2Data = await loadImage(userPostImage); // ユーザー投稿画像を読み込み

      const img1 = PNG.sync.read(img1Data); // PNG画像として読み込み
      const img2 = PNG.sync.read(img2Data); // PNG画像として読み込み

      const { width, height } = img1;
      const diff = new PNG({ width, height }); // 差分用画像を作成

      const diffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 } // 差分のしきい値を設定
      );
      setNumDiffPixels(diffPixels); // 差分ピクセル数をセット
      if (diffPixels < 1010) {
        // 差分が小さい場合、キャラクター画像を特定
        setCharacterImage(localCharacters[i]); // キャラクター画像をセット
        setCharacterName(localCharacters[i].slice(0, -4)); // キャラクター名をセット（拡張子を除去）
        return localCharacters[i].slice(0, -4); // キャラクター名を返す
      }
    }
  };

  return {
    url,
    newUrl,
    newPower,
    numDiffPixels,
    characterImage,
    characterName,
    fileInputRef,
    cropperRef,
    handleFileChange,
    convertImagetoText,
    onCrop,
    compareImages,
  };
};
