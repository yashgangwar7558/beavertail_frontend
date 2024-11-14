import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, IconButton, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import Constants from 'expo-constants';
import client from '../../utils/ApiConfig';

const shift4backend = Constants.expoConfig.extra.shiftbackendUrl || "http://localhost:8085";

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

const Shift4Management = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllSubscriptionStatus = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${shift4backend}/app/s4/getAllStatus`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setAllRequests(result.data.subscriptionStatus || []);
    } catch (error) {
      console.log(`Error updating invoice status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSubscriptionStatus();
  }, []);

  const OnboardCustomer = async (guid) => {
    setLoading(true);
    try {
      const data = { guid };
      const result = await client.post(`/create-shift4-tenant`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.success) {
        await getAllSubscriptionStatus();
        alert("Tenant onboarded successfully!");
      }
    } catch (error) {
      console.log(`Onboarding shift4 customer error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const DeboardCustomer = async (tenantId) => {
    setLoading(true);
    try {
      const data = { tenantId };
      const result = await client.post(`/mark-tenant-inactive-shift4`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.success) {
        await getAllSubscriptionStatus();
        alert("Tenant deboarded successfully!");
      }
    } catch (error) {
      console.log(`Deboarding shift4 customer error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const ConfirmOnboarding = async (guid, locationId) => {
    setLoading(true);
    try {
      const data = { guid, locationId };
      const result = await axios.post(`${shift4backend}/app/s4/confirm/install`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.success) {
        await getAllSubscriptionStatus();
        alert("Confirmed customer onboarding!");
      }
    } catch (error) {
      console.log(`Confirming shift4 customer onboarding error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const ConfirmDeboarding = async (locationId) => {
    setLoading(true);
    try {
      const data = { locationId };
      const result = await axios.post(`${shift4backend}/app/s4/confirm/uninstall`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.success) {
        await getAllSubscriptionStatus();
        alert("Confirmed customer deboarding!");
      }
    } catch (error) {
      console.log(`Confirming shift4 customer deboarding error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const DeleteSubscriptionStatus = async (guid, locationId) => {
    setLoading(true);
    try {
      const data = { guid, locationId };
      const result = await axios.post(`${shift4backend}/app/s4/deleteSubscriptionStatus`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (result.data.success) {
        await getAllSubscriptionStatus();
        alert("Deleted customer status!");
      }
    } catch (error) {
      console.log(`Deleting shift4 customer status error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Install Request Box */}
      <StyledPaper elevation={3}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Install Request</Typography>
          <IconButton onClick={() => getAllSubscriptionStatus()} disabled={loading}>
            <RefreshIcon color="primary" />
          </IconButton>
        </div>
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
                      {item.status === 'Install - InProgress' && (
                        <StyledButton onClick={() => OnboardCustomer(item.guid)} style={{ backgroundColor: 'blue' }}>
                          Onboard
                        </StyledButton>
                      )}
                      {item.status === 'Installed' && (
                        <StyledButton onClick={() => ConfirmOnboarding(item.guid, item.locationId)} style={{ backgroundColor: 'green' }}>
                          Confirm
                        </StyledButton>
                      )}
                      {item.status === 'Install - Confirmed' && (
                        <StyledButton style={{ backgroundColor: 'orange' }}>
                          No Action
                        </StyledButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {/* Uninstall Request Box */}
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
                .filter(item => item.status === 'Uninstall' || item.status === 'Uninstalled' || item.status === 'Uninstall - Confirmed')
                .map(item => (
                  <TableRow key={item.guid}>
                    <TableCell>{item.locationId}</TableCell>
                    <TableCell>{item.subscriptionId}</TableCell>
                    <TableCell>{item.guid}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {item.status === 'Uninstall' && (
                        <StyledButton onClick={() => DeboardCustomer(item.tenantId)} style={{ backgroundColor: 'blue' }}>
                          Deboard
                        </StyledButton>
                      )}
                      {item.status === 'Uninstalled' && (
                        <StyledButton onClick={() => ConfirmDeboarding(item.locationId)} style={{ backgroundColor: 'green' }}>
                          Confirm
                        </StyledButton>
                      )}
                      {item.status === 'Uninstall - Confirmed' && (
                        <StyledButton style={{ backgroundColor: 'orange' }}>
                          No Action
                        </StyledButton>
                      )}
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
                      <StyledButton onClick={() => DeleteSubscriptionStatus(item.guid, item.locationId)} style={{ backgroundColor: 'red' }}>
                        Delete Status
                      </StyledButton>
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
