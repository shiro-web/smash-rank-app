"use client";

import classes from "./page.module.scss";
import { useContext} from "react";
import AppContext from "@/context/AppContext";
import RankBody from "@/components/RankBody";
import Pagenation from "@/components/Pagenation";
import useRank from "./hooks/useRank";
import Link from "next/link";
import { AdMax } from "@/components/AdMax";

export default function Home({ params }: { params: { id: string } }) {
  const {user} = useContext(AppContext);
  const { itemsPerPage,datas, count, itemsOffSet, getIndex, handlePageClick } = useRank({ params }); 
  
  return (
    <div className={classes.container}>
      {/* <div className={classes.authWrapper}>
        {user ? (<Link href={`mypage/${user?.uid}`} className={classes.auth}><HomeIcon/><span className={classes.mypage}>マイページ</span></Link>) : (<TwitterLogin/>)}
      </div>
      {user ? null : (<p className={classes.description}>Xでログインすると、世界戦闘力を登録することができます。</p>)} */}
      {/* <h1 className={classes.title}>世界戦闘力ランキング</h1> */}
    
      <p className={classes.count}>総ユーザー数:{count}</p>
        <div className={classes.infoWrapper}>
            <h1 className={classes.title}>当サイトについて</h1>
            <p className={classes.important}>当サイトはスマブラSP非公式のWebサービスです。</p>
            <p className={classes.description}>当サイトは、大乱闘スマッシュブラザーズSPECIALのオンライン対戦における世界戦闘力を扱ったWebサービスです。<br />X（旧Twitter）ログインをすることで、ランキングに参加することができます。</p>
        </div>
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
      {/* <div className={classes.add}>
        <AdMax id="264830f2e32e7abd21c59063ffd2873b" />
      </div> */}
    </div>
  );
}
