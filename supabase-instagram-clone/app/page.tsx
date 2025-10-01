import LogoutButton from "components/logout-button";

export const metadata = {
  title: "Clonestagram",
  description: "Instagram clone project",
};

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-center h-screen gap-2">
      <h1 className="font-bold text-xl">Welcome {"웅맹잉"}!</h1>
      <LogoutButton />
    </main>
  );
}
