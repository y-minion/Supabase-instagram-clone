import Person from "./person";

export default function ChatPeopleList() {
  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      <Person
        index={0}
        isActive={true}
        name={"이안"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"ads"}
      />
      <Person
        index={0}
        isActive={false}
        name={"웅이에"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"ads"}
      />
      <Person
        index={0}
        isActive={true}
        name={"오이에"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"ads"}
      />
    </div>
  );
}
