"use client";

import { useRecoilValue } from "recoil";
import Message from "./message";
import Person from "./person";
import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessages, getUserById, sendMessage } from "actions/chatActions";
import { useEffect, useState } from "react";

export default function ChatScreen() {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const [message, setMessage] = useState("");
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);

  const selectedUserQuery = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: async () => {
      return getUserById(selectedUserId);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      sendMessage({
        message,
        chatUserId: selectedUserId,
      });
    },
    onSuccess: () => {
      setMessage(""); // 성공시 메세지창을 초기화 시켜줘야 한다.
      getAllMessagesQuery.refetch(); // 메세지 전송이 성공하면 다시 메세지 내역들을 리패치하여 최신화해야한다. -> 하지만 이것만으로는 실시간성이 보장되지 않는다.
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId], //유저 id별로 대화한 메세지 데이터들이 전부 캐시된다.
    queryFn: async () => {
      return getAllMessages({ chatUserId: selectedUserId });
    },
  });

  useEffect(() => {
    console.log(`채팅 쿼리 : ${selectedUserQuery.data}`);
  }, [selectedUserQuery.data]);

  return selectedUserQuery.data ? (
    <div className="w-full h-screen flex flex-col">
      {/* 유저 영역 */}
      <Person
        index={selectedUserIndex}
        isActive={false}
        name={selectedUserQuery.data?.email?.split("@")?.[0]}
        onChatScreen={true}
        onlineAt={new Date().toISOString()}
        userId={selectedUserQuery.data?.id}
      />

      {/* 채팅 영역 */}
      <div className="flex overflow-y-scroll flex-col flex-1 p-4 gap-2">
        <Message isFromMe={true} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
        <Message isFromMe={false} message={"안녕하세요"} />
      </div>

      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
