"use client";

import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import Person from "./person";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "actions/chatActions";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const setSelectedUserIndex = useSetRecoilState(selectedUserIndexState);

  const supabase = createBrowserSupabaseClient();

  //getAllUsers
  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log(`getAllUsers경과${allUsers}`);
      return allUsers.filter(({ id }) => id !== loggedInUser?.id);
    },
  });

  useEffect(() => {
    const channel = supabase.channel("online_users", {
      config: {
        presence: {
          //presence를 분류할 수 있는 커스텀 key값 주입
          key: loggedInUser?.id,
        },
      },
    });

    //같은 채널의 유저의 상태에 대해 구독
    channel.on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      console.log(newState);
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }
      //useEffect로 해당 채널에 구독하는 순간에 현재의 시간을 onlineAt 키의 값으로 동일 채널의 모든 구독자들에게 전파
      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(),
      });
      console.log(newPresenceStatus);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, idx) => {
        return (
          <Person
            key={user.id}
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserIndex(idx);
            }}
            index={idx}
            isActive={selectedUserId === user.id}
            name={user.email.split("@")[0]}
            onChatScreen={false}
            onlineAt={new Date().toISOString()}
            userId={user.id}
          />
        );
      })}
    </div>
  );
}
