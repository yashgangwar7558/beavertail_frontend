import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
import { Height } from '@mui/icons-material';

// const StyledButtonRed = styled(Button)({
//     margin: '8px',
// });

const StyledButtonTrans = styled(Button)({
  margin: '8px',
  borderRadius: '12px',
});

const StyledButtonFill = styled(Button)({
  margin: '8px',
  color: '#ffffff',
  borderColor: '#47bf93',
  backgroundColor: '#47bf93',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#47bf93', // Prevent background color change on hover
    color: '#ffffff', // Ensure color remains the same on hover
  },
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
      height: 40,
      width: 200,
    },
  },
};

const ManageUsers = (props) => {
  const navigate = useNavigate({});
  const [loading, setLoading] = useState(false);
  const [approvedAdminUsers, setApprovedAdminUsers] = useState([]);
  const [nonApprovedAdminUsers, setNonApprovedAdminUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    props.setHeaderTitle('Manage Users')
  }, [])

  const getApprovedAdminUsers = async () => {
    try {
      setLoading(true);
      const result = await client.post('/get-approved-admin-users', {
        headers: { 'Content-Type': 'application/json' },
      });
      setApprovedAdminUsers(result.data.users);
      setLoading(false);
    } catch (error) {
      console.log(`getting approved users error ${error}`);
    }
  };

  const getNonApprovedAdminUsers = async () => {
    try {
      setLoading(true);
      const result = await client.post('/get-nonapproved-admin-users', {
        headers: { 'Content-Type': 'application/json' },
      });
      setNonApprovedAdminUsers(result.data.users);
      setLoading(false);
    } catch (error) {
      console.log(`getting non-approved admin users error ${error}`);
    }
  }

  const getTenantRoles = async (tenantId) => {
    try {
      setLoading(true);
      const data = { tenantId };
      const result = await client.post('/get-tenant-roles', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRoles(result.data.roles);
      console.log(result.data.roles);
      setLoading(false);
    } catch (error) {
      console.log(`getting user roles error ${error}`);
    }
  };

  useEffect(() => {
    getApprovedAdminUsers();
    getNonApprovedAdminUsers();
  }, []);

  const handleRoleChange = (userId, selectedUserRoles) => {
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      [userId]: selectedUserRoles,
    }));
  };

  const updateUserStatus = async (tenantId, userId, newStatus) => {
    try {
      setLoading(true);
      let data = { tenantId: tenantId, userId, rolesAssigned: [], newStatus };
      if (newStatus === 'approved' && (!selectedRoles[userId] || selectedRoles[userId].length === 0)) {
        alert('No roles selected! Choose atleast one.');
        setLoading(false);
        return;
      }
      if (newStatus === 'approved') data = { tenantId: tenantId, userId, rolesAssigned: selectedRoles[userId], newStatus };
      const result = await client.post('/update-user-status', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSelectedRoles((prevSelectedRoles) => ({
        ...prevSelectedRoles,
        [userId]: [],
      }));
      getApprovedAdminUsers();
      getNonApprovedAdminUsers();
      setLoading(false);
    } catch (error) {
      console.log(`updating user status error ${error}`);
      setLoading(false)
    }
  };

  return (
    <div>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 115px)' }}>
        <Paper elevation={3} style={{ margin: '16px', padding: '10px', borderRadius: '12px' }}>
          <Typography variant="h5" gutterBottom>
            Pending Approval Requests
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <CompactTableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CompactTableCellHeader>Tenant Id</CompactTableCellHeader>
                  <CompactTableCellHeader>Name</CompactTableCellHeader>
                  <CompactTableCellHeader>Username</CompactTableCellHeader>
                  <CompactTableCellHeader>Email</CompactTableCellHeader>
                  <CompactTableCellHeader>Roles</CompactTableCellHeader>
                  <CompactTableCellHeader>Actions</CompactTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {nonApprovedAdminUsers.map((user) => (
                  <TableRow key={user._id}>
                    <CompactTableCell>{user.tenantId}</CompactTableCell>
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
                          onOpen={() => getTenantRoles(user.tenantId)}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          renderValue={(selected) => selected.map((item) => item.roleName).join(', ')}
                          style={{ minWidth: '150px', maxWidth: '150px', height: '50px', borderRadius: '12px' }}
                        >
                          <MenuItem disabled value="">
                            <em>Choose at least one...</em>
                          </MenuItem>
                          {roles && roles.map((role) => (
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
                      <StyledButtonFill onClick={() => updateUserStatus(user.tenantId, user._id, 'approved')} variant='contained'>Approve</StyledButtonFill>
                      <StyledButtonTrans onClick={() => updateUserStatus(user.tenantId, user._id, 'declined')} variant='outlined' color='error'>Decline</StyledButtonTrans>
                    </CompactTableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </CompactTableContainer>
        </Paper>

        <Paper elevation={3} style={{ margin: '16px', padding: '10px', borderRadius: '12px' }}>
          <Typography variant="h5" gutterBottom>
            Approved Admin Users
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <CompactTableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CompactTableCellHeader>Tenant Id</CompactTableCellHeader>
                  <CompactTableCellHeader>Name</CompactTableCellHeader>
                  <CompactTableCellHeader>Username</CompactTableCellHeader>
                  <CompactTableCellHeader>Email</CompactTableCellHeader>
                  <CompactTableCellHeader>Roles</CompactTableCellHeader>
                  <CompactTableCellHeader>Actions</CompactTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedAdminUsers
                  .map((user, index) => (
                    <TableRow key={index}>
                      <CompactTableCell>{user.tenantId}</CompactTableCell>
                      <CompactTableCell>{`${user.firstName} ${user.lastName}`}</CompactTableCell>
                      <CompactTableCell>{user.username}</CompactTableCell>
                      <CompactTableCell>{user.email}</CompactTableCell>
                      <CompactTableCell>
                        {user.roles.map((role, index) => (
                          <Chip label={role.roleName} key={index} style={{ margin: '3px' }} />
                        ))}
                      </CompactTableCell>
                      <CompactTableCell>
                        <StyledButtonFill onClick={() => updateUserStatus(user.tenantId, user._id, 'pending_superadmin_approval')} variant='contained'>Non-Approve</StyledButtonFill>
                        <StyledButtonTrans onClick={() => updateUserStatus(user.tenantId, user._id, 'declined')} variant='outlined' color='error'>Delete</StyledButtonTrans>
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

export default ManageUsers;
