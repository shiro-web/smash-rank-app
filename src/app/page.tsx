"use client";

import classes from "./page.module.scss";
import { useContext, useEffect, useState } from "react";
import {collection, getCountFromServer, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import AppContext from "@/context/AppContext";
import RankBody from "@/components/RankBody";
import Pagenation from "@/components/Pagenation";
import { Data } from '@/types';
import Link from "next/link";
import TwitterLogin from "@/components/TwitterLogin";
import HomeIcon from '@mui/icons-material/Home';import useRank from "./hooks/useRank";
;


export default function Home({ params }: { params: { id: string } }) {
  const {user} = useContext(AppContext);
  const { itemsPerPage,datas, count, itemsOffSet, getIndex, handlePageClick } = useRank({ params }); 
  
  return (
    <div className={classes.container}>
      <div className={classes.authWrapper}>
        {user ? (<Link href={`mypage/${user?.uid}`} className={classes.auth}><HomeIcon/><span className={classes.mypage}>マイページ</span></Link>) : (<TwitterLogin/>)}
      </div>
      {user ? null : (<p className={classes.description}>Xでログインすると、世界戦闘力を登録することができます。</p>)}
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
        <RankBody currentItems={datas.slice(itemsOffSet, itemsOffSet + itemsPerPage)} getIndex={getIndex} datas={datas}/>
        </table>
          <Pagenation handlePageClick={handlePageClick} pageCount={Math.ceil(datas.length / itemsPerPage)}/>
      </main>
    </div>
  );
}
