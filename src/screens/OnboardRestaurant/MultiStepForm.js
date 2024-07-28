import React, { useState } from 'react';
import { Container, Stepper, Step, StepLabel, Button, Snackbar, Alert } from '@mui/material';
import RestaurantForm from './RestaurantForm';
import PosIntegrationForm from './PosIntegrationForm';
import AccountingIntegrationForm from './AccountingIntegrationForm';
import CreateUserForm from './CreateUserForm';
import ConfirmationPage from './ConfirmationPage';

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [tenantId, setTenantId] = useState('')
    const [tenant, setTenant] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const steps = ['Restaurant Details', 'Connect your POS', 'Accounting Integration', 'Create User', 'Confirmation'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleReset = () => {
        setActiveStep(0);
        setTenantId('')
        setTenant({})
    }

    const storeTenantId = (tenantId) => {
        setTenantId(tenantId)
    }

    const storeTenant = (tenant) => {
        setTenant(tenant)
    }

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true)
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }

    const handleSnackbarMessage = (message) => {
        setSnackbarMessage(message)
    }

    return (
        <Container style={{ padding: '0px', margin: '20px' }}>
            <Stepper activeStep={activeStep} style={{ marginBottom: '20px', marginTop: '20px' }}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 && <RestaurantForm nextStep={handleNext} storeTenantId={storeTenantId} storeTenant={storeTenant} handleSnackbarOpen={handleSnackbarOpen} handleSnackbarMessage={handleSnackbarMessage}/>}
            {activeStep === 1 && <PosIntegrationForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId} handleSnackbarOpen={handleSnackbarOpen} handleSnackbarMessage={handleSnackbarMessage}/>}
            {activeStep === 2 && <AccountingIntegrationForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId} handleSnackbarOpen={handleSnackbarOpen} handleSnackbarMessage={handleSnackbarMessage}/>}
            {activeStep === 3 && <CreateUserForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId} handleSnackbarOpen={handleSnackbarOpen} handleSnackbarMessage={handleSnackbarMessage}/>}
            {activeStep === 4 && <ConfirmationPage handleReset={handleReset} tenantId={tenantId} tenant={tenant} handleSnackbarOpen={handleSnackbarOpen} handleSnackbarMessage={handleSnackbarMessage}/>}
            {/* {activeStep > 0 && (
                <Button variant="outlined" onClick={handleReset} style={{ marginTop: '20px' }}>
                    Cancel
                </Button>
            )} */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default MultiStepForm;
