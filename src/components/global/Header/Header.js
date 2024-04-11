import React from 'react'
import useWindowDimensions from '../../../utils/windowDimensions'
import SidebarMenuButton from '../SidebarMenuButton'
import { Box, Typography } from '@mui/material'
import { AccountCircleRounded } from '@mui/icons-material'
import styled from 'styled-components'

const NavIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const HeaderWrapper = styled(Box)`
	padding: 10px 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
	background-color: #121B28;
	overflow: hidden;
	position: sticky;
	z-index: 5;
  	top: 0;
`

const AccountWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding-right: 10px;
`

const headerFontStyle = {
	color: '#ffffff',
	fontWeight: 'bold',
	fontFamily: 'inherit',
	paddingRight: '10px'
}

const Header = (props) => {

	const {width, height} = useWindowDimensions()

	return (
		<HeaderWrapper>
			{ width <= 800 ? (
					<>
						<NavIcon>
							<SidebarMenuButton isSidebarCollapsed={props.isSidebarCollapsed} setIsSidebarCollapsed={props.setIsSidebarCollapsed}/>
							<Typography variant='h4' style={headerFontStyle}>{props.title}</Typography>
						</NavIcon>
						<AccountWrapper>
							{
								width <= 400 ? (
									<AccountCircleRounded sx={{color: '#ffffff'}}/>
								)
								: (
									<>
										<Typography variant='h6' style={headerFontStyle}>{props.user}</Typography>
										<AccountCircleRounded sx={{color: '#ffffff'}}/>
									</>
								)
							}
						</AccountWrapper>
					</>
				)
				: (
					<>
						<Typography variant='h4' style={headerFontStyle}>{props.title}</Typography>
						<AccountWrapper>
							<Typography variant='h6' style={headerFontStyle}>{props.username}</Typography>
							<AccountCircleRounded sx={{color: '#ffffff'}}/>
						</AccountWrapper>
					</>
				)

			}
		</HeaderWrapper>
	)
}

export default Header

