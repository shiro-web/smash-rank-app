"use client";

import Image from "next/image";
import classes from "./page.module.scss";
import { useEffect, useState } from "react";
import { Timestamp, collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import dayjs from 'dayjs';

type RankProps = {
  id:string;
  rank:number;
  name:string;
  power:number;
  createdAt:Timestamp;
}

type Ranks = {
  id:string;
  name:string;
  power:number;
  userImage:string;
  character:string;
  createdAt:Timestamp;
}

export default function Home() {
  const [datas,setDatas] = useState<Ranks[]>([]);
  useEffect(() => {
    const fetchRanks = async () => {
      const rankDocRef = collection(db,"ranks");
      // const q = query(rankDocRef,orderBy("power"));
      const unsubscribe = onSnapshot(rankDocRef,(snapshot) => {
        const newRank = snapshot.docs.map((doc) => doc.data() as Ranks)
        setDatas(newRank);
      });
      return() => {
        unsubscribe();
    };
    };
    fetchRanks()
  },[])
  
  return (
    <>
    {    console.log(datas)}
    <button >ログイン</button>
    <button >ログアウト</button>
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
        {datas.map((data,index) => (
          <tbody key={index} className={classes.rankTableBody}>
            <tr className={classes.bodyRow}>
              <td className={classes.bodyRank}>1</td>
              <td className={classes.bodyUserName}>
                <div className={classes.userDisplay}>
                  <div className={classes.character}><img src="/test.png"/></div>
                  <div className={classes.userName}>{data.name}</div>
                </div>  
              </td >
              <td className={classes.bodyPower}>{data.power}</td>
              <td className={classes.bodyDate}>{dayjs(data.createdAt.toDate()).format('YYYY年MM月DD日hh:mm')}</td>
            </tr>         
          </tbody>
        ))}
      </table>
    </main>
    </>
  );
}
