"use client";

import { selectedIndexState } from "utils/recoil/atoms";
import Person from "./person";
import { useRecoilState } from "recoil";

export default function ChatPeopleList() {
  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState);

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      <Person
        onClick={() => setSelectedIndex(0)}
        index={0}
        isActive={selectedIndex === 0}
        name={"이안"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"ads"}
      />
      <Person
        onClick={() => setSelectedIndex(1)}
        index={0}
        isActive={selectedIndex === 1}
        name={"웅이에"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"ads"}
      />
    </div>
  );
}
