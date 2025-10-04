import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function GET(request: Request) {
  console.log("\n--- [1] /signup/confirm 라우트 핸들러 시작 ---");

  //리퀘스트를 url 객체로 만들어 준다.
  const requestUrl = new URL(request.url);

  //쿼리 파람 추출
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    console.log("--- [!] URL에 code 파라미터가 없습니다. ---");
    return null;
  }

  console.log(
    `--- [2] URL에서 인증 code 추출 완료: ${code.substring(0, 10)}... ---`
  );

  //쿼리파람에 code가 존재하면 수파베이스의 세션에 코드를 등록한다.
  if (code) {
    const supabase = await createServerSupabaseClient();

    try {
      console.log("--- [3] exchangeCodeForSession 호출 시도 ---");

      await supabase.auth.exchangeCodeForSession(code);
      console.log("--- [4] ✅ exchangeCodeForSession 성공! (에러 없음) ---");
    } catch (error) {
      console.error(
        "--- [!] ❌ exchangeCodeForSession 에서 에러 발생! ---",
        error
      );

      return null;
    }
  }

  // --- 👇 여기가 가장 중요한 검증 단계 ---
  try {
    // Supabase 클라이언트를 "새로" 만들어서 현재 쿠키 저장소의 상태를 다시 읽어옵니다.
    const newSupabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await newSupabase.auth.getSession();

    if (session) {
      console.log(
        "--- [5] ✅✅✅ 세션 쿠키가 서버 측 저장소에 성공적으로 설정되었습니다! ---"
      );
      console.log("       -> 사용자 ID:", session.user.id);
    } else {
      console.log(
        "--- [5] ❌❌❌ E_COOKIE_NOT_SET: exchangeCode 이후에도 서버 측 세션이 null입니다. ---"
      );
      console.log(
        "       -> 이 로그가 보인다면, 미들웨어 설정 문제일 확률이 100%입니다."
      );
    }
  } catch (e) {
    console.log("--- [!] 세션 확인 중 예외 발생 ---", e);
  }

  console.log(
    `--- [6] 최종적으로 메인 페이지(${requestUrl.origin})로 리디렉션합니다. ---`
  );

  //위의 모든 로직이 성공적으로 마무리 되면 url객체의 origin(메인 페이지)로 리다이렉트 시킨다.
  return NextResponse.redirect(requestUrl.origin);
}
