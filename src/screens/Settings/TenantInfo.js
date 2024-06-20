import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig';
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

const StyledButtonTrans = styled(Button)({
  color: '#47bf93',
  borderColor: '#47bf93',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#f2faf7',
    borderColor: '#47bf93',
    color: '#47bf93',
  },
});

const StyledButtonFill = styled(Button)({
  color: '#ffffff',
  borderColor: '#47bf93',
  backgroundColor: '#47bf93',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#47bf93', // Prevent background color change on hover
    color: '#ffffff', // Ensure color remains the same on hover
  },
});

const EditableTextField = styled(TextField)({
  marginBottom: '16px',
});

const EditableChip = styled(Chip)({
  marginRight: '8px',
  marginBottom: '8px',
});

export const TenantInfo = (props) => {
  const { userInfo } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalTenantInfo, setOriginalTenantInfo] = useState({
    tenantName: '',
    tenantDescription: '',
    invoiceEmails: [],
    billEmails: [],
  });
  const [tenantInfo, setTenantInfo] = useState({
    tenantName: '',
    tenantDescription: '',
    invoiceEmails: [],
    billEmails: [],
  });

  useEffect(() => {
    props.setHeaderTitle('Settings')
  }, [])

  const getTenantDetails = async () => {
    try {
      setLoading(true);
      const tenantId = { tenantId: userInfo.user.tenant };
      const result = await client.post('/get-tenant', tenantId, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTenantInfo(result.data.tenant);
      setOriginalTenantInfo(result.data.tenant);
      setLoading(false)
    } catch (error) {
      console.log(`getting tenant details error ${error}`);
    }
  };

  useEffect(() => {
    getTenantDetails();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const result = await client.post('/update-tenant', tenantInfo, {
        headers: { 'Content-Type': 'application/json' },
      });
      // setOriginalTenantInfo({ ...tenantInfo });
      if (result.data.success) {
        getTenantDetails();
        setError(null)
        setIsEditing(false);
        setLoading(false)
      } else {
        setError(result.data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log(`updating tenant details error ${error}`);
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTenantInfo({ ...originalTenantInfo });
    setIsEditing(false);
  };

  const handleEditField = (fieldName, value) => {
    setTenantInfo((prevInfo) => ({
      ...prevInfo,
      [fieldName]: value,
    }));
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
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 115px)' }}>
        <Paper elevation={3} style={{ padding: '10px', margin: '16px', borderRadius: '12px' }}>
          <Typography variant="h5" gutterBottom>
            Restaurant Info
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Brand Name:</strong>{' '}
                {isEditing ? (
                  <EditableTextField
                    fullWidth
                    value={tenantInfo.tenantName}
                    onChange={(e) => handleEditField('tenantName', e.target.value)}
                  />
                ) : (
                  tenantInfo.tenantName
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>Brand Description:</strong>{' '}
                {isEditing ? (
                  <EditableTextField
                    fullWidth
                    multiline
                    rows={4}
                    value={tenantInfo.tenantDescription}
                    onChange={(e) =>
                      handleEditField('tenantDescription', e.target.value)
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
                    <StyledButtonTrans
                      variant="outlined"
                      onClick={() => handleAddEmail('invoiceEmails')}
                    >
                      Add Email
                    </StyledButtonTrans>
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
                    <StyledButtonTrans
                      variant="outlined"
                      onClick={() => handleAddEmail('billEmails')}
                    >
                      Add Email
                    </StyledButtonTrans>
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
          {error && (
            <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
              {error}
            </Typography>
          )}
          {isEditing ? (
            <div style={{ marginTop: '16px' }}>
              <StyledButtonFill
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                style={{ marginRight: '16px' }}
              >
                Save Changes
              </StyledButtonFill>
              <StyledButtonTrans variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </StyledButtonTrans>
            </div>
          ) : (
            <StyledButtonTrans variant="outlined" onClick={handleEdit} style={{ marginTop: '16px' }}>
              Edit
            </StyledButtonTrans>
          )}
        </Paper>
      </div>
    </div>
  );
};
