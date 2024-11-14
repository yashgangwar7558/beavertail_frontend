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
    backgroundColor: '#47bf93',
    color: '#ffffff',
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

const ManageRestaurants = (props) => {
  const navigate = useNavigate({});
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    props.setHeaderTitle('Manage Restaurants')
  }, [])

  const getTenants = async () => {
    try {
      setLoading(true);
      const result = await client.post('/get-all-tenants-active-inactive', {
        headers: { 'Content-Type': 'application/json' },
      });
      setTenants(result.data.tenants);
      setLoading(false);
    } catch (error) {
      console.log(`getting tenants error ${error}`);
    }
  };

  useEffect(() => {
    getTenants();
  }, []);

  const markTenantActive = async (tenantId) => {
    try {
      setLoading(true);
      let data = { tenantId: tenantId };
      const result = await client.post('/mark-tenant-active', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      getTenants();
      setLoading(false);
    } catch (error) {
      console.log(`updating tenant status active error ${error}`);
      setLoading(false)
    }
  }

  const markTenantInactive = async (tenantId) => {
    try {
      setLoading(true);
      let data = { tenantId: tenantId };
      const result = await client.post('/mark-tenant-inactive', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      getTenants();
      setLoading(false);
    } catch (error) {
      console.log(`updating tenant status inactive error ${error}`);
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 115px)' }}>
        <Paper elevation={3} style={{ margin: '16px', padding: '10px', borderRadius: '12px' }}>
          <Typography variant="h5" gutterBottom>
            Active Restaurants
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <CompactTableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CompactTableCellHeader>Restaurant Name</CompactTableCellHeader>
                  <CompactTableCellHeader>Contact</CompactTableCellHeader>
                  <CompactTableCellHeader>Location</CompactTableCellHeader>
                  <CompactTableCellHeader>City</CompactTableCellHeader>
                  <CompactTableCellHeader>State</CompactTableCellHeader>
                  <CompactTableCellHeader>Action</CompactTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants
                  .filter((item) => item.isActive)
                  .map((item) => (
                    <TableRow key={item._id}>
                      <CompactTableCell>{item.tenantName}</CompactTableCell>
                      <CompactTableCell>{item.contact?.email || 'N/A'}</CompactTableCell>
                      <CompactTableCell>{item.address}</CompactTableCell>
                      <CompactTableCell>{item.city}</CompactTableCell>
                      <CompactTableCell>{item.state}</CompactTableCell>
                      <CompactTableCell>
                        <StyledButtonFill
                          onClick={() => markTenantInactive(item._id)}
                          variant="contained"
                        >
                          Deactivate
                        </StyledButtonFill>
                      </CompactTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CompactTableContainer>
        </Paper>

        <Paper elevation={3} style={{ margin: '16px', padding: '10px', borderRadius: '12px' }}>
          <Typography variant="h5" gutterBottom>
            Inactive Restaurants
          </Typography>
          <Divider style={{ marginBottom: '16px' }} />
          <CompactTableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CompactTableCellHeader>Restaurant Name</CompactTableCellHeader>
                  <CompactTableCellHeader>Contact</CompactTableCellHeader>
                  <CompactTableCellHeader>Location</CompactTableCellHeader>
                  <CompactTableCellHeader>City</CompactTableCellHeader>
                  <CompactTableCellHeader>State</CompactTableCellHeader>
                  <CompactTableCellHeader>Action</CompactTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants
                  .filter((item) => !item.isActive)
                  .map((item) => (
                    <TableRow key={item._id}>
                      <CompactTableCell>{item.tenantName}</CompactTableCell>
                      <CompactTableCell>{item.contact?.email || 'N/A'}</CompactTableCell>
                      <CompactTableCell>{item.address}</CompactTableCell>
                      <CompactTableCell>{item.city}</CompactTableCell>
                      <CompactTableCell>{item.state}</CompactTableCell>
                      <CompactTableCell>
                        <StyledButtonFill
                          onClick={() => markTenantActive(item._id)}
                          variant="contained"
                        >
                          Activate
                        </StyledButtonFill>
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

export default ManageRestaurants;
