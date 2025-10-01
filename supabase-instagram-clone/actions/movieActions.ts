"use server";

import hanldeError from "utils/supabase/handleError";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function searchMovies({ search, page, pageSize }) {
  const supabase = await createServerSupabaseClient();

  //count는 쿼리의 범위(.range)에 상관 없이 현재 쿼리의 모든 레코드 갯수를 반환한다.
  const { data, count, error } = await supabase
    .from("movie")
    .select("*")
    .like("title", `%${search}%`)

    //입력 받은 매개변수를 통해 테이블 데이터를 페이징 처리하는 로직. 레코드의 범위를 설정한다. -> 페이지를 직접 서버액션 단에서 계산해서 넘겨줘야 한다.
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error(error);
    return {
      data: [],
      count: 0,
      page: null,
      pageSize: null,
      error,
    };
  }

  //다음 페이지의 유무는 직접 계산해 준다.
  const hasNextPage = count > page * pageSize;

  return { data, page, pageSize, hasNextPage };
}

export async function getMovie(id: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle(); //data를 리스트로 받지 않고, 하나인걸 알고 있으니 한개로 받겠다. 그리고 null일 수도 있다.

  hanldeError(error);

  return data;
}
