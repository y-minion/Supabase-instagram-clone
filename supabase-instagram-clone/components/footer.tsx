import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 text-white text-center">
      <p>
        Movie Database Scrapped from{" "}
        <Link className="text-blue-500" href="https://www.themoviedb.org/">
          TMDB
        </Link>
      </p>
    </footer>
  );
}
