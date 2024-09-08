import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext'
import client from '../utils/ApiConfig'
import io from 'socket.io-client'
import Constants from 'expo-constants'

export const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext)
    const [alerts, setAlerts] = useState([])
    const [alertsLoading, setAlertsLoading] = useState(false);
    const [alertStatus, setAlertStatus] = useState(true)

    const [extractionProcesses, setExtractionProcesses] = useState([])
    const [extractionLoading, setExtractionLoading] = useState(false);

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
        if (userInfo && Object.keys(userInfo).length !== 0) {
            fetchAlerts();
        }
    }, [userInfo, alertStatus])

    const fetchExtractionProcesses = async () => {
        try {
            setExtractionLoading(true)
            const result = await client.post('/get-extraction-processes', {
                headers: { 'Content-Type': 'application/json' },
            })
            setExtractionProcesses(result.data.processes)
            console.log(result.data.processes)

            setExtractionLoading(false)
        } catch (error) {
            setExtractionLoading(false)
            console.log(`getting extraction processes error ${error}`)
        }
    }

    useEffect(() => {
        fetchExtractionProcesses()
    }, [])

    const retryExtractionProcess = async (processId, tenantId) => {
        try {
            const data = { processId: processId, tenantId: tenantId }
            console.log(data);
            
            const result = await client.post('/retry-extraction', data, {
                headers: {
                    'content-type': 'application/json'
                },
            })
            if(!result.data.success) {
                console.log(result.data.message);
            }
        } catch (error) {
            console.log(`getting error retrying extraction process ${error}`)
        }
    }

    const deleteExtractionProcess = async (processId, tenantId) => {
        try {
            const data = { processId: processId, tenantId: tenantId}
            
            const result = await client.post('/delete-extraction', data, {
                headers: {
                    'content-type': 'application/json'
                },
            })
            if(!result.data.success) {
                console.log(result.data.message);
            }
        } catch (error) {
            console.log(`getting error deleting extraction process ${error}`)
        }
    }

    useEffect(() => {
        const socket = io(Constants.expoConfig.extra.backendUrl, {  // https://35.209.240.116:9091 http://localhost:8080
            path: '/socket.io/',
            transports: ['websocket'],
        });

        socket.on('newAlert', (newAlert) => {
            setAlerts(prevAlerts => [newAlert, ...prevAlerts])
        })

        socket.on('newExtractionStatus', (newStatus) => {
            console.log(newStatus);
            setExtractionProcesses((prevProcesses) => {
                return prevProcesses.map((process) => {
                    if (process.processId === newStatus.processId) {
                        return {
                            ...process,
                            status: newStatus.status,
                            subStatus: newStatus.subStatus,
                            startedAt: newStatus.startedAt ? newStatus.startedAt : process.startedAt,
                            completedAt: newStatus.completedAt ? newStatus.completedAt : '',
                            error: newStatus.error ? newStatus.error : ''
                        };
                    }
                    return process;
                });
            });
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
        <AlertsContext.Provider value={{ fetchAlerts, alerts, setAlerts, alertsLoading, setAlertsLoading, alertStatus, setAlertStatus, discardAlert, fetchExtractionProcesses, extractionProcesses, setExtractionProcesses, extractionLoading, setExtractionLoading, retryExtractionProcess, deleteExtractionProcess }}>
            {children}
        </AlertsContext.Provider>
    )
}