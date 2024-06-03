import { React, useEffect, useState, useContext } from 'react'
import logo1 from '../../../assets/logo/greenCactusAi.png'
import { useNavigate } from 'react-router'
import { SidebarData } from '../../../utils/SidebarData'
import SidebarMenuButton from '../SidebarMenuButton'
import MenuItem from '../MenuItem'
import useWindowDimensions from '../../../utils/windowDimensions'
import { AuthContext } from '../../../context/AuthContext';
import { Box, Button, Typography, StyledEngineProvider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material'
import { LogoutRounded } from '@mui/icons-material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import styled from 'styled-components'

const NavIcon = styled.div`
    display: flex;
    justify-content: ${(props) => props.isCollapsed ? 'center' : 'space-between'};
    align-items: center;
    padding: 10px 15px;
	margin-bottom: 5px;
`
const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const LogoImage = styled.img`
    width: 40px;
    height: auto;
`
const LogoLabelMain = styled(Typography)`
	font-family: inherit; 
	font-size: 1.5rem;
	color: #9CFCD8;
`

const SidebarWrapper = styled.div`
    background: #121B28;
	font-family: Helvetica;
    width: ${(props) => props.isCollapsed ? '55px' : '280px'};
	height: 100%;
	transition: all 0.3s ease-in-out;
	overflow: hidden;
	position: fixed;
	z-index: 10;
	top: 0;	
	left: 0;

	@media screen and (max-width: 800px) {
		width: ${(props) => props.isCollapsed ? '0px' : '280px'};
	}

	@media screen and (max-width: 350px) {
		width: ${(props) => props.isCollapsed ? '0px' : '250px'};
	}
`
const RadioWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
	margin-bottom: 15px;
`

const MenuWrapper = styled(Box)`
	width: 100%;
	height: calc(100% - 93.7px);
	display: flex; 
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	margin-top: 10px;
	max-height: 100vh;
  	overflow-y: auto;

	  /* Hide scrollbar for WebKit-based browsers */
	  &::-webkit-scrollbar {
		display: none;
	  }
	
	  /* Hide scrollbar for Firefox */
	  scrollbar-width: none;
	
	  /* For IE, Edge and others */
	  -ms-overflow-style: none;
`
const LogoutButton = styled(Button)`
	&.MuiButton-root {
		text-transform: none;
		height: 50px;
		width: 100%;
		justify-content: flex-start;
		color: #e1e9fc;
		font-family: inherit;
		font-size: 18px;
		padding: 10px 38px;
		cursor: pointer;
	}

	&.MuiButton-root:hover {
		color: #ed473b;
		background: none;
	}
`
const LogoutIconButton = styled(IconButton)`
	&.MuiIconButton-root {
		justify-content: center;
		color: #e1e9fc;
	}

	&.MuiIconButton-root:hover {
		color: #ed473b;
		background: none;
	}
`

const Sidebar = (props) => {

	const [selected, setSelected] = useState('Dashboard')
	const [category, setCategory] = useState('all');
	const navigate = useNavigate({});

	const { width, height } = useWindowDimensions()

	const { userInfo, logout } = useContext(AuthContext);

	useEffect(() => {
		width <= 1024 ? props.setIsSidebarCollapsed(true) : props.setIsSidebarCollapsed(false)
	}, [width])

	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const handleLogoutDialogClose = () => {
		setLogoutDialogOpen(false)
	};

	return (
		<>
			<SidebarWrapper id="sidebar" isCollapsed={props.isSidebarCollapsed}>
				<NavIcon isCollapsed={props.isSidebarCollapsed}>
					{props.isSidebarCollapsed ? (
						<SidebarMenuButton isSidebarCollapsed={props.isSidebarCollapsed} setIsSidebarCollapsed={props.setIsSidebarCollapsed} />
					)
						: (
							<>
								<LogoWrapper>
									<LogoImage src={logo1} alt='logo' />
									<LogoLabelMain variant='body1' style={{ fontSize: '30px' }}>
										cactus.ai
									</LogoLabelMain>
								</LogoWrapper>
								<SidebarMenuButton setIsSidebarCollapsed={props.setIsSidebarCollapsed} setIsSidebarOpen={props.setIsSidebarOpen} />
							</>
						)
					}
				</NavIcon>
				{/* {
					!(props.isSidebarCollapsed) && (
						<RadioWrapper>
							<Button
								variant="outlined"
								size='small'
								sx={{
									margin: '4px',
									borderRadius: '10px',
									color: category === 'all' ? '#121B28' : 'white',
									borderColor: category === 'all' ? '#5fe3b3' : 'white',
									backgroundColor: category === 'all' ? '#5fe3b3' : 'transparent',
									'&:hover': {
										color: category === 'all' ? '#121B28' : '#5fe3b3',
										backgroundColor: category === 'all' ? '#5fe3b3' : 'transparent',
										borderColor: category === 'all' ? '#5fe3b3' : '#5fe3b3',
									},
								}}
								onClick={() => setCategory('all')}
							>
								All
							</Button>
							<Button
								variant="outlined"
								size='small'
								sx={{
									margin: '4px',
									borderRadius: '10px',
									color: category === 'food' ? '#121B28' : 'white',
									borderColor: category === 'food' ? '#5fe3b3' : 'white',
									backgroundColor: category === 'food' ? '#5fe3b3' : 'transparent',
									'&:hover': {
										color: category === 'food' ? '#121B28' : '#5fe3b3',
										backgroundColor: category === 'food' ? '#5fe3b3' : 'transparent',
										borderColor: category === 'food' ? '#5fe3b3' : '#5fe3b3',
									},
								}}
								onClick={() => setCategory('food')}
							>
								Food
							</Button>
							<Button
								variant="outlined"
								size='small'
								sx={{
									margin: '4px',
									borderRadius: '10px',
									color: category === 'beverages' ? '#121B28' : 'white',
									borderColor: category === 'beverages' ? '#5fe3b3' : 'white',
									backgroundColor: category === 'beverages' ? '#5fe3b3' : 'transparent',
									'&:hover': {
										color: category === 'beverages' ? '#121B28' : '#5fe3b3',
										backgroundColor: category === 'beverages' ? '#5fe3b3' : 'transparent',
										borderColor: category === 'beverages' ? '#5fe3b3' : '#5fe3b3',
									},
								}}
								onClick={() => setCategory('beverages')}
							>
								Beverages
							</Button>
						</RadioWrapper>
					)
				} */}
				<MenuWrapper>
					<Box width='100%'>
						{SidebarData.filter(item => userInfo.user.userAllowedRoutes.includes(item.path)).map((item, index) => (
							<MenuItem
								item={item}
								key={index}
								setHeaderTitle={props.setHeaderTitle}
								selected={selected}
								setSelected={setSelected}
								isCollapsed={props.isSidebarCollapsed}
							/>
						))}
					</Box>
					<StyledEngineProvider>
						{props.isSidebarCollapsed ? (
							<LogoutIconButton onClick={() => setLogoutDialogOpen(true)}
								disableRipple disableFocusRipple>
								<LogoutOutlinedIcon sx={{ fontSize: '25px', marginRight: '-3px' }} />
							</LogoutIconButton>
						)
							: (
								<LogoutButton variant='text' onClick={() => setLogoutDialogOpen(true)}
									disableRipple disableFocusRipple
									startIcon={<LogoutOutlinedIcon sx={{ fontSize: '25px', marginRight: '-3px' }} />}>
									Logout
								</LogoutButton>
							)
						}
					</StyledEngineProvider>
					<Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose} PaperProps={{ sx: { borderRadius: '12px' } }}>
						<DialogTitle fontFamily='helvetica'>
							Logout
						</DialogTitle>
						<DialogContent>
							<DialogContentText fontFamily='helvetica'>
								Are you sure you want to logout?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button sx={{ fontFamily: 'helvetica', color: '#121B28' }} onClick={handleLogoutDialogClose}> No </Button>
							<Button sx={{ fontFamily: 'helvetica', color: '#121B28' }} onClick={() => logout(navigate)} autoFocus> Yes </Button>
						</DialogActions>
					</Dialog>
				</MenuWrapper>
			</SidebarWrapper>
		</>
	)
}
export default Sidebar