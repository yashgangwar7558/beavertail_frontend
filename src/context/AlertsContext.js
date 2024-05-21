import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext'
import client from '../utils/ApiConfig'
import io from 'socket.io-client'

export const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext)
    const [alerts, setAlerts] = useState([])
    const [alertsLoading, setAlertsLoading] = useState(false);
    const [alertStatus, setAlertStatus] = useState(true)

    const fetchAlerts = async () => {
        try {
            setAlertsLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                active: alertStatus
            };
            const result = await client.post('/get-alerts', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            setAlerts(result.data.alerts)
            setAlertsLoading(false)
        } catch (error) {
            setAlertsLoading(false)
            console.log(`getting alerts error ${error}`)
        }
    }

    useEffect(() => {
        fetchAlerts();
    }, [userInfo, alertStatus])

    useEffect(() => {
        const socket = io('https://34.134.183.167:9090', {  // https://34.134.183.167:9090 http://localhost:8080
            path: '/socket.io/',
            transports: ['websocket'],
        });

        socket.on('newAlert', (newAlert) => {
            setAlerts(prevAlerts => [newAlert, ...prevAlerts])
            console.log(newAlert)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const discardAlert = async (alertId) => {
        try {
            setAlertsLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                alertId: alertId,
                active: false
            }
            const result = await client.post('/update-active-status', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                await fetchAlerts()
                setAlertsLoading(false)
            }
        } catch (error) {
            setAlertsLoading(false)
            console.log(`updating alert active status error ${error}`)
        }
    }

    return (
        <AlertsContext.Provider value={{ fetchAlerts, alerts, setAlerts, alertsLoading, setAlertsLoading, alertStatus, setAlertStatus, discardAlert }}>
            {children}
        </AlertsContext.Provider>
    )
}