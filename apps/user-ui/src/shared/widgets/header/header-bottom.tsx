"use client";
import useUser from "apps/user-ui/src/hooks/useUser";
import CartIcon from "../../../assets/svgs/cart-icon";
import ProfileIcon from "../../../assets/svgs/profile-icon";
import { NavItems } from "../../../configs/constants";
import { AlignLeft, ChevronDown, HeartIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();

  console.log(user);
  

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        } `}
      >
        {/* All dropdowns */}
        <div
          className={`w-[260px] ${
            isSticky && "mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff] `}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {/* Dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] h-[400px] bg-[#f5f5f5] `}
          ></div>
        )}

        {/* Navigation links */}
        <div className="flex items-center">
          {NavItems.map((i: NavItemTypes, index: number) => (
            <Link
              href={i.href}
              key={index}
              className="px-4 font-medium text-lg"
            >
              {i.title}
            </Link>
          ))}
        </div>
        {isSticky && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              {!isLoading && user ? (
                <>
                  <Link
                    href={"/profile"}
                    className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a] "
                  >
                    <ProfileIcon />
                  </Link>
                  <Link href={"/profile"}>
                    <span className="block font-medium">Hallo,</span>
                    <span className="font-semibold">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={"/login"}
                    className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a] "
                  >
                    <ProfileIcon />
                  </Link>
                  <Link href={"/login"}>
                    <span className="block font-medium">Hallo,</span>
                    <span className="font-semibold">
                      {isLoading ? "..." : "Sign In"}
                    </span>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-5">
              <Link href={"/wishlist"} className="relative">
                <HeartIcon />
                <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">0</span>
                </div>
              </Link>
              <Link href={"/cart"} className="relative">
                <CartIcon />
                <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">0</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBottom;
