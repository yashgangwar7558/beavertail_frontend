import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../utils/ApiConfig';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    TextField,
    Paper,
    Divider,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    IconButton,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';

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

const EditableTextField = styled(TextField)({
    marginBottom: '16px',
    fontFamily: 'inherit'
});

const AutocompleteStyled = styled(Autocomplete)({
    marginBottom: '16px',
});

const cityStateData = {
    countries: ['India', 'USA', 'United Kingdom', 'Canada', 'Australia'],
    states: {
        'India': [
            'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'West Bengal'
        ],
        'USA': [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
            'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
            'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
            'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
            'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
            'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
            'West Virginia', 'Wisconsin', 'Wyoming'
        ],
        'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
        'Canada': ['Alberta', 'Ontario', 'Quebec', 'British Columbia', 'Manitoba'],
        'Australia': ['New South Wales', 'Queensland', 'Victoria', 'Western Australia', 'South Australia']
    },
    cities: {
        // India
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
        'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
        'West Bengal': ['Kolkata', 'Darjeeling', 'Siliguri'],

        // USA (all states and sample cities)
        'Alabama': ['Birmingham', 'Montgomery', 'Mobile'],
        'Alaska': ['Anchorage', 'Juneau', 'Fairbanks'],
        'Arizona': ['Phoenix', 'Tucson', 'Mesa'],
        'Arkansas': ['Little Rock', 'Fayetteville', 'Fort Smith'],
        'California': ['Los Angeles', 'San Francisco', 'San Diego'],
        'Colorado': ['Denver', 'Colorado Springs', 'Aurora'],
        'Connecticut': ['Hartford', 'New Haven', 'Stamford'],
        'Delaware': ['Wilmington', 'Dover', 'Newark'],
        'Florida': ['Miami', 'Orlando', 'Tampa'],
        'Georgia': ['Atlanta', 'Augusta', 'Savannah'],
        'Hawaii': ['Honolulu', 'Hilo', 'Kailua'],
        'Idaho': ['Boise', 'Meridian', 'Idaho Falls'],
        'Illinois': ['Chicago', 'Aurora', 'Naperville'],
        'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville'],
        'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport'],
        'Kansas': ['Wichita', 'Overland Park', 'Kansas City'],
        'Kentucky': ['Louisville', 'Lexington', 'Bowling Green'],
        'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport'],
        'Maine': ['Portland', 'Lewiston', 'Bangor'],
        'Maryland': ['Baltimore', 'Frederick', 'Rockville'],
        'Massachusetts': ['Boston', 'Worcester', 'Springfield'],
        'Michigan': ['Detroit', 'Grand Rapids', 'Warren'],
        'Minnesota': ['Minneapolis', 'Saint Paul', 'Rochester'],
        'Mississippi': ['Jackson', 'Gulfport', 'Southaven'],
        'Missouri': ['Kansas City', 'St. Louis', 'Springfield'],
        'Montana': ['Billings', 'Missoula', 'Great Falls'],
        'Nebraska': ['Omaha', 'Lincoln', 'Bellevue'],
        'Nevada': ['Las Vegas', 'Reno', 'Henderson'],
        'New Hampshire': ['Manchester', 'Nashua', 'Concord'],
        'New Jersey': ['Newark', 'Jersey City', 'Paterson'],
        'New Mexico': ['Albuquerque', 'Las Cruces', 'Santa Fe'],
        'New York': ['New York City', 'Buffalo', 'Rochester'],
        'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro'],
        'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
        'Ohio': ['Columbus', 'Cleveland', 'Cincinnati'],
        'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
        'Oregon': ['Portland', 'Eugene', 'Salem'],
        'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown'],
        'Rhode Island': ['Providence', 'Cranston', 'Warwick'],
        'South Carolina': ['Columbia', 'Charleston', 'Greenville'],
        'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
        'Tennessee': ['Nashville', 'Memphis', 'Knoxville'],
        'Texas': ['Houston', 'Dallas', 'Austin'],
        'Utah': ['Salt Lake City', 'Provo', 'West Valley City'],
        'Vermont': ['Burlington', 'South Burlington', 'Rutland'],
        'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake'],
        'Washington': ['Seattle', 'Spokane', 'Tacoma'],
        'West Virginia': ['Charleston', 'Huntington', 'Morgantown'],
        'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
        'Wyoming': ['Cheyenne', 'Casper', 'Laramie'],

        // United Kingdom
        'England': ['London', 'Manchester', 'Birmingham'],
        'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen'],
        'Wales': ['Cardiff', 'Swansea', 'Newport'],
        'Northern Ireland': ['Belfast', 'Derry', 'Lisburn'],

        // Canada
        'Alberta': ['Calgary', 'Edmonton', 'Red Deer'],
        'Ontario': ['Toronto', 'Ottawa', 'Hamilton'],
        'Quebec': ['Montreal', 'Quebec City', 'Laval'],
        'British Columbia': ['Vancouver', 'Victoria', 'Kelowna'],
        'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach'],

        // Australia
        'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
        'Queensland': ['Brisbane', 'Gold Coast', 'Cairns'],
        'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
        'Western Australia': ['Perth', 'Fremantle', 'Bunbury'],
        'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla']
    }
};

const RestaurantForm = ({ nextStep, storeTenantId, storeTenant, handleSnackbarOpen, handleSnackbarMessage }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [tenantDescription, setTenantDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [invoiceEmails, setInvoiceEmails] = useState([]);
    const [billEmails, setBillEmails] = useState([]);
    const [newInvoiceEmail, setNewInvoiceEmail] = useState('');
    const [newBillEmail, setNewBillEmail] = useState('');
    const [contact, setContact] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const handleAddEmail = (emailType) => {
        if (emailType === 'invoice' && newInvoiceEmail) {
            setInvoiceEmails([...invoiceEmails, newInvoiceEmail])
            setNewInvoiceEmail('')
        }
        if (emailType === 'bill' && newBillEmail) {
            setBillEmails([...billEmails, newBillEmail])
            setNewBillEmail('')
        }
    };

    const handleRemoveEmail = (emailType, index) => {
        if (emailType === 'invoice') {
            setInvoiceEmails(invoiceEmails.filter((_, i) => i !== index))
        }
        if (emailType === 'bill') {
            setBillEmails(billEmails.filter((_, i) => i !== index));
        }
    };

    const handleCancel = () => {
        setError(null)
        setTenantName('');
        setTenantDescription('');
        setAddress('');
        setCountry('');
        setState('');
        setCity('');
        setInvoiceEmails([]);
        setBillEmails([]);
        setNewInvoiceEmail('');
        setNewBillEmail('');
        setContact({ firstName: '', lastName: '', email: '', phone: '' });
    };

    const handleSubmit = async () => {
        // nextStep()
        // handleSnackbarMessage("Restaurant created successfully")
        // handleSnackbarOpen()
        try {
            setLoading(true)
            const data = { tenantName, tenantDescription, address, country, state, city, invoiceEmails, billEmails, contact }
            const result = await client.post('/create-tenant', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.tenant);
            if (result.data.success) {
                setError(null)
                setLoading(false)
                storeTenantId(result.data.tenant._id)
                storeTenant(result.data.tenant)
                handleSnackbarMessage("Restaurant created successfully")
                handleSnackbarOpen()
                nextStep()
            } else {
                setError(result.data.message)
                setLoading(false);
            }
        } catch (err) {
            console.log(`error creating new tenant ${err}`);
            setLoading(false);
        }
    }

    const handleSkip = async () => {
        nextStep()
    }

    return (
        <Container style={{ padding: '0px', margin: '0px' }}>
            <Paper elevation={3} style={{ padding: '12px', borderRadius: '12px' }}>
                <Typography variant="h5" gutterBottom>
                    Restaurant Details
                </Typography>
                <Divider style={{ marginBottom: '16px' }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Restaurant Name"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Restaurant Description"
                            value={tenantDescription}
                            onChange={(e) => setTenantDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <AutocompleteStyled
                                options={cityStateData.countries || []}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => <TextField {...params} label="Country" />}
                                onChange={(event, newValue) => setCountry(newValue)}
                            // options={countries.map((country) => country.name)}
                            // getOptionLabel={(option) => option}
                            // renderInput={(params) => <TextField {...params} label="Country" />}
                            // onChange={(event, newValue) => setCountry(newValue)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <AutocompleteStyled
                                options={cityStateData.states[country] || []}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => <TextField {...params} label="State" />}
                                onChange={(event, newValue) => setState(newValue)}
                            // options={states.map((state) => state.name)}
                            // getOptionLabel={(option) => option}
                            // renderInput={(params) => <TextField {...params} label="State" />}
                            // onChange={(event, newValue) => setState(newValue)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <AutocompleteStyled
                                options={cityStateData.cities[state] || []}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => <TextField {...params} label="City" />}
                                onChange={(event, newValue) => setCity(newValue)}
                            // options={cities.map((city) => city.name)}
                            // getOptionLabel={(option) => option}
                            // renderInput={(params) => <TextField {...params} label="City" />}
                            // onChange={(event, newValue) => setCity(newValue)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Invoice Email"
                            value={newInvoiceEmail}
                            onChange={(e) => setNewInvoiceEmail(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => handleAddEmail('invoice')}>
                                        <AddIcon />
                                    </IconButton>
                                )
                            }}
                        />
                        {invoiceEmails.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleRemoveEmail('invoice', index)}
                                style={{ margin: '4px' }}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Bill Email"
                            value={newBillEmail}
                            onChange={(e) => setNewBillEmail(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => handleAddEmail('bill')}>
                                        <AddIcon />
                                    </IconButton>
                                )
                            }}
                        />
                        {billEmails.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleRemoveEmail('bill', index)}
                                style={{ margin: '4px' }}
                            />
                        ))}
                    </Grid>
                </Grid>
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                    Contact Details
                </Typography>
                <Divider style={{ marginBottom: '16px' }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="First Name"
                            value={contact.firstName}
                            onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Last Name"
                            value={contact.lastName}
                            onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Email"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <EditableTextField
                            fullWidth
                            label="Phone"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            placeholder="+1XXXXXXXXXX"
                        />
                    </Grid>
                </Grid>
                {error ? (
                    <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                        {error}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                        * All fields are mandatory.
                    </Typography>
                )}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButtonTrans variant="outlined" onClick={handleCancel} style={{ marginRight: '10px' }}>
                        Cancel
                    </StyledButtonTrans>
                    {/* <StyledButtonTrans variant="outlined" onClick={handleSkip} style={{ marginRight: '10px' }}>
                        Skip
                    </StyledButtonTrans> */}
                    <StyledButtonFill variant="contained" onClick={handleSubmit}>
                        Create
                    </StyledButtonFill>
                </div>
            </Paper>
        </Container>
    );
};

export default RestaurantForm;
