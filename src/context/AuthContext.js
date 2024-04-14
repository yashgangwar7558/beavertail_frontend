import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../utils/ApiConfig'
export const AuthContext = createContext();
// import { useNavigate } from 'react-router'

export const AuthProvider = ({ children }) => {

    // const navigate = useNavigate({});

    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
    const [error, setError] = useState('');

    const register = async (username, password, confirmPassword, firstName, lastName, email, mobileNo, address, rolesAssigned, tenantId, status, navigate) => {
        setIsLoading(true)
        try {
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
                navigate("/");
            } else {
                setError(data.message)
                setIsLoading(false);
            }
        } catch (e) {
            console.log(`register error ${e}`);
            setIsLoading(false);
        }
    }


    const login = async (username, password, navigate) => {
        setIsLoading(true);
        try {
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
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
                setError('')
            } else {
                setError(data.message)
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    const logout = (navigate) => {
        setIsLoading(true);
        client.post(
            '/sign-out',
            {},

            {
                headers: {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            }
        ).then(async (res) => {
            AsyncStorage.removeItem('userInfo');
            setUserInfo({});
            setIsLoading(false);
            setError(null)
            navigate("/");
        })
            .catch(e => {
                console.log(`logout error ${e}`);
                setIsLoading(false);
            });
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);

            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if (userInfo) {
                setUserInfo(userInfo);
            }

            setSplashLoading(false);
        } catch (e) {
            setSplashLoading(false);
            console.log(`is logged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
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