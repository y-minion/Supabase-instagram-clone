"use client";

import { Button, Input } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignUp({ setView }) {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationRequired, setConfirmationRequiered] = useState(false);

  const supabase = createBrowserSupabaseClient(); //클라이언트 컴포넌트에서 수파베이스 api사용 하기 위한 호출

  //signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      //회원가입 진행시 수파베이스의 회원가입 메서드를 사용한다. 사용자의 이메일,비밀번호, 리다이렉트 주소를 전달한다.
      //회원가입 로직이 성공시 data가 반환된다.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          //이메일 인증으로 부터 받은 code를 추출하여 세션으로 교환을 하는 라우터
          emailRedirectTo: "http://localhost:3000/signup/confirm",
        },
      });

      //회원가입 성공시 승인여부 상태도 변경한다.
      if (data) setConfirmationRequiered(true);

      if (error) {
        alert(error.message);
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      //회원가입 진행시 수파베이스의 회원가입 메서드를 사용한다. 사용자의 이메일,비밀번호, 리다이렉트 주소를 전달한다.
      //회원가입 로직이 성공시 data가 반환된다.
      const { data, error } = await supabase.auth.verifyOtp({
        type: "signup",
        email,
        token: otp,
      });

      //회원가입 성공시 승인여부 상태도 변경한다.
      if (data) {
        console.log(data);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-full border border-gray-400 bg-white gap-2">
        <img src="images/inflearngram.png" className="w-60 mb-6" />
        {confirmationRequired ? (
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            label="otp"
            type="text"
            className="w-full rounded-sm"
            placeholder="6자리 OTP를 입력해주세요."
          />
        ) : (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="email"
              type="email"
              className="w-full rounded-sm"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="password"
              type="password"
              className="w-full rounded-sm"
            />
          </>
        )}
        <Button
          onClick={() =>
            confirmationRequired
              ? verifyOtpMutation.mutate()
              : signupMutation.mutate()
          }
          loading={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          } //중복 가입을 방지하기 위해 가입이 승인된 경우라면 동작하지 않아야 한다.
          color="light-blue"
          className="w-full rounded-sm py-1 text-md"
        >
          {confirmationRequired ? "인증하기" : "가입하기"}
        </Button>
      </div>
      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        이미 계정이 있으신가요?
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView("SIGNIN")}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
