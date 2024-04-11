import React, { useContext, useState, useEffect } from 'react';
import SettingsTabs from './SettingsTabs';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig';
import {
    Button,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    Chip,
    ListItemText,
    Checkbox
} from '@mui/material';

const StyledButton = styled(Button)({
    margin: '8px',
});

const CompactTableContainer = styled(TableContainer)({
    maxWidth: '100%',
    margin: 'auto auto',
});

const CompactTableCell = styled(TableCell)({
    padding: '8px',
});

const CompactTableCellHeader = styled(TableCell)({
    padding: '8px',
    fontWeight: 'bold',
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

export const UserManagement = () => {
    const navigate = useNavigate({});
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [nonApprovedUsers, setNonApprovedUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});

    const getApprovedUsers = async () => {
        try {
            setLoading(true);
            const tenantId = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-approved-users', tenantId, {
                headers: { 'Content-Type': 'application/json' },
            });
            setApprovedUsers(result.data.users);
            setLoading(false);
        } catch (error) {
            console.log(`getting approved users error ${error}`);
        }
    };

    const getNonApprovedUsers = async () => {
        try {
            setLoading(true);
            const tenantId = { tenantId: userInfo.user.tenant, status: 'pending_admin_approval' };
            const result = await client.post('/get-nonapproved-users', tenantId, {
                headers: { 'Content-Type': 'application/json' },
            });
            setNonApprovedUsers(result.data.users);
            setLoading(false);
        } catch (error) {
            console.log(`getting non-approved users error ${error}`);
        }
    };

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
        getApprovedUsers();
        getNonApprovedUsers();
        getUserRoles();
    }, []);

    const handleRoleChange = (userId, selectedUserRoles) => {
        setSelectedRoles((prevSelectedRoles) => ({
            ...prevSelectedRoles,
            [userId]: selectedUserRoles,
        }));
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            setLoading(true);
            let data = { userId, rolesAssigned: [], newStatus };
            if (newStatus === 'approved' && (!selectedRoles[userId] || selectedRoles[userId].length === 0)) {
                alert('No roles selected! Choose atleast one.');
                setLoading(false);
                return;
            }
            if (newStatus === 'approved') data = { userId, rolesAssigned: selectedRoles[userId], newStatus };
            const result = await client.post('/update-user-status', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setSelectedRoles((prevSelectedRoles) => ({
                ...prevSelectedRoles,
                [userId]: [],
            }));
            getApprovedUsers();
            getNonApprovedUsers();
            setLoading(false);
        } catch (error) {
            console.log(`updating user status error ${error}`);
            setLoading(false)
        }
    };

    return (
        <div>
            <SettingsTabs />
            <div>
                <Paper elevation={3} style={{ margin: '16px', padding: '10px' }}>
                    <Typography variant="h5" gutterBottom>
                        Users
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <CompactTableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <CompactTableCellHeader>Name</CompactTableCellHeader>
                                    <CompactTableCellHeader>Username</CompactTableCellHeader>
                                    <CompactTableCellHeader>Email</CompactTableCellHeader>
                                    <CompactTableCellHeader>Roles</CompactTableCellHeader>
                                    <CompactTableCellHeader>Actions</CompactTableCellHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {approvedUsers
                                    .filter((user) => userInfo.user.userId !== user._id)
                                    .map((user, index) => (
                                        <TableRow key={index}>
                                            <CompactTableCell>{`${user.firstName} ${user.lastName}`}</CompactTableCell>
                                            <CompactTableCell>{user.username}</CompactTableCell>
                                            <CompactTableCell>{user.email}</CompactTableCell>
                                            <CompactTableCell>
                                                {user.roles.map((role, index) => (
                                                    <Chip label={role.roleName} />
                                                ))}
                                            </CompactTableCell>
                                            <CompactTableCell>
                                                <StyledButton onClick={() => updateUserStatus(user._id, 'pending_admin_approval')} variant='contained'>Non-Approve</StyledButton>
                                                <StyledButton onClick={() => updateUserStatus(user._id, 'declined')} variant='outlined' color='error'>Delete</StyledButton>
                                            </CompactTableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CompactTableContainer>
                </Paper>

                <Paper elevation={3} style={{ margin: '16px', padding: '10px' }}>
                    <Typography variant="h5" gutterBottom>
                        Pending Requests
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <CompactTableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <CompactTableCellHeader>Name</CompactTableCellHeader>
                                    <CompactTableCellHeader>Username</CompactTableCellHeader>
                                    <CompactTableCellHeader>Email</CompactTableCellHeader>
                                    <CompactTableCellHeader>Roles</CompactTableCellHeader>
                                    <CompactTableCellHeader>Actions</CompactTableCellHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nonApprovedUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <CompactTableCell>{`${user.firstName} ${user.lastName}`}</CompactTableCell>
                                        <CompactTableCell>{user.username}</CompactTableCell>
                                        <CompactTableCell>{user.email}</CompactTableCell>
                                        <CompactTableCell>
                                            <FormControl>
                                                <InputLabel>Select Roles</InputLabel>
                                                <Select
                                                    multiple
                                                    label="Select Roles"
                                                    value={selectedRoles[user._id] || []}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    renderValue={(selected) => selected.map((item) => item.roleName).join(', ')}
                                                    style={{ minWidth: '150px', maxWidth: '150px' }}
                                                    MenuProps={MenuProps}
                                                >
                                                    <MenuItem disabled value="">
                                                        <em>Choose atleast one...</em>
                                                    </MenuItem>
                                                    {roles.map((role) => (
                                                        <MenuItem key={role._id} value={role}>
                                                            <Checkbox
                                                                checked={Boolean(selectedRoles[user._id] && selectedRoles[user._id].find(
                                                                    (selectedRole) => selectedRole._id === role._id
                                                                ))}
                                                            />
                                                            {role.roleName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </CompactTableCell>
                                        <CompactTableCell>
                                            <StyledButton onClick={() => updateUserStatus(user._id, 'approved')} variant='contained'>Approve</StyledButton>
                                            <StyledButton onClick={() => updateUserStatus(user._id, 'declined')} variant='outlined' color='error'>Decline</StyledButton>
                                        </CompactTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CompactTableContainer>
                </Paper>
            </div>
        </div>
    );
};

