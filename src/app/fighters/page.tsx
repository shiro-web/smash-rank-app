"use client";

import Image from "next/image";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { characterTranslations } from "@/utils/translateCharacterName";
import Link from "next/link";

const Fiters = () => {
  return (
    <div className="flex flex-col text-[#333] p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
      <p className="text-2xl font-bold mb-4">キャラクター別ランキング</p>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(characterTranslations).map(
          ([englishName, japaneseName]) => (
            <Link
              href={`/fighter/${englishName}`}
              key={englishName}
              className="border-[1px] border-gray-300 p-4 rounded-md w-full flex flex-col items-center shadow-md cursor-pointer hover:shadow-none transition-all"
            >
              <Image
                width={48}
                height={48}
                alt=""
                src={`/${englishName}.png`}
                className="rounded-full"
              />
              <div className="flex items-center justify-center">
                <p className="leading-[160%]">{japaneseName}</p>
                <KeyboardArrowRightIcon fontSize="small" />
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Fiters;
