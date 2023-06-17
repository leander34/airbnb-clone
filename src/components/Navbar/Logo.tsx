"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoImage from "../../assets/logo.png";
export default function Logo() {
  const router = useRouter();
  return (
    <Image
      alt="Airbnb Logo"
      className="hidden md:block cursor-pointer"
      height={100}
      width={100}
      src={logoImage}
      onClick={() => router.push("/")}
    />
  );
}
