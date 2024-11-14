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
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';

const PosSimulator = (props) => {
    const navigate = useNavigate({});
    const location = useLocation();
    const today = dayjs();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState({});
    const [taxPercent, setTaxPercent] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [billData, setBillData] = useState({
        tenantId: userInfo.user.tenant,
        billPosRef: '',
        billNumber: '',
        customerName: '',
        billingDate: null,
        itemsOrdered: [],
        discountAmount: 0,
        total: '',
        taxAmount: 0,
        totalPayable: ''
    });

    useEffect(() => {
        props.setHeaderTitle('Billing')
    }, [])

    const getRecipes = async () => {
        try {
            setLoading(true)
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-recipes', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setRecipes(result.data.recipes)
            setLoading(false)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getRecipes();
    }, []);

    useEffect(() => {
        const randomBillNumber = 'BILL-' + Math.floor(100000 + Math.random() * 900000);
        const randomBillPosRefNumber = 'beavertail_inbuilt_pos_' + Math.floor(100000 + Math.random() * 900000);
        setBillData({ ...billData, billNumber: randomBillNumber, billPosRef: randomBillPosRefNumber});
    }, []);

    const toggleSearchDropdown = () => {
        if (isDropdownVisible) {
            setIsDropdownVisible(false);
            setSearchResults([]);
        } else {
            setIsDropdownVisible(true);
            setSearchResults(recipes);
        }
    };

    const handleRecipeSearch = (text) => {
        const results = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if (text.length == 0) {
            setSearchResults(recipes)
        }
    };

    const handleAddItem = (recipe) => {
        setSelectedRecipe({ recipe });
        setBillData({
            ...billData,
            itemsOrdered: [...billData.itemsOrdered, {
                name: recipe.name,
                quantity: '',
                menuPrice: recipe.menuPrice,
                total: '',
                totalPayable: ''
            }],
        });
        setSearchTerm('');
        setSearchResults([]);
        setIsDropdownVisible(false)
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...billData.itemsOrdered]
        updatedItems[index][field] = value
        if (field === 'quantity') {
            const quantity = updatedItems[index]['quantity'] || 0;
            updatedItems[index]['total'] = (quantity * updatedItems[index]['menuPrice']).toFixed(2);
            updatedItems[index]['totalPayable'] = (quantity * updatedItems[index]['menuPrice']).toFixed(2);
        }
        setBillData({ ...billData, itemsOrdered: updatedItems })
    };

    const handleDeleteItem = async (index) => {
        const updatedItems = [...billData.itemsOrdered];
        updatedItems.splice(index, 1);

        setBillData((prevBillData) => ({
            ...prevBillData,
            itemsOrdered: updatedItems,
        }));
    };

    const calculateSubTotalAmount = () => {
        const totalAmount = billData.itemsOrdered.reduce((sum, item) => {
            const itemTotal = parseFloat(item.total) || 0;
            return sum + itemTotal;
        }, 0)

        setBillData((prevBillData) => ({
            ...prevBillData,
            total: totalAmount.toFixed(2),
        }))
    };

    const calculateTotalPayableAmount = () => {
        const totalAmount = billData.itemsOrdered.reduce((sum, item) => {
            const itemTotal = parseFloat(item.total) || 0;
            return sum + itemTotal;
        }, 0)
        const payableAmount = totalAmount + ((totalAmount * taxPercent) / 100)

        setBillData((prevBillData) => ({
            ...prevBillData,
            totalPayable: payableAmount.toFixed(2),
            taxAmount: (totalAmount * taxPercent) / 100
        }))
    }

    useEffect(() => {
        calculateTotalPayableAmount();
    }, [taxPercent])

    useEffect(() => {
        calculateSubTotalAmount()
        calculateTotalPayableAmount()
    }, [billData.itemsOrdered])

    const handleSubmit = async () => {
        try {
            setLoading(true)
            console.log(billData);
            const result = await client.post('/process-bill', billData, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                await setBillData({
                    tenantId: userInfo.user.tenant,
                    billNumber: 'BILL-' + Math.floor(100000 + Math.random() * 900000),
                    billPosRef: 'beavertail_inbuilt_pos_' + Math.floor(100000 + Math.random() * 900000),
                    customerName: '',
                    billingDate: null,
                    itemsOrdered: [],
                    discountAmount: 0,
                    total: '',
                    taxAmount: 0,
                    totalPayable: ''
                });
                // navigate('/foodcost')
                await setLoading(false)
                alert('Bill processed successfully!')
            } else {
                setLoading(false)
                alert(result.data.message)
            }
        } catch (error) {
            console.log(`error processing bill: ${error}`);
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.formContainer}
                scrollIndicatorInsets={{ right: -5 }} showsVerticalScrollIndicator={true}
            >
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bill Number</Text>
                    <TextInput
                        style={[styles.input]}
                        value={billData.billNumber}
                        onChangeText={(text) => setBillData({ ...billData, billNumber: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Customer Name</Text>
                    <TextInput
                        style={[styles.input]}
                        value={billData.customerName}
                        onChangeText={(text) => setBillData({ ...billData, customerName: text })}
                    />
                </View>
                <View style={[styles.inputContainer, { marginBottom: '12px' }]}>
                    <Text style={styles.label}>Billing Date</Text>
                    <DatePicker
                        defaultValue={today}
                        disableFuture
                        value={billData.billingDate}
                        onChange={(date) => setBillData({ ...billData, billingDate: date })}
                        formatDensity="spacious"
                        // format="DD-MM-YYYY"
                        slotProps={{ textField: { size: 'small' }, field: { clearable: true, onClear: () => setBillData({ ...billData, billingDate: null }) } }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Add Billing Items</Text>
                    {/* Search Input */}
                    <View style={styles.searchBarContainer}>
                        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search Item"
                            placeholderTextColor="gray"
                            selectTextOnFocus={false}
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                handleRecipeSearch(text);
                            }}
                            onFocus={() => { setSearchResults(recipes), setIsDropdownVisible(true) }}
                        />
                        <Icon name={isDropdownVisible ? "angle-up" : "angle-down"} size={20} color="gray" style={styles.dropdownIcon} onPress={toggleSearchDropdown} />
                    </View>
                    {/* Search Results */}
                    {isDropdownVisible && searchResults.length > 0 && (
                        <View style={{ maxHeight: 200 }}>
                            <FlatList
                                style={styles.dropdownMenu}
                                data={searchResults}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleAddItem(item)}
                                    >
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        </View>
                    )}
                    <View style={styles.headerContainer}>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Item</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Quantity</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Price ($)</Text></View>
                        <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Total ($)</Text></View>
                    </View>
                    {/* Ingredient Inputs */}
                    {billData.itemsOrdered.map((item, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Item"
                                placeholderTextColor="gray"
                                value={item.name}
                                editable={false}
                                onChangeText={(text) => handleItemChange(index, 'name', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Quantity"
                                placeholderTextColor="gray"
                                maxLength={3}
                                value={item.quantity ? item.quantity : ''}
                                onChangeText={(text) => {
                                    if (/^\d*\.?\d*$/.test(text)) {
                                        handleItemChange(index, 'quantity', parseFloat(text));
                                    }
                                }}
                            />
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Price"
                                placeholderTextColor="gray"
                                value={item.menuPrice != '' ? (item.menuPrice).toFixed(2) : ''}
                                editable={false}
                                onChangeText={(text) => handleItemChange(index, 'menuPrice', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Total"
                                placeholderTextColor="gray"
                                value={item.total}
                                editable={false}
                                onChangeText={(text) => {
                                    if (/^\d*\.?\d*$/.test(text)) {
                                        handleItemChange(index, 'total', text)
                                    }
                                }}
                            />
                            <Icon.Button style={styles.crossBtn}
                                name="times-circle-o"
                                onPress={() => { handleDeleteItem(index) }}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ margin: 0, padding: 0, fontSize: 25 }}
                                color={"gray"}>
                            </Icon.Button>
                        </View>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Sub Total ($)</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        value={billData.total}
                        editable={false}
                        onChangeText={(text) => {
                            if (/^\d*\.?\d*$/.test(text)) {
                                setBillData({ ...billData, total: text })
                            }
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tax (%)</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        maxLength={5}
                        value={taxPercent}
                        onChangeText={(text) => {
                            if (/^\d*\.?\d*$/.test(text)) {
                                setTaxPercent(text)
                            }
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Total Payable Amount ($)</Text>
                    <TextInput
                        style={[styles.input]}
                        keyboardType='numeric'
                        value={billData.totalPayable}
                        onChangeText={(text) => {
                            if (/^\d*\.?\d*$/.test(text)) {
                                setBillData({ ...billData, totalPayable: text })
                            }
                        }}
                    />
                </View>

                <View style={styles.createButtonsContainer}>
                    <Icon.Button
                        style={styles.greenCreateBtn}
                        onPress={() => handleSubmit()}
                        name="file-text-o"
                        backgroundColor="transparent"
                        underlayColor="transparent"
                        iconStyle={{ fontSize: 19 }}
                        color={"white"}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontFamily: 'inherit' }}>Generate Bill</Text>
                    </Icon.Button>
                </View>
            </ScrollView>
            {loading && <LoadingScreen />}
        </View>
    )
}

const styles = {
    formContainer: {
        // marginTop: 10,
        paddingBottom: 30,
        paddingTop: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        maxHeight: 'calc(100vh - 65px)'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        outlineWidth: 0
    },
    dropdownMenu: {
        zIndex: 10,
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
    createButtonsContainer: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    greenCreateBtn: {
        position: "relative",
        // width: 200,
        // height: 45,
        marginTop: 10,
        marginRight: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "#47bf93",
        justifyContent: "center",
        alignSelf: "center"
    },
}

export default PosSimulator