import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Picker } from 'react-native';
import stringSimilarity from 'string-similarity'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDropzone } from 'react-dropzone';
import client from '../../utils/ApiConfig/index.js'
import { AuthContext } from '../../context/AuthContext.js'
import LoadingScreen from '../../components/LoadingScreen/index.js';
import { DatePicker } from '@mui/x-date-pickers';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { matchSorter } from 'match-sorter'
import { createFilterOptions } from '@mui/material/Autocomplete';

const AddInvoice = (props) => {
    const navigate = useNavigate({});
    const location = useLocation();
    const today = dayjs();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [unitMaps, setUnitMaps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([])
    const [similarSearchResults, setSimilarSearchResults] = useState({})
    const [selectedIngredient, setSelectedIngredient] = useState({});
    const [editMode, setEditMode] = useState(location.state ? true : false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        tenantId: userInfo.user.tenant,
        invoiceNumber: '',
        vendor: '',
        invoiceDate: null,
        invoiceFile: null,
        ingredients: [],
        payment: '',
        total: '',
        totalPayable: '',
    });

    const editInvoiceData = location.state?.editInvoiceData || null;

    const statusTypes = ['Pending', 'Paid']
    const paymentModes = ['Net Banking', 'Credit/Debit Card', 'Cash']
    const allUnits = ['g', 'kg', 'oz', 'lbs', 'ml', 'l', 'gal', 'piece']

    const getIngredients = async () => {
        try {
            setLoading(true)
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-ingredients', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setIngredients(result.data.ingredients)
            setLoading(false)
        } catch (error) {
            console.log(`getting ingredients error ${error}`);
        }
    }

    const getUnitMaps = async () => {
        try {
            setLoading(true)
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-unitmaps', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setUnitMaps(result.data.unitMaps)
            setLoading(false)
        } catch (error) {
            console.log(`getting unitmaps error ${error}`);
        }
    }

    const calculateTotalAmount = () => {
        const totalAmount = invoiceData.ingredients.reduce((sum, ingredient) => {
            const ingredientTotal = parseFloat(ingredient.total) || 0;
            return sum + ingredientTotal;
        }, 0)

        setInvoiceData((prevInvoiceData) => ({
            ...prevInvoiceData,
            total: totalAmount.toFixed(2),
        }))
    };

    useEffect(() => {
        props.setHeaderTitle('Add Invoice')
        getIngredients()
        getUnitMaps()
        // calculateTotalAmount()
        if (editMode) {
            setInvoiceData({
                tenantId: editInvoiceData.tenantId,
                invoiceNumber: editInvoiceData.invoiceNumber,
                vendor: editInvoiceData.vendor,
                invoiceDate: dayjs(editInvoiceData.invoiceDate),
                invoiceFile: null,
                ingredients: editInvoiceData.ingredients || [],
                payment: editInvoiceData.payment,
                total: editInvoiceData.total,
                totalPayable: editInvoiceData.totalPayable
            });
            setEditMode(false)
        }
    }, [])

    useEffect(() => {
        calculateTotalAmount()
    }, [invoiceData.ingredients])

    const handleInvoiceExtraction = async () => {
        try {
            setLoading(true)
            const file = new FormData()
            file.append('invoiceFile', invoiceData.invoiceFile)
            const result = await client.post('/extract-invoice-data', file, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const extractedData = result.data.extractedData
            console.log(result);
            if (result.data.success) {
                setInvoiceData({
                    ...invoiceData,
                    invoiceNumber: extractedData.invoiceNumber,
                    vendor: extractedData.vendor,
                    invoiceDate: dayjs(extractedData.invoiceDate),
                    ingredients: extractedData.ingredients || [],
                    payment: extractedData.payment,
                    total: extractedData.total,
                    totalPayable: extractedData.totalPayable,
                })
                setLoading(false)
            } else {
                setLoading(false)
                alert("Extraction failed. Please try again!")
            }
        } catch (err) {
            console.log(`error invoice data extraction`);
            setLoading(false)
        }
    }

    const cancelInvoiceExtraction = async () => {
        setInvoiceData({
            tenantId: userInfo.user.tenant,
            invoiceNumber: '',
            vendor: '',
            invoiceDate: null,
            invoiceFile: null,
            ingredients: [{ name: '', quantity: '', unit: '', unitPrice: '', total: '' }],
            payment: '',
            total: '',
            totalPayable: '',
        });
    }

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 1) {
            alert('Please upload only one file.');
            return;
        }
        setInvoiceData({ ...invoiceData, invoiceFile: acceptedFiles[0] })
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
            'application/pdf': ['.pdf'],
        },
        // maxFiles: 1,
    });

    const handleIngredientSearch = (text) => {
        const results = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if (text.length == 0) {
            setSearchResults(ingredients)
        }
    }

    const [isIngDropdownVisible, setIsIngDropdownVisible] = useState(new Array(100).fill(false))
    const [inputValue, setInputValue] = useState(new Array(100).fill(''))
    const handleSimilarIngredientSearch = (text, index) => {
        if (text.length === 0) {
            setSimilarSearchResults(prevState => ({
                ...prevState,
                [index]: []
            }));
            return [];
        }

        const ingredientNames = ingredients.map(ingredient => ingredient.name);
        const matches = stringSimilarity.findBestMatch(text, ingredientNames).ratings;
        const sortedMatches = matches.sort((a, b) => b.rating - a.rating);
        const results = sortedMatches.map(match => ingredients.find(ingredient => ingredient.name === match.target));

        setSimilarSearchResults(prevState => ({
            ...prevState,
            [index]: results
        }))
        setIsIngDropdownVisible(prevState => ({
            ...prevState,
            [index]: true,
        }))

        return results
    }

    const filterOptions = (index, options) => {
        if (!inputValue[index]) {
            return [];
        }

        const matches = stringSimilarity.findBestMatch(inputValue[index], options)
        const sortedMatches = matches.ratings.sort((a, b) => b.rating - a.rating)

        return sortedMatches.map(match => match.target);
    }

    const toggleSearchDropdown = () => {
        if (isDropdownVisible) {
            setIsDropdownVisible(false);
            setSearchResults([]);
        } else {
            setIsDropdownVisible(true);
            setSearchResults(ingredients);
        }
    }

    const toggleIngSearchDropdown = (index) => {
        if (isIngDropdownVisible[index]) {
            setIsIngDropdownVisible(prevState => ({
                ...prevState,
                [index]: false,
            }))
        } else {
            handleSimilarIngredientSearch(invoiceData.ingredients[index].name, index)
        }
    }

    const handleAddNewIngredient = () => {
        setInvoiceData({
            ...invoiceData,
            ingredients: [...invoiceData.ingredients, {
                name: '',
                quantity: '',
                unit: '',
                unitPrice: '',
                total: '',
            }],
        })
    }

    const handleAddIngredient = (ingredient) => {
        setSelectedIngredient({ ingredient });
        setInvoiceData({
            ...invoiceData,
            ingredients: [...invoiceData.ingredients, {
                name: ingredient.name,
                quantity: '',
                unit: '',
                unitPrice: '',
                total: '',
            }],
        })
        setSearchTerm('');
        setSimilarSearchResults([])
        setIsDropdownVisible(false)
    }

    const handleIngredientsChange = (index, field, value) => {
        const updatedIngredients = [...invoiceData.ingredients]
        updatedIngredients[index][field] = value
        if (field === 'quantity' || field === 'unitPrice') {
            const quantity = updatedIngredients[index]['quantity'] || 0;
            const unitPrice = updatedIngredients[index]['unitPrice'] || 0;
            updatedIngredients[index]['total'] = (quantity * unitPrice).toFixed(2);
        }
        setInvoiceData({ ...invoiceData, ingredients: updatedIngredients })
    };

    const handleDeleteIngredient = async (index) => {
        const updatedIngredients = [...invoiceData.ingredients];
        updatedIngredients.splice(index, 1);

        await setInvoiceData((prevInvoiceData) => ({
            ...prevInvoiceData,
            ingredients: updatedIngredients,
        }));

        setSimilarSearchResults(prevState => ({
            ...prevState,
            [index]: []
        }))
        setIsIngDropdownVisible(prevState => ({
            ...prevState,
            [index]: false,
        }))
    };

    const handleSubmit = async (statusType) => {
        try {
            setLoading(true)
            const data = new FormData();
            data.append('tenantId', invoiceData.tenantId);
            data.append('invoiceNumber', invoiceData.invoiceNumber);
            data.append('vendor', invoiceData.vendor);
            data.append('invoiceDate', invoiceData.invoiceDate || '');
            data.append('invoiceFile', invoiceData.invoiceFile);
            data.append('ingredients', JSON.stringify(invoiceData.ingredients));
            data.append('payment', invoiceData.payment);
            data.append('statusType', statusType);
            data.append('total', invoiceData.total);
            data.append('totalPayable', invoiceData.totalPayable);

            let result
            if (editInvoiceData && editInvoiceData._id) {
                data.append('invoiceId', editInvoiceData._id);
                result = await client.post('/update-invoice', data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                })
            } else {
                result = await client.post('/create-invoice', data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                })
            }

            if (result.data.success) {
                setInvoiceData({
                    tenantId: userInfo.user.tenant,
                    invoiceNumber: '',
                    vendor: '',
                    invoiceDate: null,
                    invoiceFile: null,
                    ingredients: [{ name: '', quantity: '', unit: '', unitPrice: '', total: '' }],
                    payment: '',
                    total: '',
                    totalPayable: '',
                });
                navigate('/invoices');
                setLoading(false)
            } else {
                setLoading(false)
                alert(result.data.message)
                return
            }
        } catch (error) {
            console.log(`error adding invoice: ${error}`);
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.formContainer}
                scrollIndicatorInsets={{ right: -5 }} showsVerticalScrollIndicator={true}
            >

                {!location.state &&
                    <View>
                        <Text style={styles.headingLabel}>Autofill Invoice Details</Text>
                        <View style={styles.inputContainer}>
                            <div {...getRootProps()} style={styles.dropzone}>
                                <input {...getInputProps()} />
                                <p style={{ fontFamily: 'inherit' }}>Drag 'n' drop your invoice here, or click to select one</p>
                            </div>
                            {invoiceData.invoiceFile && (
                                <View style={styles.postUploadContainer}>
                                    <Text style={{ color: '#2bb378' }}>
                                        File Added Successfully!{' '}
                                        <Text
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                            onPress={() => setInvoiceData({ ...invoiceData, invoiceFile: null })}
                                        >
                                            Reset
                                        </Text>
                                    </Text>
                                    <View style={styles.postUploadButtonsContainer}>
                                        <Icon.Button
                                            style={styles.postUploadButtonBlue}
                                            onPress={() => handleInvoiceExtraction()}
                                            name="search-plus"
                                            backgroundColor="transparent"
                                            underlayColor="transparent"
                                            iconStyle={{ fontSize: 16, marginRight: 5 }}
                                            color={"white"}
                                        >
                                            <Text style={{ color: 'white', fontSize: 15, fontFamily: 'inherit' }}>Extract</Text>
                                        </Icon.Button>
                                        <Icon.Button
                                            style={styles.postUploadButtonTrans}
                                            onPress={() => cancelInvoiceExtraction()}
                                            name="remove"
                                            backgroundColor="transparent"
                                            underlayColor="transparent"
                                            iconStyle={{ fontSize: 16, marginRight: 5 }}
                                            color={"#47bf93"}
                                        >
                                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Cancel</Text>
                                        </Icon.Button>
                                    </View>
                                </View>
                            )}

                        </View>
                        <Divider style={styles.divider}>
                            <Chip label="Or" size="small" style={{ backgroundColor: '#47bf93', color: '#ffffff' }} />
                        </Divider>
                        <Text style={styles.headingLabel}>Manually Fill Invoice Details</Text>
                    </View>
                }

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Invoice Number</Text>
                    <TextInput
                        style={[styles.input]}
                        value={invoiceData.invoiceNumber}
                        onChangeText={(text) => setInvoiceData({ ...invoiceData, invoiceNumber: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Vendor Name</Text>
                    <TextInput
                        style={[styles.input]}
                        value={invoiceData.vendor}
                        onChangeText={(text) => setInvoiceData({ ...invoiceData, vendor: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Invoice Date</Text>
                    <DatePicker
                        defaultValue={today}
                        disableFuture
                        value={invoiceData.invoiceDate}
                        onChange={(date) => setInvoiceData({ ...invoiceData, invoiceDate: date.format('YYYY-MM-DD') })}
                        formatDensity="spacious"
                        // format="DD-MM-YYYY"
                        slotProps={{ textField: { size: 'small' }, field: { clearable: true, onClear: () => setInvoiceData({ ...invoiceData, invoiceDate: null }) } }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ingredients<span>  </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            onPress={() => handleAddNewIngredient()}
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add new</Text>
                        </Icon.Button>
                    </Text>
                    {/* <Text style={{ color: 'gray', fontSize: '15px', marginBottom: '10px' }}>*Click on Add new, if ingredient not found or purchasing it for the first time.</Text> */}
                    {/* Search Input */}
                    {/* <View style={styles.searchBarContainer}>
                        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search Ingredient"
                            placeholderTextColor="gray"
                            selectTextOnFocus={false}
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                handleIngredientSearch(text);
                            }}
                            onFocus={() => { setSearchResults(ingredients), setIsDropdownVisible(true) }}
                        />
                        <Icon name={isDropdownVisible ? "angle-up" : "angle-down"} size={20} color="gray" style={styles.dropdownIcon} onPress={toggleSearchDropdown} />
                    </View> */}
                    {/* Search Results */}
                    {/* {isDropdownVisible && searchResults.length > 0 && (
                        <View style={{ maxHeight: 200 }}>
                            <FlatList
                                style={styles.dropdownMenu}
                                data={searchResults}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleAddIngredient(item)}
                                    >
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        </View>
                    )} */}
                    <View style={styles.headerContainer}>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Ingredient</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Quantity</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Unit</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Unit Price ($)</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Total ($)</Text></View>
                    </View>
                    {/* Ingredient Inputs */}
                    {invoiceData.ingredients.map((ingredient, index) => {
                        const isExistingIngredient = ingredient.name === '' || ingredients.some(item => item.name === ingredient.name);
                        return (
                            <View key={index} style={styles.rowContainer}>
                                <Autocomplete
                                    style={styles.smallInput}
                                    value={ingredient.name}
                                    onChange={(event, newValue) => {
                                        handleIngredientsChange(index, 'name', newValue)
                                        setInputValue(prevState => ({
                                            ...prevState,
                                            [index]: newValue
                                        }))
                                    }}
                                    inputValue={inputValue[index]}
                                    onInputChange={(event, newInputValue) => {
                                        handleIngredientsChange(index, 'name', newInputValue)
                                        setInputValue(prevState => ({
                                            ...prevState,
                                            [index]: newInputValue
                                        }))
                                    }}
                                    filterOptions={(options) => filterOptions(index, ingredients.map(ingredient => ingredient.name))}
                                    options={ingredients.map(ingredient => ingredient.name)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            hiddenLabel
                                            size='small'
                                            placeholder="Name"
                                            style={{ flex: 1, borderColor: !isExistingIngredient ? 'red' : 'default'}}
                                            error={!isExistingIngredient}
                                        // disabled={ingredients.some(item => item.name === ingredient.name)}
                                        />
                                    )}
                                />

                                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={ingredients.find(item => item.name === ingredient.name) ? styles.smallInputNonEditable : styles.smallInput}
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    value={ingredient.name}
                                    editable={ingredients.find(item => item.name === ingredient.name) ? false : true}
                                    onChangeText={(text) => {
                                        handleIngredientsChange(index, 'name', text)
                                        handleSimilarIngredientSearch(text, index)
                                    }}
                                    onFocus={() => { handleSimilarIngredientSearch(ingredient.name, index) }}
                                />
                                <Icon name={isIngDropdownVisible[index] ? "angle-up" : "angle-down"} size={20} color="gray" style={styles.dropdownIcon} onPress={() => toggleIngSearchDropdown(index)} />
                            </View> */}
                                {/* Search Results */}
                                {/* {isIngDropdownVisible[index] && similarSearchResults[index] && similarSearchResults[index].length > 0 && (
                                <View style={{ maxHeight: 200 }}>
                                    <FlatList
                                        style={styles.dropdownMenu}
                                        data={similarSearchResults[index]}
                                        keyExtractor={(item) => item._id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    handleIngredientsChange(index, 'name', item.name)
                                                    setSimilarSearchResults(prevState => ({
                                                        ...prevState,
                                                        [index]: []
                                                    }))
                                                    setIsIngDropdownVisible(prevState => ({
                                                        ...prevState,
                                                        [index]: false,
                                                    }))
                                                }}
                                            >
                                                <Text>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                    />
                                </View>
                            )} */}
                                <TextInput
                                    style={styles.smallInput}
                                    maxLength={5}
                                    keyboardType='numeric'
                                    placeholder="Enter Quantity"
                                    placeholderTextColor="gray"
                                    value={ingredient.quantity ? (ingredient.quantity) : ''}
                                    onChangeText={(text) => {
                                        if (/^\d*\.?\d*$/.test(text)) {
                                            handleIngredientsChange(index, 'quantity', text);
                                        }
                                    }}
                                />
                                <Picker
                                    style={styles.smallInput}
                                    selectedValue={ingredient.unit}
                                    onValueChange={(itemValue) => handleIngredientsChange(index, 'unit', itemValue)}
                                >
                                    <Picker.Item label="Select Unit..." value="" />
                                    {
                                        (unitMaps.find(map => map.name === ingredient.name)?.fromUnit)
                                            ? unitMaps.find(map => map.name === ingredient.name)?.fromUnit.map((unit, index) => (
                                                <Picker.Item key={index} label={unit.unit} value={unit.unit} />
                                            ))
                                            : allUnits.map((unit, index) => (
                                                <Picker.Item key={index} label={unit} value={unit} />
                                            ))
                                    }
                                </Picker>
                                <TextInput
                                    style={styles.smallInput}
                                    maxLength={8}
                                    keyboardType='numeric'
                                    placeholder="Unit Price"
                                    placeholderTextColor="gray"
                                    value={ingredient.unitPrice ? ingredient.unitPrice : ''}
                                    onChangeText={(text) => {
                                        if (/^\d*\.?\d*$/.test(text)) {
                                            handleIngredientsChange(index, 'unitPrice', text);
                                        }
                                    }}
                                />
                                <TextInput
                                    style={styles.smallInput}
                                    keyboardType='numeric'
                                    placeholder="Total"
                                    placeholderTextColor="gray"
                                    editable={false}
                                    value={ingredient.total}
                                    onChangeText={(text) => {
                                        if (/^\d*\.?\d*$/.test(text)) {
                                            handleIngredientsChange(index, 'total', text);
                                        }
                                    }}
                                />
                                <Icon.Button style={styles.crossBtn}
                                    name="times-circle-o"
                                    onPress={() => { handleDeleteIngredient(index) }}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ margin: 0, padding: 0, fontSize: 25 }}
                                    color={"gray"}>
                                </Icon.Button>
                            </View>
                        )
                    })}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Total Amount ($)</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        editable={false}
                        value={invoiceData.total}
                        onChangeText={(text) => {
                            if (/^\d*\.?\d*$/.test(text)) {
                                setInvoiceData({ ...invoiceData, total: text })
                            }
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{invoiceData.totalPayable < 0 ? 'Total Receivable Amount ($)' : 'Total Payable Amount ($)'}</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        editable={true}
                        value={invoiceData.totalPayable.toString().replace('-', '')}
                        onChangeText={(text) => {
                            if (/^-?\d*\.?\d*$/.test(text)) {
                                setInvoiceData({ ...invoiceData, totalPayable: text });
                            }
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Payment Mode</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={invoiceData.payment}
                        onValueChange={(itemValue) => setInvoiceData({ ...invoiceData, payment: itemValue })}
                    >
                        <Picker.Item label="Select payment mode..." value="" />
                        {paymentModes.map((mode, index) => (
                            <Picker.Item key={index} label={mode} value={mode} />
                        ))}
                    </Picker>
                </View>

                {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Payment Status</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={invoiceData.status}
                        onValueChange={(itemValue) => setInvoiceData({ ...invoiceData, status: itemValue })}
                    >
                        <Picker.Item label="Select payment status..." value="" />
                        {statusTypes.map((status, index) => (
                            <Picker.Item key={index} label={status} value={status} />
                        ))}
                    </Picker>
                </View> */}

                {
                    !location.state ? (
                        <View style={styles.createButtonsContainer}>
                            <Icon.Button
                                style={styles.blueBtn}
                                onPress={() => handleSubmit('Pending Review')}
                                name="plus"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 19, marginRight: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'inherit' }}>Add Invoice</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.blueBtnTrans}
                                onPress={() => handleSubmit('Pending Approval')}
                                name="check-square-o"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 19, marginRight: 5 }}
                                color={"#47bf93"}
                            >
                                <Text style={{ color: '#47bf93', fontSize: 16, fontFamily: 'inherit' }}>Add & Mark Reviewed</Text>
                            </Icon.Button>
                        </View>
                    ) : (
                        <View style={styles.createButtonsContainer}>
                            <Icon.Button
                                style={styles.blueBtn}
                                onPress={() => handleSubmit('Pending Review')}
                                name="save"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 19 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'inherit' }}>Save Changes</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.blueBtnTrans}
                                onPress={() => handleSubmit('Pending Approval')}
                                name="check-square-o"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 19 }}
                                color={"#47bf93"}
                            >
                                <Text style={{ color: '#47bf93', fontSize: 16, fontFamily: 'inherit' }}>Save & Mark Reviewed</Text>
                            </Icon.Button>
                        </View>
                    )
                }


            </ScrollView >
            {loading && <LoadingScreen />}
        </View >
    )
}

const styles = {
    formContainer: {
        // marginTop: 20,
        paddingBottom: 30,
        paddingTop: 20,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        maxHeight: 'calc(100vh - 65px)'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    postUploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginVertical: 10,
    },
    postUploadButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postUploadButtonBlue: {
        position: "relative",
        // width: 200,
        // height: 45,
        marginTop: 8,
        marginLeft: 5,
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "#47bf93",
        justifyContent: "center",
        alignSelf: "center"
    },
    postUploadButtonTrans: {
        position: "relative",
        // width: 200,
        // height: 45,
        marginTop: 8,
        marginLeft: 5,
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center"
    },
    divider: {
        marginTop: 15,
        marginBottom: 15,
        color: '#47bf93'
    },
    inputContainer: {
        marginTop: 15,
    },
    headingLabel: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontFamily: 'inherit',
        fontSize: 22,
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontFamily: 'inherit',
        fontSize: 16,
    },
    input: {
        height: 40,
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 12,
        borderRadius: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 3,
        paddingRight: 30,
        paddingLeft: 10,
        paddingVertical: 8,
        backgroundColor: '#f2f2f2'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 3,
        padding: 5,
        backgroundColor: '#f2f2f2'
    },
    smallInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#fff',
    },
    smallInputNonEditable: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#e4e1e6'
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 10,
        marginBottom: 8
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        color: 'black',
        paddingHorizontal: 5,
        border: 'none',
        outlineWidth: 0,
    },
    dropdownMenu: {
        zIndex: 1,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    mobileButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    deleteBtn: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossBtn: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 0
        // margin: 0
    },
    greenBtn: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        padding: 6,
        justifyContent: "center"
    },
    redBtn: {
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ff3131",
        justifyContent: "center"
    },
    createButtonsContainer: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    blueBtn: {
        position: "relative",
        // width: 200,
        // height: 45,
        marginTop: 10,
        marginRight: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "#47bf93",
        justifyContent: "center",
        alignSelf: "center"
    },
    blueBtnTrans: {
        position: "relative",
        // width: 200,
        // height: 45,
        marginTop: 10,
        marginRight: 5,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center"
    },
};

export default AddInvoice