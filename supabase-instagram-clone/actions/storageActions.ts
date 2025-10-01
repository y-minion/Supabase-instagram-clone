"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function uploadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  //전달 받은 formData객체로 부터 각각의 파일 데이터를 추출한뒤 수파베이스로 전송해야한다.
  const files = Array.from(formData.entries()).map(([_, file]) => file as File);

  try {
    const result = await Promise.all(
      files.map((file) => {
        //테이블 조회와 다르게 버켓 접근은 storage로 접근한다. 그리고 버킷의 이름은 from으로 접근할 수 있다.
        return (
          supabase.storage
            .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
            //upload의 옵션으로 upsert를 설정한다. 버킷에 파일이 존재하면 덮어 쓰고, 없는 경우 새로 만든다.
            // 모르는 옵션이 있으면 해당 모듈 들어가서 주석 읽어보자.
            .upload(file.name, file, { upsert: true })
        );
      })
    );
    return result;
  } catch (error) {
    handleError(error);
  }
}

export async function searchFile(search: string = "") {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .list(null, {
      search,
    });

  if (error) handleError(error);

  return data;
}

export async function deleteFile(fileName: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove([fileName]);

  if (error) handleError(error);

  return data;
}
