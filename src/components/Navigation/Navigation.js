import React, { useContext, useState, useEffect } from 'react';
import { useFonts, Nunito_400Regular, Nunito_500Medium } from '@expo-google-fonts/nunito';
import { AppLoading } from 'expo';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import useWindowDimensions from '../../utils/windowDimensions.js'
import Header from '../global/Header';
import Sidebar from '../global/Sidebar';
import SplashScreen from '../../screens/SplashScreen';
import Dashboard from '../../screens/Dashboard';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import AnalyticsSales from '../../screens/AnalyticsSales';
import AnalyticsPurchases from '../../screens/AnalyticsPurchases';
import Forecast from '../../screens/Forecast';
import MenuBuilder from '../../screens/MenuBuilder';
import MenuItems from '../../screens/MenuItems';
import Ingredients from '../../screens/Ingredients';
import AddInvoice from '../../screens/AddInvoice';
import InvoiceTable from '../../screens/InvoiceTable';
import PurchaseHistory from '../../screens/PurchaseHistory';
import FoodCostCalculator from '../../screens/FoodCostCalculator';
import MarginCalculator from '../../screens/MarginCalculator';
import PosSimulator from '../../screens/PosSimulator';
import Alerts from '../../screens/Alerts';
// import Settings from '../../screens/Settings';
import { UserProfile } from '../../screens/Settings/UserProfile.js';
import { TenantInfo } from '../../screens/Settings/TenantInfo.js';
import { UserManagement } from '../../screens/Settings/UserManagement.js';
import { CreateUser } from '../../screens/Settings/CreateUser.js';
import OnboardRestaurant from '../../screens/OnboardRestaurant';
import ManageRestaurants from '../../screens/ManageRestaurants';
import ManageUsers from '../../screens/ManageUsers';
import PermissionDeniedPage from '../../screens/PermissionDeniedPage';
import NotFoundPage from '../../screens/NotFoundPage';
import { AuthContext } from '../../context/AuthContext.js';
import { AlertsProvider } from '../../context/AlertsContext';
import styled, { ThemeProvider } from 'styled-components';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from 'react-router'
import LoadingScreen from '../LoadingScreen/LoadingScreen.js';
import MenuExtraction from '../../screens/MenuExtraction/MenuExtraction.js';

const Content = styled.main`
    margin: 0;
	  margin-left: ${(props) => props.isSidebarCollapsed ? '50px' : '280px'};
    font-family: Helvetica;
    box-sizing: border-box;
	  background-color: #ffffff;
	  transition: all 0.3s ease-in-out;
	
    @media screen and (max-width: 800px) {
      margin-left: 0;
    }
`

const Navigation = () => {
  const { userInfo, splashLoading, isLoading } = useContext(AuthContext);
  const [headerTitle, setHeaderTitle] = useState(() => {
    const storedTitle = localStorage.getItem('headerTitle');
    return storedTitle || 'Dashboard';
  })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { width, height } = useWindowDimensions()

  useEffect(() => {
    width <= 1024 ? setIsSidebarCollapsed(true) : setIsSidebarCollapsed(false)
  }, [width])

  useEffect(() => {
    localStorage.setItem('headerTitle', headerTitle);
  }, [headerTitle]);

  const allowedRoutes = [
    { path: '/home', component: Dashboard },
    { path: '/analytics-sales', component: AnalyticsSales },
    { path: '/analytics-purchases', component: AnalyticsPurchases },
    { path: '/forecast', component: Forecast },
    { path: '/menubuilder', component: MenuBuilder },
    { path: '/menu', component: MenuItems },
    { path: '/ingredients', component: Ingredients },
    { path: '/add-invoice', component: AddInvoice },
    { path: '/invoices', component: InvoiceTable },
    { path: '/purchasehistory', component: PurchaseHistory },
    { path: '/foodcost', component: FoodCostCalculator },
    { path: '/margin', component: MarginCalculator },
    { path: '/pos-simulator', component: PosSimulator },
    { path: '/alerts', component: Alerts },
    // { path: '/settings', component: Settings },
    { path: '/settings/user-profile', component: UserProfile },
    { path: '/settings/tenant-info', component: TenantInfo },
    { path: '/settings/user-management', component: UserManagement },
    { path: '/settings/create-user', component: CreateUser },
    { path: '/superadmin/onboarding', component: OnboardRestaurant },
    { path: '/superadmin/menu/extraction', component: MenuExtraction },
    { path: '/superadmin/restaurants', component: ManageRestaurants },
    { path: '/superadmin/users', component: ManageUsers },
  ];

  const hasPermissionForRoute = (routePath) => {
    return userInfo.user.userAllowedRoutes.some(route => route === routePath);
  }

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  const renderWebNavigation = () => (
    <Router>
      {splashLoading ? (
        <>
          <Routes>
            <Route path="/loading" element={<SplashScreen />} />
          </Routes>
        </>
      ) : userInfo.token ? (userInfo.user.username == 'Superadmin1' ? (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AlertsProvider>
              <Sidebar setHeaderTitle={setHeaderTitle} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
              <Content isSidebarCollapsed={isSidebarCollapsed}>
                <Header title={headerTitle} setHeaderTitle={setHeaderTitle} username={userInfo.user.username} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
                <Routes>
                  <Route path="/" element={<Navigate to="/superadmin/onboarding" setHeaderTitle={setHeaderTitle} />} />
                  <Route path="/signin" element={<Navigate to="/superadmin/onboarding" setHeaderTitle={setHeaderTitle} />} />
                  {allowedRoutes.map(route => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        hasPermissionForRoute(route.path) ? (
                          <>
                            <route.component setHeaderTitle={setHeaderTitle} />
                          </>
                        ) : (
                          <Navigate to="/permission-denied" replace />
                        )
                      }
                    />
                  ))}
                  <Route path="/permission-denied" element={<PermissionDeniedPage setHeaderTitle={setHeaderTitle} />} />
                  <Route path="*" element={<Navigate to="/page-not-found" setHeaderTitle={setHeaderTitle} />} />
                  <Route path="/page-not-found" element={<NotFoundPage setHeaderTitle={setHeaderTitle} />} />
                </Routes>
              </Content>
            </AlertsProvider>
          </LocalizationProvider>
        </>
      ) : (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AlertsProvider>
              <Sidebar setHeaderTitle={setHeaderTitle} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
              <Content isSidebarCollapsed={isSidebarCollapsed}>
                <Header title={headerTitle} setHeaderTitle={setHeaderTitle} username={userInfo.user.username} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
                <Routes>
                  <Route path="/" element={<Navigate to="/home" setHeaderTitle={setHeaderTitle} />} />
                  <Route path="/signin" element={<Navigate to="/home" setHeaderTitle={setHeaderTitle} />} />
                  {allowedRoutes.map(route => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        hasPermissionForRoute(route.path) ? (
                          <>
                            <route.component setHeaderTitle={setHeaderTitle} />
                          </>
                        ) : (
                          <Navigate to="/permission-denied" replace />
                        )
                      }
                    />
                  ))}
                  <Route path="/permission-denied" element={<PermissionDeniedPage setHeaderTitle={setHeaderTitle} />} />
                  <Route path="*" element={<Navigate to="/page-not-found" setHeaderTitle={setHeaderTitle} />} />
                  <Route path="/page-not-found" element={<NotFoundPage setHeaderTitle={setHeaderTitle} />} />
                </Routes>
              </Content>
            </AlertsProvider>
          </LocalizationProvider>
        </>
      )) : (
        <>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            {allowedRoutes.map(route => (
              <Route key={route.path} path={route.path} element={<Navigate to="/signin" />} />
            ))}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Reroute rest routes to /signin */}
            {/* <Route path="*" element={<Navigate to="/page-not-found" setHeaderTitle=""/>} />
            <Route path="/page-not-found" element={<NotFoundPage setHeaderTitle=""/>} /> */}
          </Routes>
        </>
      )}
    </Router>
  );

  return renderWebNavigation()
};

export default Navigation;

