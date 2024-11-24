"use client";

import { useContext } from "react";
import AppContext from "@/context/AppContext";
import RankBody from "@/components/RankBody";
import Pagenation from "@/components/Pagenation";
import Link from "next/link";
import TwitterLogin from "@/components/TwitterLogin";
import useRank from "@/app/hooks/useRank";
import { translateCharacterName } from "@/utils/translateCharacterName";

export default function Home({ params }: { params: { id: string } }) {
  const { user } = useContext(AppContext);
  const { itemsPerPage, datas, count, itemsOffSet, getIndex, handlePageClick } =
    useRank({ params });

  return (
    <div className="px-[8px] py-4 mx-auto w-full md:max-w-[800px]">
      {/* <div className={classes.authWrapper}>
        {user ? (<Link href={`../../mypage/${user?.uid}`} className={classes.auth}>マイページ</Link>) : (<TwitterLogin/>)}
      </div>
      {user ? null : (<p className={classes.description}>Xでログインすると、世界戦闘力を登録することができます。</p>)}
      <div className={classes.allCharactersWrapper}>
        {user ? (<Link href={"/"} className={classes.allCharacters}>全キャラクター一覧へ</Link>) : ""}
      </div> */}
      {/* <h1 className={classes.title}>世界戦闘力ランキング<span className={classes.characterName}>({params.id})</span></h1> */}
      {/* <p>総ユーザー数:{count}</p> */}
      <main className="border rounded-xl md:px-6 md:py-6 px-2 py-3  border-gray-300">
        <p className="text-2xl font-bold mb-4">
          {translateCharacterName(params.id)}
        </p>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b text-left text-xs md:text-base">
                順位
              </th>
              <th className="px-2 py-1 border-b text-left text-xs md:text-base">
                ユーザー名
              </th>
              <th className="px-2 py-1 border-b text-right text-xs md:text-base">
                世界戦闘力
              </th>
              <th className="px-2 py-1 border-b text-right text-xs md:text-base">
                日付
              </th>
            </tr>
          </thead>
          <RankBody
            currentItems={datas.slice(itemsOffSet, itemsOffSet + itemsPerPage)}
            getIndex={getIndex}
            datas={datas}
          />
        </table>
        <Pagenation
          handlePageClick={handlePageClick}
          pageCount={Math.ceil(datas.length / itemsPerPage)}
        />
      </main>
    </div>
  );
}
