import React, { useContext } from 'react';
import dayjs from 'dayjs';
import classes from "./RankBody.module.scss";
import { Data } from '@/types';
import Link from 'next/link';
import AppContext from '@/context/AppContext';
import Image from 'next/image';


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
            <td className={classes.bodyRank}>
              {(getIndex(data.power, datas) + 1) == 1 ? <Image src="/first.png" alt="" width={33.6} height={25.5} className={classes.first}/> : "" } 
              {(getIndex(data.power, datas) + 1) == 2 ? <Image src="/second.png" alt="" width={33.6} height={25.5} className={classes.second}/> : "" } 
              {(getIndex(data.power, datas) + 1) == 3 ? <Image src="/third.png" alt="" width={33.6} height={25.5} className={classes.third}/> : "" } 
              {getIndex(data.power, datas) + 1}</td>
            <td className={classes.bodyUserName}>
              <div className={classes.userDisplay}>
                <div className={classes.character}><Link href={`/fighter/${data.characterName}`}><img src={data.character == "anonymous" ? "/Anonymous.png" : data.character} alt="使用キャラクター"/></Link></div>
                <div className={classes.userName}>
                  {data.userName == "anonymous" ? (<p className={classes.userNameAnonymous}>{data.name == "anonymous" ? "匿名" : data.name}</p>) : (<Link className={classes.userNameLink} href={`https://twitter.com/${data.userName}`}>{data.name == "anonymous" ? "匿名" : data.name}</Link> )}
                </div>
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