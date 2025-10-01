"use client";

import { Home, Logout, People, Search, Send } from "@mui/icons-material";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-fit flex flex-col justify-between h-screen p-6 border-r border-gray-300">
      {/* Home 버튼 + People Page ~ Chat Page */}
      <div className="flex flex-col gap-4">
        <Link href={"/"}>
          <Home className="text-2xl mb-10" />
        </Link>
        <Link href={"/people"}>
          <People className="text-2xl" />
        </Link>
        <Link href={"/discover"}>
          <Search className="text-2xl" />
        </Link>
        <Link href={"/chat"}>
          <Send className="text-2xl" />
        </Link>
      </div>

      {/* 로그아웃 버튼 */}
      <div>
        <button onClick={() => console.log("로그아웃")}>
          <Logout className="text-2xl" />
        </button>
      </div>
    </aside>
  );
}
