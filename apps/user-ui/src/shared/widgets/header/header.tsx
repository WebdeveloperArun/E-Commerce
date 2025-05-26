import CartIcon from "../../../assets/svgs/cart-icon";
import HeartIcon from "../../../assets/svgs/heart-icon";
import ProfileIcon from "../../../assets/svgs/profile-icon";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import HeaderBottom from "./header-bottom";

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-[700] ">E-Shop</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px]"
            placeholder="Search for products..."
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489ff] absolute top-0 right-0 ">
            <Search color="white" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link
              href={"/login"}
              className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a] "
            >
              <ProfileIcon />
            </Link>
            <Link href={"/login"}>
              <span className="block font-medium">Hallo,</span>
              <span className="font-semibold">Sign In</span>
            </Link>
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
      </div>
      <div className="border-b border-b-[#99999938]"/>
      <HeaderBottom />
    </div>
  );
};

export default Header;
