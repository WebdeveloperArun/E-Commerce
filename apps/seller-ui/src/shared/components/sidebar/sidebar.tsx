"use client"

import React, { useEffect } from "react";
import useSidebar from "../../../hooks/useSidebar";
import { usePathname } from "next/navigation";
import useSeller from "../../../hooks/useSeller";
import Box from "../Box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import Logo from "apps/seller-ui/src/assets/svgs/logo";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  console.log("seller", seller);
  

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2">
            <Logo />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
    </Box>
  );
};

export default SidebarWrapper;
