"use client";

import { IconButton, Spinner } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "actions/storageActions";
import { getImageUrl } from "utils/supabase/storage";

export default function DropboxImage({ image }) {
  const queryClient = useQueryClient();
  const deleteFileMutation = useMutation({
    mutationFn: (fileName: string) => deleteFile(fileName),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
        exact: false,
      });
    },
  });

  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-xl shadow-md">
      {/* Image */}
      <div>
        {/* 사진의 비율을 맞추기 위해 aspect-square을 사용한다. */}
        <img
          src={getImageUrl(image.name)}
          className="w-full rounded-xl aspect-square"
        />
      </div>
      {/* FileName */}
      <div>{image.name}</div>

      <div className="absolute top-4 right-4 ">
        <IconButton
          color="red"
          onClick={() => {
            deleteFileMutation.mutate(image.name);
          }}
        >
          {deleteFileMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-trash" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
