import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Link href={"/"}>
        <Image
          height={30}
          width={30}
          src={"/images/tmdbflix_logo.png"}
          alt="TMDBFLIX Logo"
          className="!w-20 !h-auto"
        />
      </Link>
    </div>
  );
}
