import ChatPeopleList from "components/chat/chatPeopleList";
import ChatScreen from "components/chat/chatScreen";

export default function ChatPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <ChatPeopleList />
      <ChatScreen />
    </div>
  );
}
