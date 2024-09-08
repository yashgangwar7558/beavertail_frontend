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
    countries: ['India', 'USA', 'Canada'],
    states: {
        'India': ['New York', 'California'],
        'USA': ['Illinois', 'Texas'],
        'Canada': ['Arizona']
    },
    cities: {
        'New York': ['New York City', 'Buffalo', 'Rochester'],
        'California': ['Los Angeles', 'San Francisco', 'San Diego'],
        'Illinois': ['Chicago', 'Aurora', 'Naperville'],
        'Texas': ['Houston', 'Dallas', 'Austin'],
        'Arizona': ['Phoenix', 'Tucson', 'Mesa']
    }
}

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
    // const [offsetCountries, setOffsetCountries] = useState(0);
    // const [offsetStates, setOffsetStates] = useState(0);
    // const [offsetCities, setOffsetCities] = useState(0);
    // const [hasMoreCountries, setHasMoreCountries] = useState(true);
    // const [hasMoreStates, setHasMoreStates] = useState(true);
    // const [hasMoreCities, setHasMoreCities] = useState(true);


    // // Fetch countries with pagination
    // useEffect(() => {
    //     const fetchCountries = async () => {
    //         try {
    //             const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries?offset=${offsetCountries}&limit=100`, {
    //                 headers: {
    //                     'x-rapidapi-key': '6265e76aa5msh89e1c4241644560p151e82jsn4a497c12d4e5',
    //                     'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    //                 },
    //             });
    //             console.log(response.data.data);

    //             const newCountries = response.data.data;
    //             setCountries(prevCountries => [...prevCountries, ...newCountries]);

    //             if (newCountries.length > 0) {
    //                 setOffsetCountries(prevOffset => prevOffset + newCountries.length);
    //             } else {
    //                 setHasMoreCountries(false); // No more data
    //             }
    //         } catch (error) {
    //             console.error('Error fetching countries:', error);
    //         }
    //     };

    //     if (hasMoreCountries) {
    //         fetchCountries();
    //     }
    // }, [offsetCountries, hasMoreCountries]);

    // // Fetch states when country changes
    // useEffect(() => {
    //     if (country) {
    //         const fetchStates = async () => {
    //             try {
    //                 const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/regions`, {
    //                     headers: {
    //                         'x-rapidapi-key': '6265e76aa5msh89e1c4241644560p151e82jsn4a497c12d4e5',
    //                         'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    //                     },
    //                     params: {
    //                         offset: offsetStates,
    //                         limit: 100 // Adjust limit as needed
    //                     }
    //                 });

    //                 const newStates = response.data.data;
    //                 setStates(prevStates => [...prevStates, ...newStates]);

    //                 if (newStates.length > 0) {
    //                     setOffsetStates(prevOffset => prevOffset + newStates.length);
    //                 } else {
    //                     setHasMoreStates(false); // No more data
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching states:', error);
    //             }
    //         };

    //         if (hasMoreStates) {
    //             fetchStates();
    //         }
    //     }
    // }, [country, offsetStates, hasMoreStates]);

    // // Fetch cities when state changes
    // useEffect(() => {
    //     if (state) {
    //         const fetchCities = async () => {
    //             try {
    //                 const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/regions/${state}/cities`, {
    //                     headers: {
    //                         'x-rapidapi-key': '6265e76aa5msh89e1c4241644560p151e82jsn4a497c12d4e5',
    //                         'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    //                     },
    //                     params: {
    //                         offset: offsetCities,
    //                         limit: 100 // Adjust limit as needed
    //                     }
    //                 });

    //                 const newCities = response.data.data;
    //                 setCities(prevCities => [...prevCities, ...newCities]);

    //                 if (newCities.length > 0) {
    //                     setOffsetCities(prevOffset => prevOffset + newCities.length);
    //                 } else {
    //                     setHasMoreCities(false); // No more data
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching cities:', error);
    //             }
    //         };

    //         if (hasMoreCities) {
    //             fetchCities();
    //         }
    //     }
    // }, [state, offsetCities, hasMoreCities]);

    // useEffect(() => {
    //     // Fetch countries on mount
    //     axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=&types=(regions)&key=${API_KEY}`)
    //     .then(response => {
    //         const countryData = response.data.predictions.map(prediction => prediction.description);
    //         setCountries(countryData);
    //     })
    //     .catch(error => console.error('Error fetching countries:', error));
    // }, []);

    // useEffect(() => {
    //     if (country) {
    //         // Fetch states when a country is selected
    //         axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${selectedCountry}&types=(regions)&key=${API_KEY}`)
    //         .then(response => {
    //             const stateData = response.data.predictions.map(prediction => prediction.description);
    //             setStates(stateData);
    //         })
    //         .catch(error => console.error('Error fetching states:', error));
    //     }
    // }, [country]);

    // useEffect(() => {
    //     if (state) {
    //         // Fetch cities when a state is selected
    //         axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${selectedState}&types=(cities)&key=${API_KEY}`)
    //         .then(response => {
    //             const cityData = response.data.predictions.map(prediction => prediction.description);
    //             setCities(cityData);
    //         })
    //         .catch(error => console.error('Error fetching cities:', error));
    //     }
    // }, [state]);


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
            const data = {tenantName, tenantDescription, address, country, state, city, invoiceEmails, billEmails, contact}
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
                {error && (
                    <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
                        {error}
                    </Typography>
                )}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButtonTrans variant="outlined" onClick={handleCancel} style={{ marginRight: '10px' }}>
                        Cancel
                    </StyledButtonTrans>
                    <StyledButtonTrans variant="outlined" onClick={handleSkip} style={{ marginRight: '10px' }}>
                        Skip
                    </StyledButtonTrans>
                    <StyledButtonFill variant="contained" onClick={handleSubmit}>
                        Create
                    </StyledButtonFill>
                </div>
            </Paper>
        </Container>
    );
};

export default RestaurantForm;
