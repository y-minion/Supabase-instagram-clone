import LogoutButton from "components/logout-button";
import { createServerSupabaseClient } from "utils/supabase/server";

export const metadata = {
  title: "Clonestagram",
  description: "Instagram clone project",
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="w-full flex flex-col items-center justify-center h-screen gap-2">
      <h1 className="font-bold text-xl">
        Welcome {session?.user?.email?.split("@")?.[0]}!
      </h1>
      <LogoutButton />
    </main>
  );
}
