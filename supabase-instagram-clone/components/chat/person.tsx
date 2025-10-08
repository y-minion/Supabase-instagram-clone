"use client";

import { getRandomImage } from "utils/random";

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  isActive,
  onChatScreen,
}) {
  return (
    <div
      className={`flex gap-4 items-center p-4 ${
        !onChatScreen && isActive ? "bg-light-blue-50" : "bg-gray-50"
      } ${onChatScreen && "bg-gray-50"}`}
    >
      <img
        src={getRandomImage(index)}
        alt={name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col items-start ">
        <p className="text-black font-bold text-lg">{name}</p>
        <p className="text-gray-500 text-sm">Active {onlineAt}m ago</p>
      </div>
    </div>
  );
}
