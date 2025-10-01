"use client";

import { useQuery } from "@tanstack/react-query";
import DropboxImage from "./dropbox-image";
import { searchFile } from "actions/storageActions";
import { Spinner } from "@material-tailwind/react";

export default function DropboxImageList({ searchInput }) {
  const searchImagesQuery = useQuery({
    queryKey: ["images", searchInput],

    //클라이언트 컴포넌트에서 직접 API호출하는건 지양하고, 서버 액션을 최대한 활용한다.
    queryFn: async () => await searchFile(searchInput),
  });
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {searchImagesQuery.isLoading && <Spinner />}
      {searchImagesQuery.data &&
        searchImagesQuery.data.map((image) => (
          <DropboxImage key={image.id} image={image} />
        ))}
    </section>
  );
}
