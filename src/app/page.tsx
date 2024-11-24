"use client";

import { useContext } from "react";
import AppContext from "@/context/AppContext";
import RankBody from "@/components/RankBody";
import Pagenation from "@/components/Pagenation";
import useRank from "./hooks/useRank";
import Link from "next/link";
import { AdMax } from "@/components/AdMax";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion } from "framer-motion";
import TwitterLogin from "@/components/TwitterLogin";
import useTwitterLogin from "@/components/hooks/TwitterLogin.ts/page";

export default function Home({ params }: { params: { id: string } }) {
  const { user } = useContext(AppContext);
  const { itemsPerPage, datas, count, itemsOffSet, getIndex, handlePageClick } =
    useRank({ params });
  const { twitterLogin } = useTwitterLogin();

  return (
    <div className="px-[8px] mx-auto w-full md:max-w-[800px]">
      {/* Info Section */}
      <div className="py-4 w-full mx-auto text-gray-500">
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer font-medium">
            当サイトについて
          </summary>
          <p className="mt-2">
            当サイトはスマブラSP非公式のWebサービスです。大乱闘スマッシュブラザーズSPECIALのオンライン対戦における世界戦闘力を扱ったWebサービスです。
            X（旧Twitter）ログインをすることで、ランキングに参加することができます。
          </p>
          <p className="mt-2">
            ※あくまで投稿されたプレイヤー内のランキングのため、実際の世界戦闘力ランキングとは異なります。
          </p>
        </details>
      </div>

      {/* Ranking Table */}
      <main className="border rounded-xl md:px-6 md:py-6 px-2 py-3 mb-4 border-gray-300">
        <div className="mb-6">
          <p className="md:text-2xl text-lg mb-1  font-bold">
            世界戦闘力ランキング
          </p>
          <p className="text-gray-400 text-xs md:text-base">
            ※投稿された世界戦闘力は、毎日22:00ごろに自動的に計算され更新されます。
          </p>
        </div>
        <div>
          <Link
            href={`/mypage/${user?.uid}`}
            className="bg-gradient-to-r from-orange-500 to-orange-600 flex gap-2 justify-center rounded-lg md:text-xl text-sm text-white p-2 items-center mb-4 hover:opacity-50 transition"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <EmojiEventsIcon className="w-5 h-5" />
            </motion.div>
            {user ? (
              <span>ランキングに参加　→</span>
            ) : (
              <span onClick={() => twitterLogin()}>
                Xでログインしてランキングに参加　→
              </span>
            )}
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </Link>
        </div>
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

        {/* Pagination */}
        <div className="my-2">
          <Pagenation
            handlePageClick={handlePageClick}
            pageCount={Math.ceil(datas.length / itemsPerPage)}
          />
        </div>
      </main>
      {/* <div className={classes.add}>
        <AdMax id="264830f2e32e7abd21c59063ffd2873b" />
      </div> */}
    </div>
  );
}
