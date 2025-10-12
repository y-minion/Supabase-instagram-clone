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
