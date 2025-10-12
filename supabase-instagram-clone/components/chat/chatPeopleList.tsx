"use client";

import {
  selectedUserIdState,
  selectedUserIndexState,
} from "utils/recoil/atoms";
import Person from "./person";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "actions/chatActions";

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const setSelectedUserIndex = useSetRecoilState(selectedUserIndexState);

  //getAllUsers
  const getAllUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log(`getAllUsers경과${allUsers}`);
      return allUsers.filter(({ id }) => id !== loggedInUser?.id);
    },
  });

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
