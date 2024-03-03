import React, { useState, useContext } from 'react';
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

const StyledButton = styled(Button)({
    
});

const EditableTextField = styled(TextField)({
    marginBottom: '16px',
});

export const UserProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(userInfo.user);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedUser(userInfo.user);
        setIsEditing(false);
    };

    const handleChangePassword = () => {
        // Implement password change logic
    };

    const handleInputChange = (field, value) => {
        setEditedUser((prevUser) => ({
            ...prevUser,
            [field]: value,
        }));
    };

    return (
        <div>
            <SettingsTabs />
            <div>
                <Paper elevation={3} style={{ padding: '10px', margin: '16px' }}>
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
                                        value={editedUser.firstName}
                                        onChange={(e) =>
                                            handleInputChange('firstName', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.firstName
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Last Name:</strong>{' '}
                                {isEditing ? (
                                    <EditableTextField
                                        fullWidth
                                        value={editedUser.firstName}
                                        onChange={(e) =>
                                            handleInputChange('lastName', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.lastName
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Username:</strong>{' '}
                                {isEditing ? (
                                    <EditableTextField
                                        fullWidth
                                        value={editedUser.email}
                                        onChange={(e) =>
                                            handleInputChange('username', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.username
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Email:</strong>{' '}
                                {isEditing ? (
                                    <EditableTextField
                                        fullWidth
                                        value={editedUser.email}
                                        onChange={(e) =>
                                            handleInputChange('email', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.email
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Mobile No.:</strong>{' '}
                                {isEditing ? (
                                    <EditableTextField
                                        fullWidth
                                        value={editedUser.mobileNo}
                                        onChange={(e) =>
                                            handleInputChange('mobileNo', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.mobileNo
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Address:</strong>{' '}
                                {isEditing ? (
                                    <EditableTextField
                                        fullWidth
                                        value={editedUser.mobileNo}
                                        onChange={(e) =>
                                            handleInputChange('address', e.target.value)
                                        }
                                    />
                                ) : (
                                    editedUser.address
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Roles Assigned:</strong>{' '}
                                {editedUser.roles.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Chip label={item.roleName}/>
                                        {/* {index < editedUser.roles.length - 1 && ', '} */}
                                    </React.Fragment>
                                ))}
                            </Typography>
                        </Grid>
                    </Grid>
                    {isEditing ? (
                        <div style={{ marginTop: '16px' }}>
                            <StyledButton
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChanges}
                                style={{ marginRight: '16px' }}
                            >
                                Save Changes
                            </StyledButton>
                            <StyledButton variant="outlined" onClick={handleCancelEdit}>
                                Cancel
                            </StyledButton>
                        </div>
                    ) : (
                        <StyledButton variant="outlined" onClick={handleEdit} style={{ marginTop: '16px' }}>
                            Edit
                        </StyledButton>
                    )}
                </Paper>
                <Paper elevation={3} style={{ padding: '10px', margin: '16px' }}>
                    <Typography variant="h5" gutterBottom>
                        Change Password
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="Previous Password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="New Password"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <EditableTextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                            />
                        </Grid>
                    </Grid>
                    <StyledButton variant="contained" color="primary" onClick={handleChangePassword} style={{ marginTop: '16px' }}>
                        Change Password
                    </StyledButton>
                </Paper>
            </div>
        </div>
    );
};

