import React, { useContext, useState, useEffect } from 'react';
import client from '../../utils/ApiConfig';
import SettingsTabs from './SettingsTabs';
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

const StyledButtonFill = styled(Button)({
    color: '#ffffff',
    borderColor: '#47bf93',
    backgroundColor: '#47bf93',
    '&:hover': {
        backgroundColor: '#47bf93', // Prevent background color change on hover
        color: '#ffffff', // Ensure color remains the same on hover
    },
});

const EditableTextField = styled(TextField)({
    marginBottom: '16px',
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

export const CreateUser = () => {
    const navigate = useNavigate({});
    const { userInfo, register, error, setError } = useContext(AuthContext);
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

    const getUserRoles = async () => {
        try {
            setLoading(true);
            const tenantId = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-all-roles', tenantId, {
                headers: { 'Content-Type': 'application/json' },
            });
            setRoles(result.data.roles);
            setLoading(false);
        } catch (error) {
            console.log(`getting user roles error ${error}`);
        }
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    const handleCreateUser = async () => {
        try {
            setLoading(true)
            if (rolesAssigned.length == 0) {
                return setError('Choose atleast one role.')
            }
            const data = {username, password, confirmPassword, firstName, lastName, email, mobileNo, address: '', rolesAssigned, tenantId: userInfo.user.tenant, status};
            const result = await client.post('/create-user', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                navigate('/settings/user-management')
                setError(null)
                setLoading(false)
            } else {
                setError(result.data.message)
                setLoading(false);
            }
        } catch (error) {
            console.log(`creating user error ${error}`);
            setLoading(false);
        }
    }

    return (
        <div>
            <SettingsTabs />
            <div>
                <Paper elevation={3} style={{ padding: '10px', margin: '16px' }}>
                    <Typography variant="h5" gutterBottom>
                        Create New User
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
                                    {roles.map((role) => (
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
                    {error && (
                        <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                            {error}
                        </Typography>
                    )}
                    <StyledButtonFill variant="contained" onClick={handleCreateUser} style={{ marginTop: '16px' }}>
                        Create User
                    </StyledButtonFill>
                </Paper>
            </div>
        </div>
    )
}
