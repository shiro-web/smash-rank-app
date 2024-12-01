import AppContext from "@/context/AppContext";
import Image from "next/image";
import React, { useContext } from "react";

const ProfileInfo = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="w-full flex items-center gap-4 max-w-md bg-white border-gray-300 border-[1px] shadow-sm rounded-lg p-6 mb-4 text-center">
      <div className="flex justify-center">
        {user && user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="rounded-full"
          />
        )}
      </div>
      <div>
        <h1 className="text-2xl text-left font-bold">
          {user ? user.displayName : null}
        </h1>
        <p className="text-xs text-gray-300">@{user ? user.uid : null}</p>
      </div>
      {/* <p className="text-gray-500">@username</p> */}
    </div>
  );
};

export default ProfileInfo;
