"use client";

import classes from "./page.module.scss";
import { useContext, useEffect, useState } from "react";
import { Timestamp, collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import dayjs from 'dayjs';
import AppContext from "@/context/AppContext";
import Link from 'next/link';
import TwitterLogin from "@/conponents/TwitterLogin";

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
  const {user} = useContext(AppContext);
  const [datas,setDatas] = useState<Ranks[]>([]);

  useEffect(() => {
    console.log(user)
    const fetchRanks = async () => {
      const rankDocRef = collection(db,"ranks");
      const q = query(rankDocRef,orderBy("power","desc"));
      const unsubscribe = onSnapshot(q,(snapshot) => {
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
    {user ? (<Link href={`/mypage/${user?.uid}`}>マイページへ</Link>) : <TwitterLogin/>}
    
    <h1 className={classes.title}>世界戦闘力ランキング</h1>
    {console.log(user)}
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
              <td className={classes.bodyRank}>{index + 1}</td>
              <td className={classes.bodyUserName}>
                <div className={classes.userDisplay}>
                  <div className={classes.character}><img src={data.character}/></div>
                  <div className={classes.userName}>{data.name}</div>
                </div>  
              </td >
              <td className={classes.bodyPower}>{data.power}</td>
              <td className={classes.bodyDate}>{dayjs(data.createdAt.toDate()).format('YYYY/MM/DD')}</td>
            </tr>         
          </tbody>
        ))}
      </table>
    </main>
    </>
  );
}
