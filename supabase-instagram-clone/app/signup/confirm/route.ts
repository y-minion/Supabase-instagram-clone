import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function GET(request: Request) {
  //리퀘스트를 url 객체로 만들어 준다.
  const requestUrl = new URL(request.url);

  //쿼리 파람 추출
  const code = requestUrl.searchParams.get("code");

  //쿼리파람에 code가 존재하면 수파베이스의 세션에 코드를 등록한다.
  if (code) {
    const supabase = await createServerSupabaseClient();

    try {
      await supabase.auth.exchangeCodeForSession(code);
      console.log("✅ 세션 교환 성공!"); // ❗️-> 여기까지는 정상 작동
    } catch (error) {
      console.error(`❌ 세션 교환 중 에러 발생:${error}`);
    }
  }
  //위의 모든 로직이 성공적으로 마무리 되면 url객체의 origin(메인 페이지)로 리다이렉트 시킨다.
  return NextResponse.redirect(requestUrl.origin);
}
