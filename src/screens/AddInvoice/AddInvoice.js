import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Picker } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDropzone } from 'react-dropzone';
import client from '../../utils/ApiConfig'
import { AuthContext } from '../../context/AuthContext.js'
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const AddInvoice = () => {
    const navigate = useNavigate({});
    const location = useLocation();
    const today = dayjs();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [unitMaps, setUnitMaps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState({});
    const [invoiceData, setInvoiceData] = useState({
        userId: userInfo.user.userId,
        invoiceNumber: '',
        vendor: '',
        invoiceDate: '',
        invoiceFile: null,
        ingredients: [],
        payment: '',
        status: '',
        total: '',
    });

    const statusTypes = ['Pending', 'Paid']
    const paymentModes = ['Net Banking', 'Credit/Debit Card', 'Cash']
    const allUnits = ['g', 'kg', 'oz', 'lbs', 'ml', 'l', 'gal', 'piece']

    const getIngredients = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-ingredients', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setIngredients(result.data.ingredients)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    const getUnitMaps = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-unitmaps', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setUnitMaps(result.data.unitMaps)
        } catch (error) {
            console.log(`getting unitmaps error ${error}`);
        }
    }

    const calculateTotalAmount = () => {
        const totalAmount = invoiceData.ingredients.reduce((sum, ingredient) => {
            const ingredientTotal = parseFloat(ingredient.total) || 0;
            return sum + ingredientTotal;
        }, 0);
    
        setInvoiceData((prevInvoiceData) => ({
            ...prevInvoiceData,
            total: totalAmount.toFixed(2),
        }));
    };

    useEffect(() => {
        getIngredients()
        getUnitMaps()
        calculateTotalAmount()
    }, [invoiceData])

    const handleDateChange = (date) => {
        setInvoiceData({ ...invoiceData, invoiceDate: date.format('YYYY-MM-DD') })
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 1) {
            alert('Please upload only one file.');
            return;
        }
        setInvoiceData({ ...invoiceData, invoiceFile: acceptedFiles[0] })
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, application/pdf',
        // maxFiles: 1,
    });

    const handleIngredientSearch = (text) => {
        const results = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if (text.length == 0) {
            setSearchResults([])
        }
    };

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
        });
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
        });
        setSearchTerm('');
        setSearchResults([]);
    };

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
    
        setInvoiceData((prevInvoiceData) => ({
            ...prevInvoiceData,
            ingredients: updatedIngredients,
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const data = new FormData();
            data.append('userId', invoiceData.userId);
            data.append('invoiceNumber', invoiceData.invoiceNumber);
            data.append('vendor', invoiceData.vendor);
            data.append('invoiceDate', invoiceData.invoiceDate);
            data.append('invoiceFile', invoiceData.invoiceFile);
            data.append('ingredients', JSON.stringify(invoiceData.ingredients));
            data.append('payment', invoiceData.payment);
            data.append('status', invoiceData.status);
            data.append('total', invoiceData.total);

            const result = await client.post('/process-invoice', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })

            if (result.data.success) {
                setInvoiceData({
                    userId: userInfo.user.userId,
                    invoiceNumber: '',
                    vendor: '',
                    invoiceDate: '',
                    invoiceFile: null,
                    ingredients: [{ name: '', quantity: '', unit: '', unitPrice: '', total: '' }],
                    payment: '',
                    status: '',
                    total: '',
                });
                navigate('/invoices');
                setLoading(false)
            } else {
                setLoading(false)
                alert(result.data.message)
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
            >
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
                        onChange={handleDateChange}
                        formatDensity="spacious"
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Add Invoice File</Text>
                    <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop your file here, or click to select one</p>
                    </div>
                    {invoiceData.invoiceFile && (
                        <Text style={{ color: '#2bb378' }}>Files Added Successfully! <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setInvoiceData({ ...invoiceData, invoiceFile: null })}>Reset</span></Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ingredients<span>  </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            onPress={() => handleAddNewIngredient()}
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#2bb378"}>
                            <Text style={{ color: '#2bb378', fontSize: 15 }}>Add new</Text>
                        </Icon.Button>
                    </Text>
                    <Text style={{ color: 'gray', fontSize: '15px', marginBottom: '10px' }}>*Click on Add new, if ingredient not found or purchasing it for the first time.</Text>
                    {/* Search Input */}
                    <View style={styles.searchBarContainer}>
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
                        />
                    </View>
                    {/* Search Results */}
                    {searchResults.length > 0 && (
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
                        />
                    )}
                    {/* Ingredient Inputs */}
                    {invoiceData.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={ingredients.find(item => item.name === ingredient.name) ? styles.smallInputNonEditable : styles.smallInput}
                                placeholder="Name"
                                placeholderTextColor="gray"
                                value={ingredient.name}
                                editable={ingredients.find(item => item.name === ingredient.name) ? false : true}
                                onChangeText={(text) => handleIngredientsChange(index, 'name', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Enter Quantity"
                                placeholderTextColor="gray"
                                value={ingredient.quantity ? ingredient.quantity.toString() : ''}
                                onChangeText={(text) => {handleIngredientsChange(index, 'quantity', parseFloat(text)), calculateTotalAmount()}}
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
                                placeholder="Unit Price"
                                placeholderTextColor="gray"
                                value={ingredient.unitPrice ? ingredient.unitPrice.toString() : ''}
                                onChangeText={(text) => {handleIngredientsChange(index, 'unitPrice', parseFloat(text)), calculateTotalAmount()}}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Total"
                                placeholderTextColor="gray"
                                value={ingredient.total}
                                onChangeText={(text) => {handleIngredientsChange(index, 'total', text), calculateTotalAmount()}}
                            />
                            <Icon.Button style={styles.crossBtn}
                                name="times-circle-o"
                                onPress={() => {handleDeleteIngredient(index)}}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ margin: 0, padding: 0, fontSize: 25 }}
                                color={"gray"}>
                            </Icon.Button>
                        </View>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Total Amount:</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        value={invoiceData.total}
                        onChangeText={(text) => setInvoiceData({ ...invoiceData, total: text })}
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

                <View style={styles.inputContainer}>
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
                </View>

                <Icon.Button
                    style={styles.createBtn}
                    onPress={handleSubmit}
                    name="file-text"
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    iconStyle={{ fontSize: 19 }}
                    color={"white"}
                >
                    <Text style={{ color: 'white', fontSize: 20 }}>Add Invoice</Text>
                </Icon.Button>

            </ScrollView>
            {loading && <LoadingScreen />}
        </View>
    )
}

const styles = {
    formContainer: {
        marginTop: 30,
        paddingBottom: 40,
        paddingHorizontal: 30,
        backgroundColor: 'white'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
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
        border: 'none'
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
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#2bb378",
        justifyContent: "center"
    },
    redBtn: {
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ff3131",
        justifyContent: "center"
    },
    createBtn: {
        position: "relative",
        width: 185,
        height: 45,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        // borderWidth: 2,
        // borderColor: "#2bb378",
        backgroundColor: "#0071cd",
        justifyContent: "center",
        alignSelf: "center"
    },
};

export default AddInvoice