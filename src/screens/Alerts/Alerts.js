import React, { useContext } from 'react';
import { Paper, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext.js';
import { AlertsContext } from '../../context/AlertsContext.js';

const Alerts = () => {
  const navigate = useNavigate({});
  const { userInfo } = useContext(AuthContext);
  const { alerts, setAlerts } = useContext(AlertsContext);

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Grid item>
        <Paper elevation={3} style={{ background: '#f0f0f0', margin: '10px', padding: '10px' }}>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">Name</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold">Occurrence</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold">Message</Typography>
            </Grid>
            <Grid item container xs={2} justifyContent='center'>
              <Typography variant="subtitle1" fontWeight="bold">Action</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {alerts.map((alert, index) => (
        // <Grid item key={index}>
          <Paper item key={index} elevation={3} style={{ margin: '10px', padding: '10px' }}>
            <Grid container spacing={0} alignItems='center'>
              <Grid item xs={2}>
                <Typography variant="body1" fontWeight="bold">{alert.type}</Typography>
                <Typography variant="body2" color="textSecondary">{alert.name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>{formatDateTime(alert.date)}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{alert.message}</Typography>
              </Grid>
              <Grid item xs={2} container spacing={1} justifyContent="center">
                <Grid item>
                  <Button
                    variant="contained"
                    // color="primary"
                    size="small"
                    onClick={() => navigate(alert.reference)}
                    style={{ marginRight: '5px', backgroundColor: '#47bf93' }}
                  >
                    Action
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Discard
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        // </Grid>
      ))}
    </Grid>
  );
};

export default Alerts;
