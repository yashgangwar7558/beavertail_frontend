import React, { useState } from 'react';
import SettingsTabs from './SettingsTabs';
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';

const EditableTextField = styled(TextField)({
  marginBottom: '16px',
});

const EditableChip = styled(Chip)({
  marginRight: '8px',
  marginBottom: '8px',
});

export const TenantInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tenantInfo, setTenantInfo] = useState({
    tenantName: 'Sample Tenant',
    tenantDescription: 'This is a sample description.',
    invoiceEmails: ['invoice@example.com'],
    billEmails: ['bill@example.com'],
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // You would typically send an API request to update the data here
  };

  const handleCancelEdit = () => {
    // Reset the tenantInfo to original state
    setTenantInfo({
      tenantName: 'Sample Tenant',
      tenantDescription: 'This is a sample description.',
      invoiceEmails: ['invoice@example.com'],
      billEmails: ['bill@example.com'],
    });
    setIsEditing(false);
  };

  const handleAddEmail = (type) => {
    setTenantInfo((prevInfo) => ({
      ...prevInfo,
      [type]: [...prevInfo[type], ''],
    }));
  };

  const handleEditEmail = (type, index, value) => {
    setTenantInfo((prevInfo) => {
      const updatedEmails = [...prevInfo[type]];
      updatedEmails[index] = value;
      return {
        ...prevInfo,
        [type]: updatedEmails,
      };
    });
  };

  const handleDeleteEmail = (type, index) => {
    setTenantInfo((prevInfo) => {
      const updatedEmails = [...prevInfo[type]];
      updatedEmails.splice(index, 1);
      return {
        ...prevInfo,
        [type]: updatedEmails,
      };
    });
  };

  return (
    <div>
      <SettingsTabs />
      <div>
        <Paper elevation={3} style={{ padding: '10px', margin: '16px' }}>
          <Typography variant="h5" gutterBottom>
            Tenant Information
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Tenant Name:</strong>{' '}
                {isEditing ? (
                  <EditableTextField
                    fullWidth
                    value={tenantInfo.tenantName}
                    onChange={(e) => handleEditEmail('tenantName', 0, e.target.value)}
                  />
                ) : (
                  tenantInfo.tenantName
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Tenant Description:</strong>{' '}
                {isEditing ? (
                  <EditableTextField
                    fullWidth
                    multiline
                    rows={4}
                    value={tenantInfo.tenantDescription}
                    onChange={(e) =>
                      handleEditEmail('tenantDescription', 0, e.target.value)
                    }
                  />
                ) : (
                  tenantInfo.tenantDescription
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Invoice Emails:</strong>{' '}
                {isEditing ? (
                  <>
                    {tenantInfo.invoiceEmails.map((email, index) => (
                      <EditableChip
                        key={index}
                        label={
                          <EditableTextField
                            fullWidth
                            value={email}
                            onChange={(e) =>
                              handleEditEmail('invoiceEmails', index, e.target.value)
                            }
                          />
                        }
                        onDelete={() => handleDeleteEmail('invoiceEmails', index)}
                      />
                    ))}
                    <Button
                      variant="outlined"
                      onClick={() => handleAddEmail('invoiceEmails')}
                    >
                      Add Email
                    </Button>
                  </>
                ) : (
                  <>
                    {tenantInfo.invoiceEmails.map((email, index) => (
                      <Chip key={index} label={email} style={{ marginRight: '8px' }} />
                    ))}
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Bill Emails:</strong>{' '}
                {isEditing ? (
                  <>
                    {tenantInfo.billEmails.map((email, index) => (
                      <EditableChip
                        key={index}
                        label={
                          <EditableTextField
                            fullWidth
                            value={email}
                            onChange={(e) =>
                              handleEditEmail('billEmails', index, e.target.value)
                            }
                          />
                        }
                        onDelete={() => handleDeleteEmail('billEmails', index)}
                      />
                    ))}
                    <Button
                      variant="outlined"
                      onClick={() => handleAddEmail('billEmails')}
                    >
                      Add Email
                    </Button>
                  </>
                ) : (
                  <>
                    {tenantInfo.billEmails.map((email, index) => (
                      <Chip key={index} label={email} style={{ marginRight: '8px' }} />
                    ))}
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
          {isEditing ? (
            <div style={{ marginTop: '16px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                style={{ marginRight: '16px' }}
              >
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outlined" onClick={handleEdit} style={{ marginTop: '16px' }}>
              Edit
            </Button>
          )}
        </Paper>
      </div>
    </div>
  );
};

