"use client";

export default function Message({ isFromMe, message }) {
  return (
    <div
      className={`${
        isFromMe
          ? "bg-light-blue-600 text-white self-end "
          : "bg-gray-100 text-black self-start"
      } p-3 w-fit rounded-xl`}
    >
      {message}
    </div>
  );
}
