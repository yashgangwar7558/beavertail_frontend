import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { cancelAllRequests, createLogoutApi } from '../utils/ApiConfig'
import { useNavigate } from 'react-router-dom'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
    const [error, setError] = useState('')
    // const navigate = useNavigate()

    const register = async (username, password, confirmPassword, firstName, lastName, email, mobileNo, address, rolesAssigned, tenantId, status, navigate) => {
        setIsLoading(true)
        try {
            if (username.includes(' ')) {
                setError('Username cannot contain spaces!')
                setIsLoading(false)
                return
            }
            if (password.includes(' ')) {
                setError('Password cannot contain spaces!')
                setIsLoading(false)
                return
            }
            if (confirmPassword.includes(' ')) {
                setError('Confirm Password cannot contain spaces!')
                setIsLoading(false)
                return
            }
            const { data } = await client.post(
                '/create-user',
                {
                    username,
                    password,
                    confirmPassword,
                    firstName,
                    lastName,
                    email,
                    mobileNo,
                    address,
                    rolesAssigned,
                    tenantId,
                    status
                },
                {
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                    }
                }
            );

            if (data.success) {
                let userInfo = data;
                setIsLoading(false);
                setError('')
                navigate("/signin");
            } else {
                setError(data.message)
                setIsLoading(false);
            }
        } catch (e) {
            console.log(`register error ${e}`);
            setIsLoading(false);
        }
    }

    const logout = async (navigate) => {
        try {
            cancelAllRequests()

            setIsLoading(true)
            let UserInfo = await AsyncStorage.getItem('userInfo')
            UserInfo = JSON.parse(UserInfo)
            const logoutApi = createLogoutApi()
            const { data } = await logoutApi.post(
                '/sign-out',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${UserInfo?.token}`
                    }
                }
            )

            if (data.success) {
                console.log(data.message);

                const timeoutId = JSON.parse(sessionStorage.getItem('timeoutId'))
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    sessionStorage.removeItem('timeoutId')
                }

                await AsyncStorage.removeItem('userInfo')
                setUserInfo({})
                setIsLoading(false)
                setError(null)
                window.location.href = "/signin"
            } else {
                console.log(data.message)
                if (data.error == 'TokenExpiredError') {
                    await AsyncStorage.removeItem('userInfo')
                    setUserInfo({})
                    setIsLoading(false)
                    setError(null)
                    window.location.href = "/signin"
                }
            }
        } catch (e) {
            console.log(`logout error ${e}`);
            setIsLoading(false);
        }
    }

    const handleStorageChange = async (event) => {
        if (event.key === 'userInfo' && !event.newValue) {
            if (event.key === 'userInfo' && !event.newValue) {
                const timeoutId = JSON.parse(sessionStorage.getItem('timeoutId'));
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    sessionStorage.removeItem('timeoutId')
                    cancelAllRequests()
                    window.location.href = "/signin"
                }
            }
        }
    }

    const login = async (username, password, navigate) => {
        
        setIsLoading(true);
        try {
            if (username.includes(' ')) {
                setError('Invalid Username!')
                setIsLoading(false)
                return
            }
            if (password.includes(' ')) {
                setError('Invalid Password!')
                setIsLoading(false)
                return
            }
            const { data } = await client.post(
                '/sign-in',
                {
                    username,
                    password,
                },
                {
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                    }
                }
            );

            if (data.success) {
                let userInfo = data;
                await setUserInfo(userInfo);
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
                const decodedToken = jwtDecode(userInfo.token);
                const expirationTime = decodedToken.exp * 1000 - Date.now() - 60000;
                if (expirationTime > 0) {
                    const timeoutId = setTimeout(() => {
                        alert('Session expired. Please Relogin!');
                        logout();
                    }, expirationTime);
                    await sessionStorage.setItem('timeoutId', JSON.stringify(timeoutId));
                }

                setIsLoading(false);
                setError('')
            } else {
                setError(data.message)
                setIsLoading(false);
            }
        } catch (e) {
            console.log(`logging in error ${e}`);
            setIsLoading(false);
        }
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);

            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userInfo) {
                setUserInfo(userInfo);

                const decodedToken = jwtDecode(userInfo.token);
                const expirationTime = decodedToken.exp * 1000 - Date.now() - 60000;
                if (expirationTime > 0) {
                    const timeoutId = setTimeout(() => {
                        alert('Session expired. Please Relogin!')
                        logout()
                    }, expirationTime)
                    await sessionStorage.setItem('timeoutId', JSON.stringify(timeoutId))
                } else {
                    alert('Session expired. Please Relogin!')
                    logout();
                }
            }

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(`is logged in error ${e}`);
        }
    }

    useEffect(() => {
        isLoggedIn()
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                error,
                setError,
                register,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};