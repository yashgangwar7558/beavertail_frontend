import React, { useContext, useState, useEffect } from 'react';
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
    Chip
} from '@mui/material';
import { styled } from '@mui/system';
import { AuthContext } from '../../context/AuthContext';

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
        backgroundColor: '#47bf93',
        color: '#ffffff',
    },
});

const EditableTextField = styled(TextField)({
    marginBottom: '16px',
});

export const UserProfile = (props) => {
    const { userInfo } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [originalUserDetails, setOriginalUserDetails] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confNewPassword, setConfNewPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        props.setHeaderTitle('Settings')
    }, [])

    const getUserDetails = async () => {
        try {
            setLoading(true);
            const userId = { userId: userInfo.user.userId };
            const result = await client.post('/get-user', userId, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUserDetails(result.data.user);
            setOriginalUserDetails(result.data.user);
            setLoading(false);
        } catch (error) {
            console.log(`getting user details error ${error}`);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            await client.post('/update-user', userDetails, {
                headers: { 'Content-Type': 'application/json' },
            });
            getUserDetails();
            setIsEditing(false);
            setLoading(false);
        } catch (error) {
            console.log(`updating user details error ${error}`);
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setUserDetails({ ...originalUserDetails });
        setIsEditing(false);
    };

    const handleEditField = (fieldName, value) => {
        setUserDetails((prevInfo) => ({
            ...prevInfo,
            [fieldName]: value,
        }));
    };

    const handleChangePassword = async () => {
        try {
            setLoading(true);
            const data = { userId: userInfo.user.userId, oldPassword, newPassword, confNewPassword };
            const result = await client.post('/change-password', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (result.data.success) {
                setOldPassword('')
                setNewPassword('')
                setConfNewPassword('')
                setError(null)
                setLoading(false)
            } else {
                setError(result.data.message)
                setLoading(false);
            }
        } catch (error) {
            console.log(`updating password error ${error}`);
            setLoading(false);
        }
    };


    return (
        <div>
            <SettingsTabs />
            <div>
                {
                    userDetails != null && (
                        <Paper elevation={3} style={{ padding: '10px', margin: '16px', borderRadius: '12px' }}>
                            <Typography variant="h5" gutterBottom>
                                User Profile
                            </Typography>
                            <Divider style={{ marginBottom: '16px' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>First Name:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.firstName}
                                                onChange={(e) =>
                                                    handleEditField('firstName', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.firstName
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Last Name:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.lastName}
                                                onChange={(e) =>
                                                    handleEditField('lastName', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.lastName
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Username:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.username}
                                                onChange={(e) =>
                                                    handleEditField('username', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.username
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Email:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.email}
                                                onChange={(e) =>
                                                    handleEditField('email', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.email
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Mobile No.:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.mobileNo}
                                                onChange={(e) =>
                                                    handleEditField('mobileNo', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.mobileNo
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Address:</strong>{' '}
                                        {isEditing ? (
                                            <EditableTextField
                                                fullWidth
                                                value={userDetails.address}
                                                onChange={(e) =>
                                                    handleEditField('address', e.target.value)
                                                }
                                            />
                                        ) : (
                                            userDetails.address
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Roles Assigned:</strong>{' '}
                                        {userDetails.roles.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <Chip label={item.roleName} style={{ margin: '3px' }} />
                                            </React.Fragment>
                                        ))}
                                    </Typography>
                                </Grid>
                            </Grid>
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
                    )
                }


                <Paper elevation={3} style={{ padding: '10px', margin: '16px', borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom>
                        Change Password
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="Old Password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                value={confNewPassword}
                                onChange={(e) => setConfNewPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                            {error}
                        </Typography>
                    )}
                    <StyledButtonFill variant="contained" onClick={handleChangePassword} style={{ marginTop: '16px' }}>
                        Change Password
                    </StyledButtonFill>
                </Paper>
            </div>
        </div>
    );
};

