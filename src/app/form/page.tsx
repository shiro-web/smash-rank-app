import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import XIcon from "@mui/icons-material/X";

const Form = () => {
  return (
    <div className="flex flex-col text-[#333] p-4 min-h-screen w-full md:max-w-[484px] mx-auto">
      <div className="border-[1px] border-gray-300 p-6 mb-6 rounded-md w-full">
        <div className="flex gap-2 mb-2 justify-center items-center">
          <MailOutlineIcon />
          <p className="text-2xl">お問い合わせ</p>
        </div>
        <p>なにか不具合などありましたら、下記のアカウントへDMをください。</p>
        <div className="flex items-center justify-center gap-2">
          <XIcon fontSize="small" />
          <a
            href="https://twitter.com/SmashRank0201"
            className="text-lg underline"
          >
            @SmashRank0201
          </a>
        </div>
      </div>
    </div>
  );
};

export default Form;
