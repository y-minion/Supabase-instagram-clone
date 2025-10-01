"use client";

import { Button, Spinner } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDragDropZone() {
  const fileRef = useRef(null);

  const queryClient = useQueryClient(); // useQueryClient 훅을 사용하여 올바른 QueryClient 인스턴스를 가져옵니다

  const uploadImageMutation = useMutation({
    // mutationFn: uploadFile, //서버 액션 함수를 등록만 해준다.
    // 서버 액션을 직접 호출하는 새로운 비동기 함수로 래핑합니다.
    mutationFn: async (formData: FormData) => {
      // 이 안에서 서버 액션을 호출하면 Next.js가 올바르게 처리합니다.
      return uploadFile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
        exact: false, // ["images"]로 시작하는 모든 쿼리를 무효화합니다.
      }); //쿼리클라이언트에 접근해 해당 키의 캐시를 초기화 한다.
      console.log("업로드 성공");
    },
    onError: (error) => {
      console.error("파일 업로드 실패:", error);
      alert(`파일 업로드에 실패했습니다: ${error.message}`);
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files -> 리액트 드랍존 라이브러리 사용 규칙

    if (acceptedFiles.length > 0) {
      const formData = new FormData();

      // 입력된 여러개의 파일을 하나의 폼 데이터 객체에 반복해서 넣는다.
      acceptedFiles.forEach((file) => {
        formData.append(file.name, file);
      });
      uploadImageMutation.mutate(formData);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, //멀티 파일의 옵션 설정
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center w-full border-4 border-dotted border-indigo-700 py-20 cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadImageMutation.isPending ? (
        <Spinner />
      ) : isDragActive ? (
        <p>파일을 놓아주세요.</p>
      ) : (
        <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드 하쇼</p>
      )}
    </div>
  );
}
