import React, { useEffect } from 'react'
import useSidebar from '../../../hooks/useSidebar'
import { usePathname } from 'next/navigation'
import useSeller from '../../../hooks/useSeller';
import Box from '../Box';

const SidebarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller} = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName)
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => activeSidebar === route ? "#0085ff" : "#969696"

  return (
    <Box>
      
    </Box>
  )
}

export default SidebarWrapper
