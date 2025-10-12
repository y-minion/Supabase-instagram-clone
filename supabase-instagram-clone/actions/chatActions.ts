"use server";

import { get } from "http";
import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "utils/supabase/server";

export async function getAllUsers() {
  //접속을 안 한 유저들의 목록도 모두 가져와야 하므로, admin 권한이 있는 객체를 불러온다
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error(`에러발생 ${error}`);
    return [];
  }

  return data.users;
}

export async function getUserById(userId: string) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) return null;

  return data.user;
}

export async function sendMessage({ message, chatUserId }) {
  const supabase = await createServerSupabaseClient(); // 현재 접속한 계정이 누구인지 알기위해서 반드시 admin이 아닌 일반 서버 클라이언트를 생성해야한다.

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
      sender: session.user.id,
    });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }

  return data;
}

export async function getAllMessages({ chatUserId }) {
  const supabase = await createServerSupabaseClient();

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
