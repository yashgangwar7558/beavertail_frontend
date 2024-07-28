import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Divider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLink = styled('a')(({ isActive }) => ({
    color: isActive ? '#47bf93' : '#a0a0a0',
    textDecoration: isActive ? 'none' : 'none',
    fontWeight: 'bold',
    cursor: isActive ? 'pointer' : 'not-allowed',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const StyledButton = styled(Button)({
    color: '#ffffff',
    backgroundColor: '#47bf93',
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: '#36a567',
    },
});

const ConfirmationPage = ({ handleReset, tenantId, tenant, handleSnackbarOpen, handleSnackbarMessage }) => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [randomEmail, setRandomEmail] = useState('')
    const [mailSent, setMailSent] = useState(false)

    useEffect(() => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const name = (tenant?.tenantName || 'restaurant').toLowerCase().replace(/\s+/g, '')
        const email = `${name}${randomNumber}@trycatus.ai`
        setRandomEmail(email);
    }, []);

    const handleSendEmail = async () => {
        setMailSent(true)
        setError('')
        handleSnackbarMessage("Onboading details sent to Restaurant Owner")
        handleSnackbarOpen()
    };

    const handleProceed = () => {
        if (mailSent) {
            handleSnackbarMessage("Onboading process completed")
            handleSnackbarOpen()
            handleReset()
        } else {
            setError("Please send confirmation mail to Restaurant")
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Restaurant Onboarded!
            </Typography>
            <Divider style={{ marginBottom: '16px' }} />
            <Typography variant="body1" gutterBottom>
                Congratulations! The restaurant has been successfully onboarded.
            </Typography>
            <Typography variant="body1" gutterBottom>
                A custom email address has been generated for the restaurant: <strong>{randomEmail}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Restaurant can use this mailbox to send invoices and billing details to get them processed automatically.
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <StyledLink
                        onClick={!mailSent ? handleSendEmail : undefined}
                        isActive={!mailSent}>
                        Mail Onboarding Details to Restaurant
                    </StyledLink>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {error && (
                        <Typography variant="body2" color="error" style={{ marginTop: '16px', marginRight: '10px' }}>
                            {error}
                        </Typography>
                    )}
                    <StyledButton variant="contained" onClick={handleProceed}>
                        Proceed
                    </StyledButton>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ConfirmationPage;

