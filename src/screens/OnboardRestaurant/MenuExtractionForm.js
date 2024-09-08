import React, { useState } from 'react';
import { Button, Container, Typography, TextField, Grid, Snackbar, styled, Paper, Divider } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import client from '../../utils/ApiConfig';

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

const MenuExtractionForm = ({ nextStep, prevStep, tenantId, tenant, handleSnackbarOpen, handleSnackbarMessage }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            'image/*': ['.jpg', '.jpeg', '.png'],
        },
        onDrop: acceptedFiles => {
            setFile(acceptedFiles[0]);
        },
    });

    const handleExtract = async () => {
        try {
            setLoading(true)
            handleSnackbarMessage("Started extracting menu...")
            handleSnackbarOpen()
            const data = new FormData()
            // data.append('tenantId', tenantId)
            // data.append('tenantName', tenant.tenantName)
            data.append('tenantId', '663fb81d7176f3acc181bda9')
            data.append('tenantName', 'Xero Degree')
            data.append('menuFile', file)
            const result = await client.post('/extract-menu', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })

            if (result.data.success) {
                // console.log(result.data)
                setLoading(false)
            } else {
                setError(result.data.message)
                setLoading(false)
            }
        } catch (error) {
            console.log(`extracting menu error ${error}`)
            setLoading(false)
        }
    }

    const handleBack = async () => {
        prevStep()
    }

    const handleSkip = async () => {
        nextStep()
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Extract Recipes from Menu
            </Typography>
            <Divider style={{ marginBottom: '16px' }} />
            <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                <Typography variant="body1">
                    {file ? file.name : 'Drag and drop a file here, or click to select one'}
                </Typography>
            </div>
            {error && (
                <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                    {error}
                </Typography>
            )}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButtonTrans variant="outlined" onClick={handleBack} style={{ marginRight: '10px' }}>
                    Back
                </StyledButtonTrans>
                <StyledButtonTrans variant="outlined" onClick={handleSkip} style={{ marginRight: '10px' }}>
                    Skip
                </StyledButtonTrans>
                <StyledButtonFill variant="contained" onClick={handleExtract} style={{ marginRight: '10px' }}>
                    Extract
                </StyledButtonFill>
            </div>
        </Paper>
    );
};

export default MenuExtractionForm;
