import React, { useContext, useState, useEffect } from 'react';
import client from '../../utils/ApiConfig';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router'
import {
    Container,
    Typography,
    Button,
    TextField,
    Paper,
    Divider,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    ListItemText,
    Checkbox
} from '@mui/material';

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
    fontFamily: 'inherit'
});

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 3;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

const CreateUserForm = ({ nextStep, prevStep, tenantId, handleSnackbarOpen, handleSnackbarMessage }) => {
    const [error, setError] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [mobileNo, setMobileNo] = useState(null)
    const [rolesAssigned, setRolesAssigned] = useState([])
    const [status, setStatus] = useState('approved')

    const getTenantRoles = async (id) => {
        try {
            setLoading(true);
            const tenantId = { tenantId: id }
            const result = await client.post('/get-tenant-roles', tenantId, {
                headers: { 'Content-Type': 'application/json' },
            });
            setRoles(result.data.roles);
            setLoading(false);
        } catch (error) {
            console.log(`getting user roles error ${error}`);
        }
    };

    useEffect(() => {
        getTenantRoles(tenantId)
    }, []);

    const handleBack = async () => {
        prevStep()
    }

    const handleSkip = async () => {
        nextStep()
    }

    const handleCreateUser = async () => {
        try {
            setLoading(true)
            if (rolesAssigned.length == 0) {
                return setError('Choose atleast one role.')
            }
            const data = { username, password, confirmPassword, firstName, lastName, email, mobileNo, address: '', rolesAssigned, tenantId: tenantId, status };
            const result = await client.post('/create-user', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                setError(null)
                setLoading(false)
                handleSnackbarMessage("User created successfully")
                handleSnackbarOpen()
                nextStep()
            } else {
                setError(result.data.message)
                setLoading(false)
            }
        } catch (error) {
            console.log(`creating user error ${error}`);
            setLoading(false);
        }
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Create New User (Optional)
            </Typography>
            <Divider style={{ marginBottom: '16px' }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Mobile Number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl>
                        <InputLabel>Select Roles</InputLabel>
                        <Select
                            multiple
                            label="Select Roles"
                            value={rolesAssigned}
                            onChange={(e) => setRolesAssigned(e.target.value)}
                            renderValue={(selected) => selected.map((item) => item.roleName).join(', ')}
                            style={{ minWidth: '150px', width: '300px' }}
                            MenuProps={MenuProps}
                        >
                            <MenuItem disabled value="">
                                <em>Choose atleast one...</em>
                            </MenuItem>
                            {roles && roles.map((role) => (
                                <MenuItem key={role._id} value={role}>
                                    <Checkbox
                                        checked={Boolean(rolesAssigned && rolesAssigned.find(
                                            (selectedRole) => selectedRole._id === role._id
                                        ))}
                                    />
                                    {role.roleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EditableTextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Grid>
            </Grid>
            {error ? (
                <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                    {error}
                </Typography>
            ) : (
                <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                    * All fields are mandatory.
                </Typography>
            )}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                {/* <StyledButtonTrans variant="outlined" onClick={handleBack} style={{ marginRight: '10px' }}>
                    Back
                </StyledButtonTrans> */}
                <StyledButtonTrans variant="outlined" onClick={handleSkip} style={{ marginRight: '10px' }}>
                    Skip
                </StyledButtonTrans>
                <StyledButtonFill variant="contained" onClick={handleCreateUser} style={{ marginRight: '10px' }}>
                    Next
                </StyledButtonFill>
            </div>
        </Paper>
    )
}

export default CreateUserForm