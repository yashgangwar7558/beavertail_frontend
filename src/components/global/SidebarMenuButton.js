import React from 'react'
import { IconButton } from '@mui/material'
import { MenuRounded, MenuOpen } from '@mui/icons-material'

const SidebarMenuButton = (props) => {

	const toggleSidebar = () => {
		props.setIsSidebarCollapsed(!props.isSidebarCollapsed);
	}

    return (
        <IconButton onClick={toggleSidebar} sx={{ padding: '0px' }}>
            {props.isSidebarCollapsed ? (
                <MenuRounded sx={{ color: '#9CFCD8', fontSize: '30px'}} />
            ) : (
                <MenuOpen sx={{ color: '#9CFCD8', fontSize: '30px'}} /> 
            )}
        </IconButton>
    )
}

export default SidebarMenuButton