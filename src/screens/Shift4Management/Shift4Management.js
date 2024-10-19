import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, styled } from '@mui/material';
import axios from 'axios'
import Constants from 'expo-constants'
import client from '../../utils/ApiConfig'

const shift4backend = Constants.expoConfig.extra.shiftbackendUrl || "http://localhost:8085"

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: '16px',
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.success.main,
  color: '#fff',
  padding: '6px 12px',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

const StyledButtonConfirm = styled(Button)(({ theme }) => ({
  margin: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.success.dark,
  color: '#fff',
  padding: '6px 12px',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.success.light,
  },
}));

const Shift4Management = () => {

  const [allRequests, setAllRequests] = useState([])
  const [loading, setLoading] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState({ onboard: false, deboard: false });

  const getAllSubscriptionStatus = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const result = await axios.post(`${shift4backend}/app/s4/getAllStatus`, {
        headers: { 'Content-Type': 'application/json' },
      })
      setAllRequests(result.data.subscriptionStatus)
    } catch (error) {
      console.log(`updating invoice status error ${error}`)
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSubscriptionStatus();
  }, []);

  const OnboardCustomer = async (guid) => {
    setLoading(true);
    try {
      setLoading(true);
      const data = {
        guid: guid
      }
      const result = await client.post(`/create-shift4-tenant`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.data.success) {
        setLoading(false)
        await getAllSubscriptionStatus()
        alert("Tenant onboarded successfully!")
      }
    } catch (error) {
      console.log(`onboarding shift4 customer error: ${error}`)
      setLoading(false);
    }
  };

  const DeboardCustomer = async (tenantId) => {
    setLoading(true);
    try {
      setLoading(true);
      const data = {
        tenantId: tenantId
      }
      const result = await client.post(`/mark-tenant-inactive`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.data.success) {
        setLoading(false)
        await getAllSubscriptionStatus()
        alert("Tenant deboarded successfully!")
      }
    } catch (error) {
      console.log(`deboarding shift4 customer error: ${error}`)
      setLoading(false);
    }
  }

  const ConfirmOnboarding = async (guid, locationId) => {
    setLoading(true);
    try {
      setLoading(true);
      const data = {
        guid: guid,
        locationId: locationId
      }
      const result = await axios.post(`${shift4backend}/app/s4/confirm/install`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.data.success) {
        setLoading(false)
        await getAllSubscriptionStatus()
        alert("Confirmed customer onboarding!")
      }
    } catch (error) {
      console.log(`confirming shift4 customer error: ${error}`)
      setLoading(false);
    }
  }

  const ConfirmDeboarding = async (locationId) => {
    setLoading(true);
    try {
      setLoading(true);
      const data = {
        locationId: locationId
      }
      const result = await axios.post(`${shift4backend}/app/s4/confirm/uninstall`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.data.success) {
        setLoading(false)
        await getAllSubscriptionStatus()
        alert("Confirmed customer deboarding!")
      }
    } catch (error) {
      console.log(`confirming shift4 customer error: ${error}`)
      setLoading(false);
    }
  }

  const DeleteSubscriptonStatus = async (guid, locationId) => {
    setLoading(true);
    try {
      setLoading(true);
      const data = {
        guid: guid,
        locationId: locationId
      }
      const result = await axios.post(`${shift4backend}/app/s4/deleteSubscriptionStatus`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.data.success) {
        setLoading(false)
        await getAllSubscriptionStatus()
        alert("Deleted customer status!")
      }
    } catch (error) {
      console.log(`deleting shift4 customer status error: ${error}`)
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Onboard Request Box */}
      <StyledPaper elevation={3}>
        <Typography variant="h6">Install Request</Typography>
        <Divider style={{ marginBottom: '16px' }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Location Id</TableCell>
                <TableCell>Subscription Id</TableCell>
                <TableCell>Guid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRequests
                .filter(item => item.status === 'Install - InProgress' || item.status === 'Installed' || item.status === 'Install - Confirmed')
                .map(item => (
                  <TableRow key={item.guid}>
                    <TableCell>{item.locationId}</TableCell>
                    <TableCell>{item.subscriptionId}</TableCell>
                    <TableCell>{item.guid}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <>
                        {item.status === 'Install - InProgress' && (
                          <StyledButton
                            onClick={() => OnboardCustomer(item.guid)}
                            style={{ backgroundColor: 'blue' }}
                          >
                            Onboard
                          </StyledButton>
                        )}
                        {item.status === 'Installed' && (
                          <StyledButton
                            onClick={() => ConfirmOnboarding(item.guid, item.locationId)}
                            style={{ backgroundColor: 'green' }}
                          >
                            Confirm
                          </StyledButton>
                        )}
                        {item.status === 'Install - Confirmed' && (
                          <StyledButton
                            style={{ backgroundColor: 'orange' }}
                          >
                            No Action
                          </StyledButton>
                        )}
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {/* Deboard Request Box */}
      <StyledPaper elevation={3}>
        <Typography variant="h6">Uninstall Request</Typography>
        <Divider style={{ marginBottom: '16px' }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Location Id</TableCell>
                <TableCell>Subscription Id</TableCell>
                <TableCell>Guid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRequests
                .filter(item => item.status === 'Uninstall' || item.status === 'Uninstalled' || item.status === 'Uninstall - Confirmed') // Filter requests where status is either 'Install - InProgress' or 'Install - Confirmed'
                .map(item => (
                  <TableRow key={item.guid}>
                    <TableCell>{item.locationId}</TableCell>
                    <TableCell>{item.subscriptionId}</TableCell>
                    <TableCell>{item.guid}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <>
                        {item.status === 'Uninstall' && (
                          <StyledButton
                            onClick={() => DeboardCustomer(item.tenantId)}
                            style={{ backgroundColor: 'blue' }}
                          >
                            Deboard
                          </StyledButton>
                        )}
                        {item.status === 'Uninstalled' && (
                          <StyledButton
                            onClick={() => ConfirmDeboarding(item.locationId)}
                            style={{ backgroundColor: 'green' }}
                          >
                            Confirm
                          </StyledButton>
                        )}
                        {item.status === 'Uninstall - Confirmed' && (
                          <StyledButton
                            style={{ backgroundColor: 'orange' }}
                          >
                            No Action
                          </StyledButton>
                        )}
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {/* Cancel Request Box */}
      <StyledPaper elevation={3}>
        <Typography variant="h6">Cancel Request</Typography>
        <Divider style={{ marginBottom: '16px' }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Location Id</TableCell>
                <TableCell>Subscription Id</TableCell>
                <TableCell>Guid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRequests
                .filter(item => item.status === 'Cancelled')
                .map(item => (
                  <TableRow key={item.guid}>
                    <TableCell>{item.locationId}</TableCell>
                    <TableCell>{item.subscriptionId}</TableCell>
                    <TableCell>{item.guid}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <>
                        <StyledButton
                          onClick={() => DeleteSubscriptonStatus(item.guid, item.locationId)}
                          style={{ backgroundColor: 'red' }}
                        >
                          Delete
                        </StyledButton>
                      </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>
    </div>
  );
};

export default Shift4Management;
