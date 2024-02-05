import React from 'react';
import dayjs from 'dayjs';
import classes from "./RankBody.module.scss";
import { Data } from '@/types';
import Link from 'next/link';


type RankBodyProps = {
  currentItems: Data[];
  getIndex: (value: number, arr: Data[]) => number;
  datas: Data[];
};


const RankBody = ({currentItems,getIndex,datas}:RankBodyProps) => {
  return (
    <>
    {currentItems.map((data) => (
        <tbody key={data.id} className={classes.rankTableBody}>
          <tr className={classes.bodyRow}>
            <td className={classes.bodyRank}>{getIndex(data.power, datas) + 1}</td>
            <td className={classes.bodyUserName}>
              <div className={classes.userDisplay}>
                <div className={classes.character}><Link href={`/fighter/${data.characterName}`}><img src={data.character == "anonymous" ? "/Anonymous.png" : data.character} alt="使用キャラクター"/></Link></div>
                <div className={classes.userName}>{data.name == "anonymous" ? "匿名" : data.name}<span className={classes.balloon}>{data.name == "anonymous" ? "匿名" : data.name}</span></div>
              </div>  
            </td >
            <td className={classes.bodyPower}>{data.power.toLocaleString()}</td>
            <td className={classes.bodyDate}>{dayjs(data.createdAt.toDate()).format('YYYY/MM/DD')}</td>
          </tr>         
        </tbody>
      ))}
    </>
  )
}

export default RankBody