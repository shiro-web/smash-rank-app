"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase";
import AppContext from "@/context/AppContext";
import HeaderTwitterLogin from "./HeaderTwitterLogin";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <header className="bg-white">
      <div>
        {/* Top bar */}
        <div className="px-2 py-3 items-center">
          <div className="flex justify-between md:max-w-[800px] md:mx-auto">
            <Link href="/">
              <Image width={200} height={37} src="/logo.png" alt="" />
            </Link>
            {user ? (
              <button
                onClick={() => auth.signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ログアウト
              </button>
            ) : (
              <HeaderTwitterLogin />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 bg-gray-50 border-y border-gray-200">
          <div className="overflow-x-auto hidden-scrollbar">
            {/* 横スクロールを有効にするためにw-fullとflexの調整 */}
            <div className="flex space-x-4 min-w-max md:justify-center">
              <NavLink href="/usage" icon={<CheckCircleIcon />} text="使い方" />
              {user && (
                <NavLink
                  href={`/mypage/${user?.uid}`}
                  icon={<AccountCircleIcon />}
                  text="マイページ"
                />
              )}
              <NavLink href="/" icon={<HomeIcon />} text="サイトトップ" />
              <NavLink href="/info" icon={<InfoIcon />} text="サイトについて" />
              <NavLink href="/form" icon={<EmailIcon />} text="お問い合わせ" />
              <NavLink
                href="/policy"
                icon={<DescriptionIcon />}
                text="利用規約"
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Helper component for navigation links
function NavLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex gap-1 text-xs items-center font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
