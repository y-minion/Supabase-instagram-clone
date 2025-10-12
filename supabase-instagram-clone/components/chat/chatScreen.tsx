"use client";

import { useRecoilValue } from "recoil";
import Message from "./message";
import Person from "./person";
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById } from "actions/chatActions";
import { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export async function sendMessage({ message, chatUserId }) {
  const supabase = createBrowserSupabaseClient(); // 현재 접속한 계정이 누구인지 알기위해서 반드시 admin이 아닌 일반 서버 클라이언트를 생성해야한다.

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error("User is not authenticated");
  }

  const { data, error: sendMessageError } = await supabase
    .from("message")
    .insert({
      message,
      receiver: chatUserId,
      // sender: session.user.id,
    });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }

  return data;
}

export async function getAllMessages({ chatUserId }) {
  const supabase = createBrowserSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error("User is not authenticated");
  }

  const { data, error: getMessagesError } = await supabase
    .from("message")
    .select("*")
    .or(`receiver.eq.${session.user.id},receiver.eq.${chatUserId}`)
    .or(`sender.eq.${session.user.id},sender.eq.${chatUserId}`)
    .order("created_at", { ascending: true });

  if (getMessagesError) return [];

  return data;
}

export default function ChatScreen() {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const [message, setMessage] = useState("");
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const supabase = createBrowserSupabaseClient();
  const presence = useRecoilValue(presenceState);

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
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          // 페이로드가 존재할 경우 해당 로직 실행
          if (
            payload.eventType === "INSERT" &&
            !payload.errors &&
            !!payload.new
          ) {
            // 위의 조건들을 만족하면 이 채널을 구독하고 있는 컴포넌트에서 메세지데이터를 불러오는 쿼리를 리패치한다.
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

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
        onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt}
        userId={selectedUserQuery.data?.id}
      />

      {/* 채팅 영역 */}
      <div className="flex overflow-y-scroll flex-col flex-1 p-4 gap-2">
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId}
          />
        ))}
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
          onClick={() => sendMessageMutation.mutate()}
        >
          {sendMessageMutation.isPending ? <Spinner /> : <span>전송</span>}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
