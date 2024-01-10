import React from 'react'
import { IconButton } from '@mui/material'
import { MenuRounded } from '@mui/icons-material'

const SidebarMenuButton = (props) => {

	const toggleSidebar = () => {
		props.setIsSidebarCollapsed(!props.isSidebarCollapsed);
	}

    return (
        <IconButton onClick={toggleSidebar}>
            <MenuRounded sx={{color: '#9CFCD8'}}/>
        </IconButton>
    )
}

export default SidebarMenuButton