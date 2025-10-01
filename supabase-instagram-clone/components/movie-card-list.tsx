"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MovieCard from "./movie-card";
import { Spinner } from "@material-tailwind/react";
import { searchMovies } from "actions/movieActions";
import { useRecoilValue } from "recoil";
import { searchState } from "utils/recoil/atoms";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function MovieCardList() {
  const search = useRecoilValue(searchState);
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 1, //무한 스크롤내에서 내부적으로 관리할 페이지 넘버
      queryKey: ["movie", search], //queryKey에 search 값이 변경될때마다 새로운 값을 넣어 줘야 실제로 검색 값이 변경 될 때마다 새롭게 데이터 패칭을 실행한다.

      //새롭게 pageParam이라는 변수가 자동으로 입력된다
      // 내부의 서버액션으로 현재 검색 결과, 현재 페이지 번호, 한 페이지의 사이즈가 전달된다.
      queryFn: (
        { pageParam } //❗️ 중요! -> 꼭 pageParam은 구조 분해 할당으로 받을 것!
      ) =>
        //useInfiniteQuery의 queryFn 함수는 페이지 번호(pageParam)를 포함한 객체를 인자로 받는다!!!!!!!
        searchMovies({ search, page: pageParam, pageSize: 12 }),

      //useInfiniteQuery가 내부적으로 다음 페이지를 전달해준다.
      //이때 입력받는 LasrPage 매개변수의 page 속성은 서버 액션에서 반환한 페이지를 참조한다.
      getNextPageParam: (lastPage) =>
        lastPage.page ? lastPage.page + 1 : null,
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView]);

  useEffect(() => {
    console.log(`InView 반환값:${inView}`);
  }, [inView]);

  return (
    <div className="grid gap-1 grid-cols-3 md:grid-cols-4 w-full h-full">
      {(isFetching || isFetchingNextPage) && <Spinner />}

      {data?.pages
        ?.map((page) => page.data)
        ?.flat()
        ?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      <div ref={ref}></div>
    </div>
  );
}
