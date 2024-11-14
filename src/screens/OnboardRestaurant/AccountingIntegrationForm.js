import React, { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig';
import {
    Typography,
    TextField,
    Paper,
    Divider,
    Grid,
    Button,
    styled,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import accountlogo1 from '../../assets/logo/accountlogo1.webp'
import accountlogo2 from '../../assets/logo/accountlogo2.webp'
import accountlogo3 from '../../assets/logo/accountlogo3.webp'
import accountlogo4 from '../../assets/logo/accountlogo4.webp'
import accountlogo5 from '../../assets/logo/accountlogo5.webp'
import accountlogo6 from '../../assets/logo/accountlogo6.webp'
import accountlogo7 from '../../assets/logo/accountlogo7.webp'
import accountlogo8 from '../../assets/logo/accountlogo8.webp'

const StyledButtonTrans = styled(Button)({
    color: '#47bf93',
    borderColor: '#47bf93',
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: '#f2faf7',
        borderColor: '#47bf93',
        color: '#47bf93',
    },
});

const StyledButtonFill = styled(Button)({
    color: '#ffffff',
    borderColor: '#47bf93',
    backgroundColor: '#47bf93',
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: '#47bf93',
        color: '#ffffff',
    },
});

const posOptions = [
    { name: 'Intuit', logo: accountlogo1, description: 'Best-in-breed, holistic, end-to-end', fields: [{ label: 'API Name', key: 'posName', value: '' }, { label: 'Account Id', key: 'posId', value: '' }, { label: 'Account Key', key: 'identifier', value: '' }] },
    { name: 'Sage', logo: accountlogo2, description: 'Description for POS 2', fields: [{ label: 'Access Token', value: '' }] },
    { name: 'AccountEdge', logo: accountlogo3, description: 'Description for POS 3', fields: [{ label: 'Client ID', value: '' }, { label: 'Client Secret', value: '' }, { label: 'Endpoint URL', value: '' }] },
    { name: 'Compeat', logo: accountlogo4, description: 'Description for POS 6', fields: [{ label: 'ID', value: '' }, { label: 'Secret Key', value: '' }] },
    { name: 'M3', logo: accountlogo5, description: 'Description for POS 4', fields: [{ label: 'Key', value: '' }, { label: 'Secret', value: '' }] },
    { name: 'Netsuite', logo: accountlogo6, description: 'Description for POS 5', fields: [{ label: 'Token', value: '' }] },
    { name: 'Restaurant365', logo: accountlogo7, description: 'Description for POS 6', fields: [{ label: 'ID', value: '' }, { label: 'Secret Key', value: '' }] },
    // { name: 'DataPlus', logo: accountlogo8, description: 'Description for POS 6', fields: [{ label: 'ID', value: '' }, { label: 'Secret Key', value: '' }] },
];

const AccountingIntegrationForm = ({ nextStep, prevStep, tenantId, handleSnackbarOpen, handleSnackbarMessage }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPos, setSelectedPos] = useState(null);
    const [inputValues, setInputValues] = useState({});

    const handlePosSelection = (pos) => {
        setError(null)
        setSelectedPos(pos);
        
        // const initialValues = pos.fields.reduce((acc, field) => {
        //     acc[field.key] = field.value;
        //     return acc;
        // }, {});
        // initialValues['tenantId'] = tenantId
        // setInputValues(initialValues);
    };

    const handleInputChange = (key, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleSkip = () => {
        nextStep();
    }

    const handleBack = async () => {
        prevStep()
    }

    const handleSubmit = async () => {
        if (selectedPos == null) {
            setError('Please select any Accounting System to integrate')
            return
        }
        handleSnackbarMessage("Accounting system noted successfully")
        handleSnackbarOpen()
        nextStep()
        // try {
        //     if (selectedPos == null) {
        //         setError('Please select a POS to integrate')
        //         return
        //     }
        //     setLoading(true)
        //     const data = inputValues
        //     const result = await client.post('/create-posRef', data, {
        //         headers: { 'Content-Type': 'application/json' },
        //     })
        //     if (result.data.success) {
        //         setError(null)
        //         setLoading(false)
        //         nextStep()
        //     } else {
        //         setError(result.data.message)
        //         setLoading(false)
        //     }
        // } catch (err) {
        //     console.log(`Error integrating pos ${err}`);
        //     setLoading(false);
        // }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Supported Accounting Systems
            </Typography>
            <Divider style={{ marginBottom: '16px' }} />
            <Grid container spacing={2}>
                {posOptions.map((pos) => (
                    <Grid item xs={12} sm={3} key={pos.name}>
                        <Card
                            onClick={() => handlePosSelection(pos)}
                            style={{
                                cursor: 'pointer',
                                border: selectedPos && selectedPos.name === pos.name ? '3px solid #47bf93' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '5px'
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={pos.logo}
                                alt={pos.name}
                                style={{ height: 100, width: 180, objectFit: 'contain' }}
                            />
                        </Card>
                    </Grid>
                ))}
                <Grid item xs={12} sm={3}>
                    <Card
                        onClick={() => handlePosSelection({ name: 'Other', logo: accountlogo8, description: 'Description for POS 6', fields: [{ label: 'ID', value: '' }, { label: 'Secret Key', value: '' }] })}
                        style={{
                            cursor: 'pointer',
                            border: selectedPos && selectedPos.name === 'Other' ? '3px solid #47bf93' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5px',
                            height: 110,
                            // width: 180
                        }}
                    >
                        <Typography>Other</Typography>
                    </Card>
                </Grid>
            </Grid>


            {/* {selectedPos && (
                <>
                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                        {selectedPos.name} Integration
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <Grid container spacing={2}>
                        {selectedPos.fields.map((field) => (
                            <Grid item xs={12} key={field.key}>
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    value={inputValues[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )} */}

            {error && (
                <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                    {error}
                </Typography>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                {/* <StyledButtonTrans variant="outlined" onClick={handleBack} style={{ marginRight: '10px' }}>
                    Back
                </StyledButtonTrans> */}
                <StyledButtonTrans variant="outlined" onClick={handleSkip} style={{ marginRight: '10px' }}>
                    Skip
                </StyledButtonTrans>
                <StyledButtonFill variant="outlined" onClick={handleSubmit} style={{ marginRight: '10px' }}>
                    Next
                </StyledButtonFill>
            </div>
        </Paper>
    );
};

export default AccountingIntegrationForm;
