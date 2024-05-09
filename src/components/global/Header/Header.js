import React from 'react'
import useWindowDimensions from '../../../utils/windowDimensions'
import SidebarMenuButton from '../SidebarMenuButton'
import { Box, Typography } from '@mui/material'
import { AccountCircleRounded } from '@mui/icons-material'
import styled from 'styled-components'
import { useNavigate } from 'react-router'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

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
	z-index: 100;
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

	const { width, height } = useWindowDimensions()
	const navigate = useNavigate({});

	return (
		<HeaderWrapper>
			{width <= 800 ? (
				<>
					<NavIcon>
						<SidebarMenuButton isSidebarCollapsed={props.isSidebarCollapsed} setIsSidebarCollapsed={props.setIsSidebarCollapsed} />
						<Typography variant='h4' style={headerFontStyle}>{props.title}</Typography>
					</NavIcon>
					<AccountWrapper>
						{
							width <= 400 ? (
								<>
									<NotificationsTwoToneIcon onClick={() => {navigate('/alerts'), props.setHeaderTitle('Alerts')}} sx={{ color: '#ffffff', marginRight: '30px' }} />
									<AccountCircleRounded onClick={() => {navigate('/settings/user-profile'), props.setHeaderTitle('Settings')}} sx={{ color: '#ffffff' }} />
								</>
							)
								: (
									<>
										<NotificationsTwoToneIcon onClick={() => {navigate('/alerts'), props.setHeaderTitle('Alerts')}} sx={{ color: '#ffffff', marginRight: '30px' }} />
										<Typography variant='h6' style={headerFontStyle}>{props.user}</Typography>
										<AccountCircleRounded onClick={() => {navigate('/settings/user-profile'), props.setHeaderTitle('Settings')}} sx={{ color: '#ffffff' }} />
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
							<NotificationsTwoToneIcon onClick={() => {navigate('/alerts'), props.setHeaderTitle('Alerts')}} sx={{ color: '#ffffff', marginRight: '30px' }} />
							<Typography variant='h6' style={headerFontStyle}>{props.username}</Typography>
							<AccountCircleRounded onClick={() => {navigate('/settings/user-profile'), props.setHeaderTitle('Settings')}} sx={{ color: '#ffffff' }} />
						</AccountWrapper>
					</>
				)
			}
		</HeaderWrapper>
	)
}

export default Header

