"use client";

import Logo from "components/logo";
import { useRecoilState } from "recoil";
import { searchState } from "utils/recoil/atoms";

export default function Header() {
  const [search, setSearch] = useRecoilState(searchState);

  return (
    <header className="flex items-center justify-between fixed top-0 left-0 right-0 py-2 bg-gray-900 z-50">
      <nav className="flex gap-4">
        <Logo />
        <ul className="flex gap-2 text-white">
          <li>Movies</li>
          <li>Dramas</li>
        </ul>
      </nav>
      <div className="flex gap-2 w-full max-w-72 items-center border border-white text-white bg-transparent rounded-md p-2">
        <i className="fas fa-search" />
        <input
          className="bg-transparent"
          placeholder="Search Movies"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </header>
  );
}
