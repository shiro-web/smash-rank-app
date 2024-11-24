import React, { useContext } from "react";
import dayjs from "dayjs";
import { Data } from "@/types";
import Link from "next/link";
import AppContext from "@/context/AppContext";
import Image from "next/image";

type RankBodyProps = {
  currentItems: Data[];
  getIndex: (value: number, arr: Data[]) => number;
  datas: Data[];
};

const RankBody = ({ currentItems, getIndex, datas }: RankBodyProps) => {
  return (
    <>
      <tbody>
        {currentItems.map((data) => (
          <tr key={data.id} className="border-b">
            <td className="p-2 align-middle">
              <div className="flex items-center gap-2">
                {getIndex(data.power, datas) + 1 <= 3 ? (
                  <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {getIndex(data.power, datas) + 1 === 1 && (
                      <p className="bg-gray-300 text-xs md:text-base rounded-full h-6 w-6 md:h-8 md:w-8 text-[#333] text-center leading-6 md:leading-8">
                        1
                      </p>
                    )}
                    {getIndex(data.power, datas) + 1 === 2 && (
                      <p className="bg-gray-300 text-xs md:text-base rounded-full h-6 w-6 md:h-8 md:w-8 text-[#333] text-center leading-6 md:leading-8">
                        2
                      </p>
                    )}
                    {getIndex(data.power, datas) + 1 === 3 && (
                      <p className="bg-gray-300 text-xs md:text-base rounded-full h-6 w-6 md:h-8 md:w-8 text-[#333] text-center leading-6 md:leading-8">
                        3
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex h-6 w-6 text-xs md:text-base md:h-8 md:w-8 leading-6 items-center justify-center text-muted-foreground">
                    {getIndex(data.power, datas) + 1}
                  </div>
                )}
              </div>
            </td>
            <td className="p-2  align-middle [&:has([role=checkbox])]:pr-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/fighter/${data.characterName}`}
                  className="overflow-hidden rounded-xl w-9 h-9 md:w-[44px] md:h-[44px]"
                >
                  <Image
                    src={
                      data.character === "anonymous"
                        ? "/Anonymous.png"
                        : data.character
                    }
                    alt="使用キャラクター"
                    width={44}
                    height={44}
                  />
                </Link>
                {data.userName === "anonymous" ? (
                  <span className="text-muted-foreground">
                    {data.name === "anonymous" ? "匿名" : data.name}
                  </span>
                ) : (
                  <Link
                    href={`https://twitter.com/${data.userName}`}
                    className="hover:underline max-w-20 md:max-w-full text-xs md:text-base whitespace-nowrap overflow-hidden text-ellipsis underline"
                  >
                    {data.name === "anonymous" ? "匿名" : data.name}
                  </Link>
                )}
              </div>
            </td>
            <td className="p-2 align-middle text-xs md:text-base  [&:has([role=checkbox])]:pr-0 text-right">
              {data.power.toLocaleString()}
            </td>
            <td className="p-2 align-middle text-xs md:text-base [&:has([role=checkbox])]:pr-0 text-right text-muted-foreground">
              {dayjs(data.createdAt.toDate()).format("YYYY/MM/DD")}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default RankBody;
