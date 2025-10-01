"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <div className="relative col-span-1">
      {/* Image 부분 */}
      <img className="w-full" src={movie.image_url} />

      {/* Dim */}

      <Link href={`movies/${movie.id}`}>
        <div className="flex items-center justify-center z-10 top-0 bottom-0 left-0 right-0  absolute hover:opacity-90 opacity-0 bg-black transition-opacity duration-300 ">
          <p className="text-white text-center text-xl font-bold">
            {movie.title}
          </p>
        </div>
      </Link>
    </div>
  );
}
