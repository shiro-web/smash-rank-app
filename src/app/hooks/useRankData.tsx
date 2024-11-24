"use client";

import AppContext from "@/context/AppContext";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Data } from "../mypage/[id]/page";
import { useRouter } from "next/navigation";

export const useCharakterRankData = ({
  params,
}: {
  params: { id: string };
}) => {
  const router = useRouter();
  const { user, done } = useContext(AppContext);
  const [datas, setDatas] = useState<Data[]>([]);
  const [characterParticipantsCount, setCharacterParticipantsCount] =
    useState<number>();
  const [characterList, setCharacterList] = useState<Data[]>([]);

  // キャラクターごとのランキングを取得して監視
  useEffect(() => {
    const fetchCharakterRanks = async () => {
      try {
        const rankDocRef = doc(db, "ranks", params.id);
        const rankData = await getDoc(rankDocRef);
        if (rankData.exists()) {
          const rankCollectionRef = collection(db, "ranks");
          const q = query(
            rankCollectionRef,
            where("characterName", "==", rankData.data()?.characterName),
            orderBy("power", "desc")
          );
          const rankCount = await getCountFromServer(q); // ランキングの数を取得
          setDatas([rankData.data() as Data]);
          const newCount = rankCount.data().count;
          setCharacterParticipantsCount(newCount); // そのキャラクターで参加している人の総数（分母）

          // ランキングデータをリアルタイムで監視
          onSnapshot(q, (snapshot) => {
            const newCharacterRank = snapshot.docs.map(
              (doc) => doc.data() as Data
            );
            setCharacterList(newCharacterRank); // そのキャラクターで参加している人のデータをリストにしたもの。そのキャラクターで参加している人の総数の数がある。
          });
        }
      } catch (error) {
        console.error("Error fetching ranks:", error); // エラーハンドリング
      }
    };

    fetchCharakterRanks();
  }, [done, params.id, router, user]);
  return {
    datas,
    setDatas,
    characterParticipantsCount,
    setCharacterParticipantsCount,
    characterList,
    setCharacterList,
  };
};

export const useTotalRankData = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [list, setList] = useState<Data[]>([]);
  const { user, done } = useContext(AppContext);
  useState<number>();

  // 全体ランキングを取得して監視
  useEffect(() => {
    const fetchRanks = async () => {
      const rankCollectionRef = collection(db, "ranks");
      const q = query(rankCollectionRef, orderBy("power", "desc"));
      const rankCount = await getCountFromServer(rankCollectionRef);
      setCount(rankCount.data().count); // ランキングの総数をセット

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRank = snapshot.docs.map((doc) => doc.data() as Data);
        setList(newRank); // リアルタイムで全体ランキングリストを更新
      });

      return () => {
        unsubscribe(); // クリーンアップ: リスナーの解除
      };
    };
    fetchRanks();
  }, [done, params.id, router, user]);

  return { count, setCount, list, setList };
};

export const useRankCalculate = ({ params }: { params: { id: string } }) => {
  const { datas, characterList } = useCharakterRankData({ params });
  const { list } = useTotalRankData({ params });

  // ランキングデータ内で指定されたpowerのインデックスを取得
  const getIndex = (value: number, arr: Data[]) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].power === value) {
        return arr.indexOf(arr[i]); // 一致したデータのインデックスを返す
      }
    }
    return -1; // 値が存在しなかったとき
  };

  // ランキングの位置と順位の計算
  const index = datas.length > 0 ? getIndex(datas[0]?.power, list) + 1 : -1;
  // const topNumber = count > 0 ? Math.floor((index / count) * 1000) / 10 : 0; // トップ順位の計算
  const characterIndex =
    datas.length > 0 ? getIndex(datas[0]?.power, characterList) + 1 : -1;

  return { index, characterIndex };
};
