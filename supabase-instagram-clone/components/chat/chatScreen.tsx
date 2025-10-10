"use client";

import { useRecoilValue } from "recoil";
import Message from "./message";
import Person from "./person";
import { selectedUserIdState } from "utils/recoil/atoms";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "actions/chatActions";
import { useEffect } from "react";

export default function ChatScreen() {
  const selectedUserId = useRecoilValue(selectedUserIdState);

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: async () => {
      return getUserById(selectedUserId.toString());
    },
  });

  useEffect(() => {
    console.log(`채팅 쿼리 : ${selectedUserQuery.data}`);
  }, [selectedUserQuery.data]);

  return selectedUserQuery.data ? (
    <div className="w-full h-screen flex flex-col">
      {/* 유저 영역 */}
      <Person
        index={0}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0]}
        onChatScreen={true}
        onlineAt={new Date().toISOString()}
        userId={selectedUserQuery.data?.id}
      />

      {/* 채팅 영역 */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Message isFromMe={true} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
      </div>

      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          className="p-3 w-full border-2 border-light-blue-600"
          placeholder="메세지를 입력하세요"
        />
        <button
          className="min-w-20 p-3 bg-light-blue-500 text-white"
          color="light-blue"
        >
          <span>전송</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
