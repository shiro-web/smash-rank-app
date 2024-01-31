"use client";

import classes from "./page.module.scss";
import { useContext, useEffect, useState } from "react";
import { Timestamp, collection, doc, getCountFromServer, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import AppContext from "@/context/AppContext";
import RankBody from "@/components/RankBody";
import Pagenation from "@/components/Pagenation";
import { Data } from '@/types';



export default function Home() {
  const {user} = useContext(AppContext);
  const [datas,setDatas] = useState<Data[]>([]);
  const [count,setCount] = useState<Data[]>([]);
  const itemsPerPage = 50;
  const[itemsOffSet,setItemsOffSet] = useState<number>(0);
  const endOffset = itemsOffSet + itemsPerPage;
  const currentItems = datas.slice(itemsOffSet,endOffset)
  const pageCount = Math.ceil(datas.length / itemsPerPage)

  useEffect(() => {
    const fetchRanks = async () => {
      const rankDocRef = collection(db,"ranks");
      const q = query(rankDocRef,orderBy("power","desc"));
      const rankCount = await getCountFromServer(rankDocRef);
      const newCount = rankCount.data().count;
      setCount(newCount)
      const unsubscribe = onSnapshot(q,(snapshot) => {
        const newRank = snapshot.docs.map((doc) => doc.data() as Data)
        setDatas(newRank);
      });
      return() => {
        unsubscribe();
    };
    };
    fetchRanks()
  },[])

  function getIndex(value:number, arr:Data[]) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].power === value) {
            return datas.indexOf(arr[i]);
        }
    }
    return undefined; //値が存在しなかったとき
}

const handlePageClick = (event: { selected: number; }) => {
  const newOffset = (event.selected * itemsPerPage) % datas.length;
  setItemsOffSet(newOffset);
};

  return (
    <>
    <h1 className={classes.title}>世界戦闘力ランキング</h1>
    <p className={classes.count}>総ユーザー数:{count}</p>
    <main className={classes.main}>
      <table className={classes.rankTable}>
        <thead className={classes.rankTableHead}>
          <tr className={classes.headRow}>
            <th className={classes.headRank}>順位</th>
            <th className={classes.headUserName}>ユーザー名</th>
            <th className={classes.headPower}>世界戦闘力</th>
            <th className={classes.headDate}>日付</th>
          </tr>
        </thead>
       <RankBody currentItems={currentItems} getIndex={getIndex} datas={datas}/>
      </table>
        <Pagenation handlePageClick={handlePageClick} pageCount={pageCount}/>
    </main>
    </>
  );
}
