import React, { useContext, useState, useEffect } from 'react';
import { Paper, Button, Typography, Grid, Chip, Divider, CircularProgress, Box, MenuItem, Select, FormControl } from '@mui/material';
import { SouthRounded, NorthRounded, ImportExportRounded, KeyboardArrowDown } from "@mui/icons-material"
import client from '../../utils/ApiConfig'
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext.js';
import { AlertsContext } from '../../context/AlertsContext.js';
import { sortAlerts } from '../../helpers/sort.js';
import { filterAlerts } from '../../helpers/filter.js';

const Alerts = () => {
  const navigate = useNavigate({})
  const { userInfo } = useContext(AuthContext)
  const { alerts, setAlerts, alertsLoading, setAlertsLoading } = useContext(AlertsContext)
  const [sortOption, setSortOption] = useState('date_descending')
  const [filterByType, setFilterByType] = useState('All')
  const [filterBySeverity, setFilterBySeverity] = useState('All')
  const [filterByTime, setFilterByTime] = useState('All')
  const [filteredAlerts, setFilteredAlerts] = useState([])

  useEffect(() => {
    setAlertsLoading(true)
    const [sortBy, sortOrder] = sortOption.split('_');
    const sorted = sortAlerts(alerts, sortBy, sortOrder);
    const typeFiltered = filterAlerts(sorted, 'type', filterByType);
    const severityFiltered = filterAlerts(typeFiltered, 'severity', filterBySeverity);
    const timeFiltered = filterAlerts(severityFiltered, 'time', filterByTime);
    setFilteredAlerts(timeFiltered)
    setAlertsLoading(false)
  }, [alerts, sortOption, filterByType, filterBySeverity, filterByTime]);

  const toggleSeveritySort = () => {
    const newSortOption = sortOption === 'severity_ascending' ? 'severity_descending' : 'severity_ascending';
    setSortOption(newSortOption);
  };

  const toggleDateSort = () => {
    const newSortOption = sortOption === 'date_ascending' ? 'date_descending' : 'date_ascending';
    setSortOption(newSortOption);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  const getChipColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return { backgroundColor: '#FFCDD2', color: '#FF1744' };
      case 'Medium':
        return { backgroundColor: '#FFE0B2', color: '#FF9100' };
      case 'Low':
        return { backgroundColor: '#F0F4C3', color: '#C0CA33' };
      default:
        return { backgroundColor: '#fff', color: 'black' };
    }
  };

  const handleAction = async (alertType, alertDetails) => {
    try {
      if (alertType == 'Margin_Item' || alertType == 'FoodCost_Item') {
        setAlertsLoading(true)
        const data = { tenantId: userInfo.user.tenant, recipeName: alertDetails.item_name };
        const result = await client.post('/get-recipe', data, {
          headers: { 'Content-Type': 'application/json' },
        })
        if(result.data.success){
          navigate('/menubuilder', { state: { editRecipeData: result.data.recipe } })
        }
        setAlertsLoading(false)
      } else if (alertType == 'Margin_Type') {
        navigate('/margin')
      } else if (alertType == 'FoodCost_Type') {
        navigate('/foodcost')
      } else if (alertType == 'Price_Ingredient') {
        setAlertsLoading(true)
        const data = { invoiceId: alertDetails.invoice_id };
        const result = await client.post('/get-invoice', data, {
          headers: { 'Content-Type': 'application/json' },
        })
        if(result.data.success){
          navigate('/invoices', { state: { selectedInvoice: result.data.invoice } })
        }
        setAlertsLoading(false)
      }
    } catch (error) {
      console.log(`error taking action: ${error}`);
      setAlertsLoading(false)
    }
  }

  return (
    <Grid container direction="column" spacing={0}>
      <Paper elevation={2} style={{ margin: '5px 10px', padding: '10px' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select
                labelId="picker-label"
                value={filterByType}
                onChange={(e) => setFilterByType(e.target.value)}
                style={{ borderRadius: '5px', height: '35px', color: 'gray' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '300px' } } }}
              >
                <MenuItem value="All">Select Alert Type</MenuItem>
                <MenuItem value='Price_Ingredient'>Ingredient Price</MenuItem>
                <MenuItem value='FoodCost_Type'>Type Foodcost</MenuItem>
                <MenuItem value='FoodCost_Item'>Item Foodcost</MenuItem>
                <MenuItem value='Margin_Type'>Type Margin</MenuItem>
                <MenuItem value='Margin_Item'>Item Margin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select
                labelId="picker-label"
                value={filterBySeverity}
                onChange={(e) => setFilterBySeverity(e.target.value)}
                style={{ borderRadius: '5px', height: '35px', color: 'gray' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '300px' } } }}
              >
                <MenuItem value="All">Select Severity</MenuItem>
                <MenuItem value='Low'>Low</MenuItem>
                <MenuItem value='Medium'>Medium</MenuItem>
                <MenuItem value='Critical'>Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select
                labelId="picker-label"
                value={filterByTime}
                onChange={(e) => setFilterByTime(e.target.value)}
                style={{ borderRadius: '5px', height: '35px', color: 'gray' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '300px' } } }}
              >
                <MenuItem value="All">Select Time-period</MenuItem>
                <MenuItem value='today'>Today</MenuItem>
                <MenuItem value='week'>This Week</MenuItem>
                <MenuItem value='month'>This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select
                labelId="picker-label"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ borderRadius: '5px', height: '35px', color: 'gray' }}
                MenuProps={{ PaperProps: { style: { maxHeight: '300px' } } }}
              >
                <MenuItem value="date_descending">Recent First</MenuItem>
                <MenuItem value='date_ascending'>Oldest First</MenuItem>
                <MenuItem value='severity_descending'>Highest Severity</MenuItem>
                <MenuItem value='severity_ascending'>Lowest Severity</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} style={{ background: '#e8e8e8', margin: '5px 10px', padding: '10px' }}>
        <Grid container spacing={0}>
          <Grid item container xs={1.5} alignItems='center' onClick={toggleSeveritySort}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ cursor: 'pointer' }}>Severity</Typography>
            {sortOption === 'severity_ascending' ? (
              <NorthRounded sx={{ color: 'black', fontSize: '15px', stroke: "black", strokeWidth: 1, marginLeft: '5px' }} />
            ) : sortOption === 'severity_descending' ? (
              <SouthRounded sx={{ color: 'black', fontSize: '15px', stroke: "black", strokeWidth: 1, marginLeft: '5px' }} />
            ) : (
              null
            )}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
          </Grid>
          <Grid item container xs={2} alignItems='center' onClick={toggleDateSort}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ cursor: 'pointer' }}>Occurrence</Typography>
            {sortOption === 'date_ascending' ? (
              <NorthRounded sx={{ color: 'black', fontSize: '15px', stroke: "black", strokeWidth: 1, marginLeft: '5px' }} />
            ) : sortOption === 'date_descending' ? (
              <SouthRounded sx={{ color: 'black', fontSize: '15px', stroke: "black", strokeWidth: 1, marginLeft: '5px' }} />
            ) : (
              null
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">Message</Typography>
          </Grid>
          <Grid item xs={0.5}>
          </Grid>
          <Grid item xs={2} container justifyContent='flex-start'>
            <Typography variant="subtitle1" fontWeight="bold">Action</Typography>
          </Grid>
        </Grid>
      </Paper>

      {
        alertsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
            <CircularProgress />
          </Box>
        ) :
          filteredAlerts.length === 0 ? (
            <Typography color="textSecondary" style={{ marginTop: '40px', textAlign: 'center' }}>No alerts to display.</Typography>
          ) : (
            filteredAlerts.map((alert, index) => (
              <Paper item key={index} elevation={2} style={{ margin: '5px 10px', padding: '10px' }}>
                <Grid container spacing={0} alignItems='flex-start' justifyContent='center'>
                  <Grid item xs={1.5}>
                    <Chip
                      label={alert.severity}
                      style={{ ...getChipColor(alert.severity), fontWeight: 'bold', borderRadius: '5px', paddingHorizontal: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1" color="textSecondary" fontWeight="bold">{alert.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography color="textSecondary">{formatDateTime(alert.date)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">{alert.message}</Typography>
                  </Grid>
                  <Grid item xs={0.5}></Grid>
                  <Grid item xs={2} container justifyContent="flex-start">
                    <Button
                      variant="contained"
                      size="small"
                      // onClick={() => navigate(alert.reference)}
                      onClick={() => handleAction(alert.type, alert.details)}
                      style={{ marginRight: '5px', backgroundColor: '#47bf93' }}
                    >
                      Action
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{}}
                    >
                      Discard
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}
    </Grid>
  );
}

export default Alerts;
