import React, { useState } from 'react';
import { Container, Stepper, Step, StepLabel, Button } from '@mui/material';
import RestaurantForm from './RestaurantForm';
import PosIntegrationForm from './PosIntegrationForm';
import AccountingIntegrationForm from './AccountingIntegrationForm';
import CreateUserForm from './CreateUserForm';
import ConfirmationPage from './ConfirmationPage';

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [tenantId, setTenantId] = useState('')

    const steps = ['Restaurant Details', 'Connect your POS', 'Accounting Integration', 'Create User', 'Confirmation'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setTenantId('')
    };

    const storeTenantId = (tenantId) => {
        setTenantId(tenantId)
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
            {activeStep === 0 && <RestaurantForm nextStep={handleNext} storeTenantId={storeTenantId} />}
            {activeStep === 1 && <PosIntegrationForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId}/>}
            {activeStep === 2 && <AccountingIntegrationForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId}/>}
            {activeStep === 3 && <CreateUserForm nextStep={handleNext} prevStep={handleBack} tenantId={tenantId}/>}
            {activeStep === 4 && <ConfirmationPage handleReset={handleReset} tenantId={tenantId}/>}
            {/* {activeStep > 0 && (
                <Button variant="outlined" onClick={handleReset} style={{ marginTop: '20px' }}>
                    Cancel
                </Button>
            )} */}
        </Container>
    );
};

export default MultiStepForm;
