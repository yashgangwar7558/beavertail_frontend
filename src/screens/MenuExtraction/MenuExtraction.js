import React, { useContext, useEffect } from 'react';
import { AlertsContext } from '../../context/AlertsContext.js';
import { Box, Card, CardContent, Typography, Chip, Grid, Button } from '@mui/material';
import dayjs from 'dayjs'; // Import dayjs for date formatting

const statusColorMap = {
  started: 'info',
  in_progress: 'primary',
  completed: 'success',
  failed: 'error',
  reverted: 'warning',
};

const MenuExtraction = () => {
  const { fetchExtractionProcesses, extractionProcesses, retryExtractionProcess, deleteExtractionProcess } = useContext(AlertsContext);

  useEffect(() => {
    fetchExtractionProcesses();
  }, []);

  const handleRetry = (processId, tenantId) => {
    retryExtractionProcess(processId, tenantId);
  };

  const handleRevert = (processId, tenantId) => {
    deleteExtractionProcess(processId, tenantId);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {extractionProcesses.map((process) => (
          <Grid item xs={12} sm={6} md={4} key={process.processId}>
            <Card sx={{ height: '100%', backgroundColor: '#f9f9f9', boxShadow: 3 }}>
              <CardContent>
                {/* Process Tenant Name */}
                <Typography variant="h6" component="div" color="text.primary" sx={{ mb: 1 }}>
                  {process.tenantName}
                </Typography>

                {/* Process ID */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ID: {process.processId}
                </Typography>

                {/* Main Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={process.status.replace('_', ' ').toUpperCase()}
                    variant="outlined"
                    color={statusColorMap[process.status] || 'default'}
                    sx={{
                      borderColor: `${statusColorMap[process.status]}.main`,
                      color: `${statusColorMap[process.status]}.main`,
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      mr: 'auto', // Align to the left
                    }}
                  />
                </Box>

                {/* Sub Status */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                  Process: {process.subStatus}
                </Typography>

                {/* Started At */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                  Started At: {dayjs(process.startedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>

                {/* Completed At - Display only if status is completed */}
                {process.status === 'completed' && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Completed At: {dayjs(process.completedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                )}

                {/* Error if present */}
                {process.error && (
                  <Box sx={{ mt: 1, p: 1, backgroundColor: '#fddede', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="error">
                      Error: {process.error}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ ml: 2 }}
                      onClick={() => handleRetry(process.processId, process.tenantId)}
                    >
                      Retry
                    </Button>
                  </Box>
                )}

                {/* Conditional Buttons */}
                {(process.status === 'completed' || process.status === 'reverted') && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    {process.status === 'completed' && (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleRevert(process.processId, process.tenantId)}
                        sx={{ mr: 2 }} // Margin right for spacing
                      >
                        Revert Extraction
                      </Button>
                    )}

                    {process.status === 'reverted' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleRetry(process.processId, process.tenantId)}
                      >
                        Retry
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuExtraction;
