import React from "react";
import Image from "next/image";
import HowToUse from "@/components/HowToUse";

const Info = () => {
  return (
    <div className="flex flex-col text-[#333] p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
      <HowToUse />
    </div>
  );
};

export default Info;
