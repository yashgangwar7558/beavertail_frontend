import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext'
import client from '../utils/ApiConfig'
import io from 'socket.io-client'

export const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAlertsLoading(true)
                const data = {
                    tenantId: userInfo.user.tenant,
                };
                const result = await client.post('/get-alerts', data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                setAlerts(result.data.alerts)
                setAlertsLoading(false)
            } catch (error) {
                setAlertsLoading(false)
                console.log(`getting alerts error ${error}`);
            }
        };

        fetchData();
    }, [userInfo]);

    useEffect(() => {
        const socket = io('http://localhost:8080')

        socket.on('newAlert', (newAlert) => {
            setAlerts(prevAlerts => [newAlert, ...prevAlerts])
            console.log(newAlert);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <AlertsContext.Provider value={{ alerts, setAlerts, alertsLoading, setAlertsLoading }}>
            {children}
        </AlertsContext.Provider>
    );
};